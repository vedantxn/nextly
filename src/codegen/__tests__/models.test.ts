import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROJECT_MODEL,
  resolveLegacyFallbackModel,
  resolveLegacyProjectModel,
} from "../models";

describe("codegen model resolution", () => {
  it("uses the configured legacy mapping for each project model", () => {
    expect(resolveLegacyProjectModel("grok")).toBe("x-ai/grok-4-fast:free");
    expect(resolveLegacyProjectModel("codex")).toBe("openai/gpt-5-codex");
    expect(resolveLegacyProjectModel("gemini")).toBe("google/gemini-2.5-flash");
  });

  it("falls back to the default project model when none is provided", () => {
    expect(resolveLegacyProjectModel(undefined)).toBe(
      resolveLegacyProjectModel(DEFAULT_PROJECT_MODEL),
    );
  });

  it("uses the configured fallback model when no env override exists", () => {
    const existing = process.env.OPENAI_FREE2_MODEL;
    delete process.env.OPENAI_FREE2_MODEL;

    expect(resolveLegacyFallbackModel()).toBe("openai/gpt-oss-120b:free");

    process.env.OPENAI_FREE2_MODEL = existing;
  });
});
