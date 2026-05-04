import prisma from "@/lib/db";
import {
  generateFragmentTitle,
  generateUserFacingResponse,
  runCodegenAgent,
} from "@/codegen/runtime";
import { loadRecentProjectHistory } from "@/codegen/history";
import {
  createSandboxAdapter,
  connectSandboxAdapter,
} from "@/codegen/sandbox";
import { type ProjectModelKey } from "@/codegen/models";
import {
  markGenerationJobCompleted,
  markGenerationJobFailed,
  markGenerationJobRunning,
} from "@/lib/generation-jobs";

type CodegenWorkflowInput = {
  prompt: string;
  projectId: string;
  model: ProjectModelKey | undefined;
  jobId?: string;
};

async function markJobRunningStep(jobId: string) {
  "use step";

  await markGenerationJobRunning(jobId);
}

async function markJobCompletedStep(jobId: string) {
  "use step";

  await markGenerationJobCompleted(jobId);
}

async function markJobFailedStep(jobId: string, error: string) {
  "use step";

  await markGenerationJobFailed(jobId, error);
}

async function createSandboxStep() {
  "use step";

  const adapter = await createSandboxAdapter();
  return adapter.id;
}

async function loadHistoryStep(projectId: string) {
  "use step";

  return loadRecentProjectHistory(projectId, 5);
}

async function runAgentStep(input: CodegenWorkflowInput, sandboxId: string) {
  "use step";

  const sandbox = await connectSandboxAdapter(sandboxId);
  const history = await loadRecentProjectHistory(input.projectId, 5);

  return runCodegenAgent({
    prompt: input.prompt,
    history,
    model: input.model,
    sandbox,
  });
}

async function getSandboxPreviewStep(sandboxId: string) {
  "use step";

  const sandbox = await connectSandboxAdapter(sandboxId);
  return sandbox.getPreviewUrl(3000);
}

async function generateFragmentTitleStep(summary: string) {
  "use step";

  return generateFragmentTitle(summary);
}

async function generateUserResponseStep(summary: string) {
  "use step";

  return generateUserFacingResponse(summary);
}

async function saveAssistantErrorStep(projectId: string, errorMessage: string) {
  "use step";

  await prisma.message.create({
    data: {
      projectId,
      content: "Error: " + errorMessage,
      role: "ASSISTANT",
      type: "ERROR",
    },
  });
}

async function saveAssistantResultStep(input: {
  projectId: string;
  content: string;
  sandboxUrl: string;
  title: string;
  files: Record<string, string>;
}) {
  "use step";

  await prisma.message.create({
    data: {
      projectId: input.projectId,
      content: input.content,
      role: "ASSISTANT",
      type: "RESULT",
      fragment: {
        create: {
          sandboxUrl: input.sandboxUrl,
          title: input.title,
          files: input.files,
        },
      },
    },
  });
}

export async function codegenWorkflow(input: CodegenWorkflowInput) {
  "use workflow";

  if (input.jobId) {
    await markJobRunningStep(input.jobId);
  }

  try {
    await loadHistoryStep(input.projectId);
    const sandboxId = await createSandboxStep();
    const result = await runAgentStep(input, sandboxId);
    const sandboxUrl = await getSandboxPreviewStep(sandboxId);

    const summary = result.summary?.trim();
    const hasFiles = Object.keys(result.files).length > 0;

    if (!summary || !hasFiles) {
      const errorMessage = summary || "The generation finished without producing files.";
      await saveAssistantErrorStep(input.projectId, errorMessage);

      if (input.jobId) {
        await markJobFailedStep(input.jobId, errorMessage);
      }

      return {
        url: sandboxUrl,
        title: "Fragment",
        files: result.files,
        summary: errorMessage,
      };
    }

    const fragmentTitle = await generateFragmentTitleStep(summary);
    const responseText = await generateUserResponseStep(summary);

    await saveAssistantResultStep({
      projectId: input.projectId,
      content: responseText,
      sandboxUrl,
      title: fragmentTitle,
      files: result.files,
    });

    if (input.jobId) {
      await markJobCompletedStep(input.jobId);
    }

    return {
      url: sandboxUrl,
      title: fragmentTitle,
      files: result.files,
      summary,
    };
  } catch (error) {
    if (input.jobId) {
      await markJobFailedStep(
        input.jobId,
        error instanceof Error ? error.message : "The generation workflow crashed before completion",
      );
    }

    throw error;
  }
}
