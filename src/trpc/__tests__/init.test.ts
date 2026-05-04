import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));
vi.mock("react", () => ({
  cache: (fn: Function) => fn,
}));

import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  createCallerFactory,
  protectedProcedure,
} from "../init";

const testRouter = createTRPCRouter({
  whoami: protectedProcedure.query(({ ctx }) => ctx.user),
});

const createCaller = createCallerFactory(testRouter);

describe("protectedProcedure", () => {
  it("throws UNAUTHORIZED when session is null", async () => {
    const caller = createCaller({ session: null });

    await expect(caller.whoami()).rejects.toThrow(TRPCError);
    await expect(caller.whoami()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  });

  it("throws UNAUTHORIZED when session has no user", async () => {
    const caller = createCaller({ session: { user: null } } as any);

    await expect(caller.whoami()).rejects.toThrow(TRPCError);
  });

  it("passes user into context when authenticated", async () => {
    const mockUser = { id: "user-1", name: "Test", email: "test@test.com" };
    const caller = createCaller({
      session: { user: mockUser, session: {} },
    } as any);

    const result = await caller.whoami();
    expect(result).toEqual(mockUser);
  });
});
