import { describe, it, expect, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";

const mockFindFirst = vi.fn();
const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockInngestSend = vi.fn();
const mockConsumeCredits = vi.fn();

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findFirst: (...args: any[]) => mockFindFirst(...args),
      findMany: (...args: any[]) => mockFindMany(...args),
      create: (...args: any[]) => mockCreate(...args),
    },
  },
}));
vi.mock("@/inngest/client", () => ({
  inngest: { send: (...args: any[]) => mockInngestSend(...args) },
}));
vi.mock("@/lib/usage", () => ({
  consumeCredits: (...args: any[]) => mockConsumeCredits(...args),
}));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));
vi.mock("react", () => ({ cache: (fn: Function) => fn }));

import { createCallerFactory } from "@/trpc/init";
import { projectsRouter } from "../procedures";

const createCaller = createCallerFactory(projectsRouter);
const authedCtx = {
  session: { user: { id: "user-1" }, session: { activeOrganizationId: "org-1" } },
} as any;

describe("projectsRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInngestSend.mockResolvedValue(undefined);
    mockConsumeCredits.mockResolvedValue(undefined);
  });

  describe("getOne", () => {
    it("returns project when found and owned by user", async () => {
      const project = { id: "p1", name: "test", organizationId: "org-1" };
      mockFindFirst.mockResolvedValue(project);
      const caller = createCaller(authedCtx);

      const result = await caller.getOne({ id: "p1" });

      expect(result).toEqual(project);
      expect(mockFindFirst).toHaveBeenCalledWith({
        where: { id: "p1", organizationId: "org-1" },
      });
    });

    it("throws NOT_FOUND when project does not exist", async () => {
      mockFindFirst.mockResolvedValue(null);
      const caller = createCaller(authedCtx);

      await expect(caller.getOne({ id: "p1" })).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
    });

    it("rejects empty project ID", async () => {
      const caller = createCaller(authedCtx);
      await expect(caller.getOne({ id: "" })).rejects.toThrow();
    });
  });

  describe("getMany", () => {
    it("returns projects for the authenticated user", async () => {
      const projects = [{ id: "p1" }, { id: "p2" }];
      mockFindMany.mockResolvedValue(projects);
      const caller = createCaller(authedCtx);

      const result = await caller.getMany();

      expect(result).toEqual(projects);
      expect(mockFindMany).toHaveBeenCalledWith({
        where: { organizationId: "org-1" },
        orderBy: { updatedAt: "desc" },
      });
    });
  });

  describe("create", () => {
    const validInput = { value: "Build a todo app", model: "grok" as const };

    it("creates project and dispatches inngest event", async () => {
      const created = { id: "p-new", name: "cool-slug", organizationId: "org-1" };
      mockCreate.mockResolvedValue(created);
      const caller = createCaller(authedCtx);

      const result = await caller.create(validInput);

      expect(result).toEqual(created);
      expect(mockConsumeCredits).toHaveBeenCalled();
      expect(mockCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            organizationId: "org-1",
            messages: {
              create: {
                content: "Build a todo app",
                role: "USER",
                type: "RESULT",
              },
            },
          }),
        })
      );
      expect(mockInngestSend).toHaveBeenCalledWith({
        name: "code-agent/run",
        data: {
          value: "Build a todo app",
          projectId: "p-new",
          model: "grok",
        },
      });
    });

    it("throws BAD_REQUEST when consumeCredits throws an Error", async () => {
      mockConsumeCredits.mockRejectedValue(new Error("Auth failed"));
      const caller = createCaller(authedCtx);

      await expect(caller.create(validInput)).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("throws TOO_MANY_REQUESTS when consumeCredits throws a non-Error", async () => {
      mockConsumeCredits.mockRejectedValue("rate limited");
      const caller = createCaller(authedCtx);

      await expect(caller.create(validInput)).rejects.toMatchObject({
        code: "TOO_MANY_REQUESTS",
      });
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("rejects empty prompt", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({ value: "", model: "grok" })
      ).rejects.toThrow();
    });

    it("rejects prompt exceeding 1000 characters", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({ value: "a".repeat(1001), model: "grok" })
      ).rejects.toThrow();
    });

    it("rejects invalid model", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({ value: "hello", model: "invalid" as any })
      ).rejects.toThrow();
    });
  });
});
