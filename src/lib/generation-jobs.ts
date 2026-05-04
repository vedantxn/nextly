import prisma from "@/lib/db";

const GENERATION_JOB_STATUS = {
  QUEUED: "QUEUED",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELED: "CANCELED",
} as const;

type CreateGenerationJobInput = {
  projectId: string;
  organizationId: string;
  triggerMessageId: string;
  model: string;
};

export async function createQueuedGenerationJob(input: CreateGenerationJobInput) {
  return prisma.generationJob.create({
    data: {
      projectId: input.projectId,
      organizationId: input.organizationId,
      triggerMessageId: input.triggerMessageId,
      model: input.model,
      status: GENERATION_JOB_STATUS.QUEUED,
    },
  });
}

export async function markGenerationJobRunning(jobId: string) {
  return prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: GENERATION_JOB_STATUS.RUNNING,
      attemptCount: {
        increment: 1,
      },
      startedAt: new Date(),
      completedAt: null,
      failedAt: null,
      lastError: null,
    },
  });
}

export async function markGenerationJobCompleted(jobId: string) {
  return prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: GENERATION_JOB_STATUS.COMPLETED,
      completedAt: new Date(),
      failedAt: null,
      lastError: null,
    },
  });
}

export async function markGenerationJobFailed(jobId: string, error: string) {
  return prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: GENERATION_JOB_STATUS.FAILED,
      failedAt: new Date(),
      lastError: error,
    },
  });
}

export async function attachGenerationJobWorkflowRun(jobId: string, workflowRunId: string) {
  return prisma.generationJob.update({
    where: { id: jobId },
    data: {
      workflowRunId,
    },
  });
}
