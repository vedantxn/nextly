import { messagesRouter } from "@/modules/messages/server/procedures";
import { generationJobsRouter } from "@/modules/generation-jobs/server/procedures";
import { organizationsRouter } from "@/modules/organizations/server/procedures";
import { createTRPCRouter } from "../init";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedures";

export const appRouter = createTRPCRouter({
  generationJobs: generationJobsRouter,
  messages: messagesRouter,
  organizations: organizationsRouter,
  projects: projectsRouter,
  usage: usageRouter,
});

export type AppRouter = typeof appRouter;
