import { inngest } from "./client";
import { openai,
         createAgent, 
         createTool, 
         createNetwork, 
         type Tool, 
         type Message, 
         createState } from "@inngest/agent-kit";
import { lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import prisma from "@/lib/db";
import { parseAgentOutput } from "./utils";
import { loadRecentProjectHistory } from "@/codegen/history";
import {
  createE2BSandboxAdapter,
  connectE2BSandboxAdapter,
  type SandboxAdapter,
} from "@/codegen/sandbox";
import {
  resolveLegacyFallbackModel,
  resolveLegacyProjectModel,
  type ProjectModelKey,
} from "@/codegen/models";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

function toAgentMessages(history: Awaited<ReturnType<typeof loadRecentProjectHistory>>): Message[] {
  return history.map((message) => ({
    type: "text",
    role: message.role,
    content: message.content,
  }));
}

function createSandboxTools(sandbox: SandboxAdapter) {
  return [
    createTool({
      name: "terminal",
      description: "Use the terminal to run commands",
      parameters: z.object({
        command: z.string(),
      }),
      handler: async ({ command }, { step }) => {
        return await step?.run("terminal", async () => {
          return sandbox.runCommand(command);
        });
      },
    }),
    createTool({
      name: "createOrUpdateFiles",
      description: "Create or update files in the sandbox",
      parameters: z.object({
        files: z.array(
          z.object({
            path: z.string(),
            content: z.string(),
          }),
        ),
      }),
      handler: async ({ files }, { step, network }: Tool.Options<AgentState>) => {
        const newFiles = await step?.run("createOrUpdateFiles", async () => {
          try {
            const updatedFiles = network.state.data.files || {};
            await sandbox.writeFiles(files);

            for (const file of files) {
              updatedFiles[file.path] = file.content;
            }

            return updatedFiles;
          } catch (error) {
            return "Error: " + error;
          }
        });

        if (typeof newFiles === "object") {
          network.state.data.files = newFiles;
        }
      },
    }),
    createTool({
      name: "readFiles",
      description: "Read files from the sandbx",
      parameters: z.object({
        files: z.array(z.string()),
      }),
      handler: async ({ files }, { step }) => {
        return await step?.run("readFiles", async () => {
          try {
            const contents = await sandbox.readFiles(files);
            return JSON.stringify(contents);
          } catch (error) {
            return "Error: " + error;
          }
        });
      },
    }),
  ];
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const selectedModel = event.data.model as ProjectModelKey | undefined;
    const chosenModel = resolveLegacyProjectModel(selectedModel);
    
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const adapter = await createE2BSandboxAdapter();
      return adapter.id;
    });
    const sandbox = await connectE2BSandboxAdapter(sandboxId);

    const previousMessages = await step.run("get-previous-messages", async () => {
      const history = await loadRecentProjectHistory(event.data.projectId, 5);
      return toAgentMessages(history);
    });

    const state = createState<AgentState>({
      summary: "",
      files: {},
    },
      { messages: previousMessages },
    );

    const codeAgent = createAgent<AgentState>({
      name: "codeAgent",
      description: "An expert coding angent",
      system: PROMPT,
      model: openai({
        model: chosenModel,
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE,
        defaultParameters: { temperature: 0.1 },
      }),

      tools: createSandboxTools(sandbox),
      lifecycle: {
       onResponse: async ({ result, network }) => {
        const lastAssistantMessageText = lastAssistantTextMessageContent(result);
        if (lastAssistantMessageText && network) {
          if (lastAssistantMessageText.includes("<task_summary>")) {
            network.state.data.summary = lastAssistantMessageText;
          }
        }

        return result;
       },
      },
    });
      
    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 15,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
      
        if (summary) {
          return;
        }
        return codeAgent;
      }
    })

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "A fragment title generator",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: resolveLegacyFallbackModel(),
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE,
        defaultParameters: { temperature: 0.1 },
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: resolveLegacyFallbackModel(),
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_API_BASE,
        defaultParameters: { temperature: 0.1 },
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(result.state.data.summary);
    const { output: responseOutput } = await responseGenerator.run(result.state.data.summary);

    const isError = 
      !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      return sandbox.getPreviewUrl(3000);
    });

    await step.run("save-result", async() => {
      if(isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Error: " + result.state.data.summary,
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: result.state.data.files,
            }
          }
        },
      });
    })
      
    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
