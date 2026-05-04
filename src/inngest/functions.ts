import { inngest } from "./client";
import prisma from "@/lib/db";
import {
  generateFragmentTitle,
  generateUserFacingResponse,
  runCodegenAgent,
} from "@/codegen/runtime";
import { loadRecentProjectHistory } from "@/codegen/history";
import {
  createE2BSandboxAdapter,
  connectE2BSandboxAdapter,
} from "@/codegen/sandbox";
import { type ProjectModelKey } from "@/codegen/models";
import {
  markGenerationJobCompleted,
  markGenerationJobFailed,
  markGenerationJobRunning,
} from "@/lib/generation-jobs";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const jobId = typeof event.data.jobId === "string" ? event.data.jobId : undefined;
    const selectedModel = event.data.model as ProjectModelKey | undefined;

    if (jobId) {
      await step.run("mark-job-running", async () => {
        await markGenerationJobRunning(jobId);
      });
    }

    try {
      const sandboxId = await step.run("get-sandbox-id", async () => {
        const adapter = await createE2BSandboxAdapter();
        return adapter.id;
      });
      const sandbox = await connectE2BSandboxAdapter(sandboxId);

      const history = await step.run("get-previous-messages", async () => {
        return loadRecentProjectHistory(event.data.projectId, 5);
      });

      const result = await step.run("run-codegen-agent", async () => {
        return runCodegenAgent({
          prompt: event.data.value,
          history,
          model: selectedModel,
          sandbox,
        });
      });

      const summary = result.summary?.trim();
      const hasFiles = Object.keys(result.files).length > 0;
      const isError = !summary || !hasFiles;
      const errorMessage = summary || "The generation finished without producing files.";

      const sandboxUrl = await step.run("get-sandbox-url", async () => {
        return sandbox.getPreviewUrl(3000);
      });

      if (isError) {
        await step.run("save-error-result", async () => {
          await prisma.message.create({
            data: {
              projectId: event.data.projectId,
              content: "Error: " + errorMessage,
              role: "ASSISTANT",
              type: "ERROR",
            },
          });
        });

        if (jobId) {
          await step.run("mark-job-failed", async () => {
            await markGenerationJobFailed(jobId, errorMessage);
          });
        }

        return {
          url: sandboxUrl,
          title: "Fragment",
          files: result.files,
          summary: errorMessage,
        };
      }

      const [fragmentTitle, responseText] = await Promise.all([
        step.run("generate-fragment-title", async () => {
          return generateFragmentTitle(summary);
        }),
        step.run("generate-user-facing-response", async () => {
          return generateUserFacingResponse(summary);
        }),
      ]);

      await step.run("save-result", async () => {
        await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: responseText,
            role: "ASSISTANT",
            type: "RESULT",
            fragment: {
              create: {
                sandboxUrl,
                title: fragmentTitle,
                files: result.files,
              },
            },
          },
        });
      });

      if (jobId) {
        await step.run("mark-job-completed", async () => {
          await markGenerationJobCompleted(jobId);
        });
      }

      return {
        url: sandboxUrl,
        title: fragmentTitle,
        files: result.files,
        summary,
      };
    } catch (error) {
      if (jobId) {
        await step.run("mark-job-failed-unhandled", async () => {
          await markGenerationJobFailed(
            jobId,
            error instanceof Error
              ? error.message
              : "The generation job crashed before completion",
          );
        });
      }

      throw error;
    }
  },
);
