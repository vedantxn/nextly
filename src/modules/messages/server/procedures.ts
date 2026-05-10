import { z } from "zod";
import prisma from "@/lib/db";
import { start } from "workflow/api";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import {
  attachGenerationJobWorkflowRun,
  createQueuedGenerationJob,
  markGenerationJobFailed,
} from "@/lib/generation-jobs";
import { resolveActiveOrganizationId } from "@/lib/organization";
import { codegenWorkflow } from "@/workflows/codegen";

export const messagesRouter = createTRPCRouter({
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const organizationId = await resolveActiveOrganizationId(ctx.session);
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            organizationId,
          },
        },
        orderBy: {
          updatedAt: "asc",
        },
        include: {
          fragment: true,
        },
      });

      return messages;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Message cannot be empty" })
          .max(1000, { message: "Message cannot be longer than 1000 characters" }),
        projectId: z.string().min(1, { message: "Project ID is required" }),
        model: z.enum(["gpt-5.4"]),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const organizationId = await resolveActiveOrganizationId(ctx.session);
      const exsitingProject = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          organizationId,
        },
      });

      if (!exsitingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have reached your limit of requests",
          });
        }
      }

      const createdMessage = await prisma.message.create({
        data: {
          projectId: input.projectId,
          content: input.value,
          role: "USER",
          type: "RESULT",
          // TODO: save model to prisma DB
        },
      });

      const generationJob = await createQueuedGenerationJob({
        projectId: input.projectId,
        organizationId,
        triggerMessageId: createdMessage.id,
        model: input.model,
      });

      try {
        const run = await start(codegenWorkflow, [
          {
            prompt: input.value,
            projectId: input.projectId,
            model: input.model,
            jobId: generationJob.id,
          },
        ]);

        await attachGenerationJobWorkflowRun(generationJob.id, run.runId);
      } catch (error) {
        await markGenerationJobFailed(
          generationJob.id,
          error instanceof Error ? error.message : "Failed to dispatch generation job",
        );
        throw error;
      }

      return createdMessage;
    }),
});

export type MessagesRouter = typeof messagesRouter;
