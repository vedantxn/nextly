//import { z } from 'zod';
//import { baseProcedure, createTRPCRouter } from '../init';
//import { inngest } from '@/inngest/client';
import { messagesRouter } from "@/modules/messages/server/procedures";
import { organizationsRouter } from "@/modules/organizations/server/procedures";
import { createTRPCRouter } from "../init";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedures";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  organizations: organizationsRouter,
  projects: projectsRouter,
  usage: usageRouter,
  //fragments: fragmentsRouter,
})

export type AppRouter = typeof appRouter;


/*export const appRouter = createTRPCRouter({
  
  invoke: baseProcedure
    .input(
      z.object({
        value: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await inngest.send({
        name: "test/hello.world",
        data: {
          value: input.value,
        },
      })
      return { ok: "success"};
    }),
  
  createAI: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter; */
