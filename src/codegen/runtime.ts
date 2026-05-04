import { openai } from "@ai-sdk/openai";
import { generateText, stepCountIs, tool, type ModelMessage } from "ai";
import z from "zod";
import {
  FRAGMENT_TITLE_PROMPT,
  PROMPT,
  RESPONSE_PROMPT,
} from "@/prompt";
import type { CodegenHistoryMessage } from "@/codegen/history";
import {
  resolveFallbackModel,
  resolveProjectModel,
  type ProjectModelKey,
} from "@/codegen/models";
import type { SandboxAdapter } from "@/codegen/sandbox";

const TASK_SUMMARY_REGEX = /<task_summary>\s*([\s\S]*?)\s*<\/task_summary>/i;

export type CodegenRunResult = {
  summary: string | undefined;
  files: Record<string, string>;
};

function toModelMessages(history: CodegenHistoryMessage[]): ModelMessage[] {
  return history.map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export function extractTaskSummary(value: string) {
  const match = TASK_SUMMARY_REGEX.exec(value);
  return match?.[1]?.trim();
}

function createCodegenTools(sandbox: SandboxAdapter, files: Record<string, string>) {
  return {
    terminal: tool({
      description: "Use the terminal to run commands",
      inputSchema: z.object({
        command: z.string(),
      }),
      execute: async ({ command }) => sandbox.runCommand(command),
    }),
    createOrUpdateFiles: tool({
      description: "Create or update files in the sandbox",
      inputSchema: z.object({
        files: z.array(
          z.object({
            path: z.string(),
            content: z.string(),
          }),
        ),
      }),
      execute: async ({ files: fileBatch }) => {
        await sandbox.writeFiles(fileBatch);

        for (const file of fileBatch) {
          files[file.path] = file.content;
        }

        return {
          updatedPaths: fileBatch.map((file) => file.path),
        };
      },
    }),
    readFiles: tool({
      description: "Read files from the sandbox",
      inputSchema: z.object({
        files: z.array(z.string()),
      }),
      execute: async ({ files: paths }) => {
        return sandbox.readFiles(paths);
      },
    }),
  };
}

async function generatePlainText(system: string, prompt: string) {
  const { text } = await generateText({
    model: openai(resolveFallbackModel()),
    system,
    prompt,
    temperature: 0.1,
  });

  return text.trim();
}

export async function runCodegenAgent(input: {
  prompt: string;
  history: CodegenHistoryMessage[];
  model: ProjectModelKey | undefined;
  sandbox: SandboxAdapter;
}): Promise<CodegenRunResult> {
  const files: Record<string, string> = {};
  const result = await generateText({
    model: openai(resolveProjectModel(input.model)),
    system: PROMPT,
    messages: [
      ...toModelMessages(input.history),
      {
        role: "user",
        content: input.prompt,
      },
    ],
    tools: createCodegenTools(input.sandbox, files),
    stopWhen: stepCountIs(15),
    temperature: 0.1,
  });

  const summary = extractTaskSummary(result.text);

  return {
    summary,
    files,
  };
}

export async function generateFragmentTitle(summary: string) {
  return generatePlainText(FRAGMENT_TITLE_PROMPT, summary);
}

export async function generateUserFacingResponse(summary: string) {
  return generatePlainText(RESPONSE_PROMPT, summary);
}
