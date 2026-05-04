import prisma from "@/lib/db";
import { resolveActiveOrganizationId } from "@/lib/organization";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const generationJobsRouter = createTRPCRouter({
  latestForProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "Project ID is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const organizationId = await resolveActiveOrganizationId(ctx.session);

      return prisma.generationJob.findFirst({
        where: {
          projectId: input.projectId,
          organizationId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          workflowRunId: true,
          triggerMessageId: true,
          lastError: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});

export type GenerationJobsRouter = typeof generationJobsRouter;
