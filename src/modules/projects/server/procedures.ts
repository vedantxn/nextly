import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { 
  createTRPCRouter, 
  protectedProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import { resolveActiveOrganizationId } from "@/lib/organization";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, {message: "Project ID is required"}),
      }),
    )
    .query(async({ input, ctx }) => {
      const organizationId = await resolveActiveOrganizationId(ctx.session);
      
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
    .query(async ({ ctx }) => {
      const organizationId = await resolveActiveOrganizationId(ctx.session);
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
      })

      await inngest.send({
        name: "code-agent/run",
        data: { 
            value: input.value,
            projectId: createdProject.id,
            model: input.model
        },
      });

      return createdProject;
    }),
});
