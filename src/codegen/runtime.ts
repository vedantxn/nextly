import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import z from "zod";
import {
  FRAGMENT_TITLE_PROMPT,
  PROMPT,
  RESPONSE_PROMPT,
} from "@/prompt";
import type { CodegenHistoryMessage } from "@/codegen/history";
import type { SandboxAdapter } from "@/codegen/sandbox";

const TASK_SUMMARY_REGEX = /<task_summary>\s*([\s\S]*?)\s*<\/task_summary>/i;

// Commands the agent is never allowed to run directly
const BLOCKED_COMMANDS = [
  /^\s*npm\s+run\s+(dev|build|start)/i,
  /^\s*next\s+(dev|build|start)/i,
  /^\s*yarn\s+(dev|build|start)/i,
  /^\s*pnpm\s+(dev|build|start)/i,
  /^\s*bun\s+(run\s+)?(dev|build|start)/i,
];

function isBlockedCommand(command: string): boolean {
  return BLOCKED_COMMANDS.some((re) => re.test(command));
}

export type CodegenRunResult = {
  summary: string | undefined;
  files: Record<string, string>;
  buildError?: string;
};

export type AgentStreamEvent =
  | { type: "status"; status: "running" | "building" | "fixing" | "waiting_for_user" | "completed" | "failed" }
  | { type: "tool_start"; tool: string; args: Record<string, unknown> }
  | { type: "tool_result"; tool: string; result: unknown }
  | { type: "text_delta"; content: string }
  | { type: "build_result"; pass: boolean; errors?: string; attempt: number }
  | { type: "fix_attempt"; attempt: number; maxAttempts: number }
  | { type: "ask_user"; question: string; hookToken: string }
  | { type: "done"; summary: string }
  | { type: "error"; message: string }

export type AgentStreamWriter = {
  write(event: AgentStreamEvent): void;
};

function toModelMessages(history: CodegenHistoryMessage[]): ModelMessage[] {
  return history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
}

export function extractTaskSummary(value: string): string | undefined {
  return TASK_SUMMARY_REGEX.exec(value)?.[1]?.trim();
}

function createAgentTools(
  sandbox: SandboxAdapter,
  files: Record<string, string>,
  stream?: AgentStreamWriter,
) {
  function emit(event: AgentStreamEvent) {
    stream?.write(event);
  }

  return {
    writeFile: tool({
      description: "Write or overwrite a single file in the sandbox. Use relative paths (e.g. 'app/page.tsx').",
      inputSchema: z.object({
        path: z.string().describe("Relative file path, e.g. 'app/page.tsx'"),
        content: z.string().describe("Full file content"),
      }),
      execute: async ({ path, content }) => {
        emit({ type: "tool_start", tool: "writeFile", args: { path } });
        await sandbox.writeFile(path, content);
        files[path] = content;
        const result = { written: path };
        emit({ type: "tool_result", tool: "writeFile", result });
        return result;
      },
    }),

    readFile: tool({
      description: "Read the full content of a single file. Use the actual sandbox path (e.g. '/home/user/app/page.tsx').",
      inputSchema: z.object({
        path: z.string().describe("Absolute sandbox path, e.g. '/home/user/app/page.tsx'"),
      }),
      execute: async ({ path }) => {
        emit({ type: "tool_start", tool: "readFile", args: { path } });
        const content = await sandbox.readFile(path);
        emit({ type: "tool_result", tool: "readFile", result: { path, length: content.length } });
        return { path, content };
      },
    }),

    listDirectory: tool({
      description: "List files and directories at a given path in the sandbox.",
      inputSchema: z.object({
        path: z.string().describe("Absolute sandbox path, e.g. '/home/user/app'"),
      }),
      execute: async ({ path }) => {
        emit({ type: "tool_start", tool: "listDirectory", args: { path } });
        const entries = await sandbox.listDirectory(path);
        emit({ type: "tool_result", tool: "listDirectory", result: { count: entries.length } });
        return entries;
      },
    }),

    searchFiles: tool({
      description: "Search for text across source files using grep. Returns matching lines with file names and line numbers.",
      inputSchema: z.object({
        pattern: z.string().describe("Literal text to search for"),
        path: z.string().optional().describe("Directory to search in. Defaults to /home/user"),
      }),
      execute: async ({ pattern, path }) => {
        const searchDir = path ?? "/home/user";
        emit({ type: "tool_start", tool: "searchFiles", args: { pattern, path: searchDir } });
        // Write pattern to a temp file to avoid any shell interpolation
        const tmpFile = "/tmp/grep_pattern_" + Date.now();
        await sandbox.writeFile(tmpFile, pattern);
        const result = await sandbox.runCommand(
          `grep -rn --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' -f ${tmpFile} ${searchDir} 2>/dev/null | head -50; rm -f ${tmpFile}`
        );
        const output = result.stdout || "(no matches)";
        emit({ type: "tool_result", tool: "searchFiles", result: { lines: output.split("\n").length } });
        return output;
      },
    }),

    terminal: tool({
      description: "Run a shell command in the sandbox. Cannot run dev/build/start scripts.",
      inputSchema: z.object({
        command: z.string().describe("Shell command to run"),
      }),
      execute: async ({ command }) => {
        if (isBlockedCommand(command)) {
          return { error: `Blocked: cannot run dev/build/start scripts. The dev server is already running with hot reload.` };
        }
        emit({ type: "tool_start", tool: "terminal", args: { command } });
        const result = await sandbox.runCommand(command);
        const output = result.stdout + (result.stderr ? `\nSTDERR: ${result.stderr}` : "");
        emit({ type: "tool_result", tool: "terminal", result: { exitCode: result.exitCode } });
        return { exitCode: result.exitCode, output };
      },
    }),

    installPackage: tool({
      description: "Install npm packages before importing them. Use this for any library that isn't pre-installed.",
      inputSchema: z.object({
        packages: z.array(z.string()).describe("Package names to install, e.g. ['date-fns', 'recharts']"),
      }),
      execute: async ({ packages }) => {
        // Validate package names to prevent injection (only allow npm-safe chars)
        const safe = packages.filter((p) => /^[@a-zA-Z0-9/_\-\.]+$/.test(p));
        if (safe.length !== packages.length) {
          return { error: "Invalid package name detected." };
        }
        emit({ type: "tool_start", tool: "installPackage", args: { packages: safe } });
        const result = await sandbox.runCommand(
          "npm install " + safe.join(" ") + " --yes 2>&1"
        );
        const success = result.exitCode === 0;
        emit({ type: "tool_result", tool: "installPackage", result: { success, packages: safe } });
        return { success, output: result.stdout.slice(0, 300) };
      },
    }),

    // Legacy batch tool — kept so the system prompt instructions still work
    createOrUpdateFiles: tool({
      description: "Create or update multiple files at once.",
      inputSchema: z.object({
        files: z.array(z.object({ path: z.string(), content: z.string() })),
      }),
      execute: async ({ files: fileBatch }) => {
        emit({ type: "tool_start", tool: "createOrUpdateFiles", args: { count: fileBatch.length } });
        await sandbox.writeFiles(fileBatch);
        for (const f of fileBatch) {
          files[f.path] = f.content;
        }
        const result = { updatedPaths: fileBatch.map((f) => f.path) };
        emit({ type: "tool_result", tool: "createOrUpdateFiles", result });
        return result;
      },
    }),
  };
}

const MAX_BUILD_FIX_ATTEMPTS = 3;
const MAX_AGENT_STEPS = 25;

export async function runCodegenAgent(input: {
  prompt: string;
  history: CodegenHistoryMessage[];
  sandbox: SandboxAdapter;
  stream?: AgentStreamWriter;
}): Promise<CodegenRunResult> {
  const files: Record<string, string> = {};
  const tools = createAgentTools(input.sandbox, files, input.stream);

  const messages: ModelMessage[] = [
    ...toModelMessages(input.history),
    { role: "user", content: input.prompt },
  ];

  input.stream?.write({ type: "status", status: "running" });

  let fixAttempts = 0;

  while (true) {
    const result = await generateText({
      model: openai("gpt-5.4"),
      system: PROMPT,
      messages,
      tools,
      stopWhen: stepCountIs(MAX_AGENT_STEPS),
      onStepFinish: ({ text }) => {
        if (text) {
          input.stream?.write({ type: "text_delta", content: text });
        }
      },
    });

    const summary = extractTaskSummary(result.text);

    if (summary) {
      // Agent declared done — run build verification
      input.stream?.write({ type: "status", status: "building" });

      const buildResult = await input.sandbox.runCommand(
        "cd /home/user && npx next build --no-lint 2>&1"
      );

      const buildPassed = buildResult.exitCode === 0;
      const buildErrors = buildPassed
        ? undefined
        : (buildResult.stderr || buildResult.stdout).slice(0, 3000);

      input.stream?.write({
        type: "build_result",
        pass: buildPassed,
        errors: buildErrors,
        attempt: fixAttempts + 1,
      });

      if (buildPassed) {
        input.stream?.write({ type: "done", summary });
        return { summary, files };
      }

      if (fixAttempts >= MAX_BUILD_FIX_ATTEMPTS) {
        input.stream?.write({
          type: "error",
          message: "Build failed after " + MAX_BUILD_FIX_ATTEMPTS + " fix attempts.",
        });
        return { summary, files, buildError: buildErrors };
      }

      fixAttempts++;
      input.stream?.write({ type: "fix_attempt", attempt: fixAttempts, maxAttempts: MAX_BUILD_FIX_ATTEMPTS });
      input.stream?.write({ type: "status", status: "fixing" });

      messages.push(
        { role: "assistant", content: result.text },
        {
          role: "user",
          content: "The build failed with these errors:\n\n" + buildErrors + "\n\nPlease fix the errors. Do not explain, just fix the files and respond with <task_summary> when done.",
        }
      );

      continue;
    }

    // Agent ran out of steps without a task_summary
    return { summary: undefined, files };
  }
}

export async function generateFragmentTitle(summary: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-5.4"),
    system: FRAGMENT_TITLE_PROMPT,
    prompt: summary,
  });
  return text.trim();
}

export async function generateUserFacingResponse(summary: string): Promise<string> {
  const { text } = await generateText({
    model: openai("gpt-5.4"),
    system: RESPONSE_PROMPT,
    prompt: summary,
  });
  return text.trim();
}
