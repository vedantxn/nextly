import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { 
  createTRPCRouter, 
  protectedProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import {
  createQueuedGenerationJob,
  markGenerationJobFailed,
} from "@/lib/generation-jobs";
import {
  resolveAccessibleOrganizationBySlug,
  resolveActiveOrganizationId,
} from "@/lib/organization";

async function resolveRequestedOrganizationId(userId: string, session: { user?: { id?: string | null } | null; session?: { activeOrganizationId?: string | null } | null }, orgSlug?: string) {
  if (!orgSlug) {
    return resolveActiveOrganizationId(session);
  }

  const organization = await resolveAccessibleOrganizationBySlug(userId, orgSlug);

  if (!organization) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Organization not found",
    });
  }

  return organization.id;
}

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, {message: "Project ID is required"}),
        orgSlug: z.string().min(1).optional(),
      }),
    )
    .query(async({ input, ctx }) => {
      const organizationId = await resolveRequestedOrganizationId(
        ctx.user.id,
        ctx.session,
        input.orgSlug,
      );
      
      const exsitingProject = await prisma.project.findFirst({
        where: {
          id: input.id,
          organizationId,
        },
      });

      if (!exsitingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
      }
      
      return exsitingProject;
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string().min(1).optional(),
      }).optional(),
    )
    .query(async ({ input, ctx }) => {
      const organizationId = await resolveRequestedOrganizationId(
        ctx.user.id,
        ctx.session,
        input?.orgSlug,
      );
      const projects = await prisma.project.findMany({
        where: {
          organizationId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      
      return projects;
    }),
  create: protectedProcedure
    .input(
      z.object({
        value: z.string()
          .min(1, "Prompt cannot be empty")
          .max(1000, "Prompt cannot be longer than 1000 characters"),
        model: z.enum(["grok", "codex", "gemini"])
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const organizationId = await resolveActiveOrganizationId(ctx.session);

      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Something went wrong" });
        } else {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "You have reached your limit of requests" });
        }
      }

      const createdProject = await prisma.project.create({
        include: {
          messages: {
            take: 1,
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        data: {
          organizationId,
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            }
          }
        }
      });

      const triggerMessageId = createdProject.messages[0]?.id;

      if (!triggerMessageId) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create the initial project message",
        });
      }

      const generationJob = await createQueuedGenerationJob({
        projectId: createdProject.id,
        organizationId,
        triggerMessageId,
        model: input.model,
      });

      try {
        await inngest.send({
          name: "code-agent/run",
          data: {
            value: input.value,
            projectId: createdProject.id,
            model: input.model,
            jobId: generationJob.id,
          },
        });
      } catch (error) {
        await markGenerationJobFailed(
          generationJob.id,
          error instanceof Error ? error.message : "Failed to dispatch generation job",
        );
        throw error;
      }

      return createdProject;
    }),
});
