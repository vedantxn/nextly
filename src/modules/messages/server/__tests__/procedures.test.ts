import { describe, it, expect, vi, beforeEach } from "vitest";

const mockProjectFindFirst = vi.fn();
const mockMessageFindMany = vi.fn();
const mockMessageCreate = vi.fn();
const mockInngestSend = vi.fn();
const mockConsumeCredits = vi.fn();
const mockCreateQueuedGenerationJob = vi.fn();
const mockMarkGenerationJobFailed = vi.fn();

vi.mock("@/lib/db", () => ({
  default: {
    project: {
      findFirst: (...args: any[]) => mockProjectFindFirst(...args),
    },
    message: {
      findMany: (...args: any[]) => mockMessageFindMany(...args),
      create: (...args: any[]) => mockMessageCreate(...args),
    },
  },
}));
vi.mock("@/inngest/client", () => ({
  inngest: { send: (...args: any[]) => mockInngestSend(...args) },
}));
vi.mock("@/lib/usage", () => ({
  consumeCredits: (...args: any[]) => mockConsumeCredits(...args),
}));
vi.mock("@/lib/generation-jobs", () => ({
  createQueuedGenerationJob: (...args: any[]) => mockCreateQueuedGenerationJob(...args),
  markGenerationJobFailed: (...args: any[]) => mockMarkGenerationJobFailed(...args),
}));
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}));
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));
vi.mock("react", () => ({ cache: (fn: Function) => fn }));

import { createCallerFactory } from "@/trpc/init";
import { messagesRouter } from "../procedures";

const createCaller = createCallerFactory(messagesRouter);
const authedCtx = {
  session: { user: { id: "user-1" }, session: { activeOrganizationId: "org-1" } },
} as any;

describe("messagesRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockInngestSend.mockResolvedValue(undefined);
    mockConsumeCredits.mockResolvedValue(undefined);
    mockCreateQueuedGenerationJob.mockResolvedValue({ id: "job-1" });
    mockMarkGenerationJobFailed.mockResolvedValue(undefined);
  });

  describe("getMany", () => {
    it("returns messages scoped to user's project", async () => {
      const messages = [
        { id: "m1", content: "hello", fragment: null },
        { id: "m2", content: "world", fragment: { id: "f1" } },
      ];
      mockMessageFindMany.mockResolvedValue(messages);
      const caller = createCaller(authedCtx);

      const result = await caller.getMany({ projectId: "p1" });

      expect(result).toEqual(messages);
      expect(mockMessageFindMany).toHaveBeenCalledWith({
        where: {
          projectId: "p1",
          project: { organizationId: "org-1" },
        },
        orderBy: { updatedAt: "asc" },
        include: { fragment: true },
      });
    });

    it("rejects empty projectId", async () => {
      const caller = createCaller(authedCtx);
      await expect(caller.getMany({ projectId: "" })).rejects.toThrow();
    });
  });

  describe("create", () => {
    const validInput = {
      value: "Add dark mode",
      projectId: "p1",
      model: "gemini" as const,
    };

    it("checks project ownership before consuming credits", async () => {
      mockProjectFindFirst.mockResolvedValue(null);
      const caller = createCaller(authedCtx);

      await expect(caller.create(validInput)).rejects.toMatchObject({
        code: "NOT_FOUND",
      });
      expect(mockConsumeCredits).not.toHaveBeenCalled();
      expect(mockMessageCreate).not.toHaveBeenCalled();
    });

    it("creates message and dispatches inngest event", async () => {
      mockProjectFindFirst.mockResolvedValue({ id: "p1", organizationId: "org-1" });
      const created = { id: "m-new", content: "Add dark mode", role: "USER" };
      mockMessageCreate.mockResolvedValue(created);
      const caller = createCaller(authedCtx);

      const result = await caller.create(validInput);

      expect(result).toEqual(created);
      expect(mockConsumeCredits).toHaveBeenCalled();
      expect(mockMessageCreate).toHaveBeenCalledWith({
        data: {
          projectId: "p1",
          content: "Add dark mode",
          role: "USER",
          type: "RESULT",
        },
      });
      expect(mockCreateQueuedGenerationJob).toHaveBeenCalledWith({
        projectId: "p1",
        organizationId: "org-1",
        triggerMessageId: "m-new",
        model: "gemini",
      });
      expect(mockInngestSend).toHaveBeenCalledWith({
        name: "code-agent/run",
        data: {
          value: "Add dark mode",
          projectId: "p1",
          model: "gemini",
          jobId: "job-1",
        },
      });
    });

    it("marks the job as failed if dispatching to inngest fails", async () => {
      mockProjectFindFirst.mockResolvedValue({ id: "p1", organizationId: "org-1" });
      mockMessageCreate.mockResolvedValue({ id: "m-new", content: "Add dark mode", role: "USER" });
      mockInngestSend.mockRejectedValue(new Error("queue down"));
      const caller = createCaller(authedCtx);

      await expect(caller.create(validInput)).rejects.toThrow("queue down");
      expect(mockMarkGenerationJobFailed).toHaveBeenCalledWith("job-1", "queue down");
    });

    it("throws BAD_REQUEST when consumeCredits throws an Error", async () => {
      mockProjectFindFirst.mockResolvedValue({ id: "p1", organizationId: "org-1" });
      mockConsumeCredits.mockRejectedValue(new Error("Auth failed"));
      const caller = createCaller(authedCtx);

      await expect(caller.create(validInput)).rejects.toMatchObject({
        code: "BAD_REQUEST",
      });
      expect(mockMessageCreate).not.toHaveBeenCalled();
    });

    it("throws TOO_MANY_REQUESTS when consumeCredits throws a non-Error", async () => {
      mockProjectFindFirst.mockResolvedValue({ id: "p1", organizationId: "org-1" });
      mockConsumeCredits.mockRejectedValue("rate limited");
      const caller = createCaller(authedCtx);

      await expect(caller.create(validInput)).rejects.toMatchObject({
        code: "TOO_MANY_REQUESTS",
      });
    });

    it("rejects empty message", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({ value: "", projectId: "p1", model: "grok" })
      ).rejects.toThrow();
    });

    it("rejects message exceeding 1000 characters", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({
          value: "a".repeat(1001),
          projectId: "p1",
          model: "grok",
        })
      ).rejects.toThrow();
    });

    it("rejects invalid model", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({
          value: "hello",
          projectId: "p1",
          model: "invalid" as any,
        })
      ).rejects.toThrow();
    });

    it("rejects missing projectId", async () => {
      const caller = createCaller(authedCtx);
      await expect(
        caller.create({ value: "hello", projectId: "", model: "grok" })
      ).rejects.toThrow();
    });
  });
});
