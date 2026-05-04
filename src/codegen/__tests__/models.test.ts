import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROJECT_MODEL,
  resolveFallbackModel,
  resolveProjectModel,
} from "../models";

describe("codegen model resolution", () => {
  it("uses the configured OpenAI mapping for each project model key", () => {
    expect(resolveProjectModel("grok")).toBe("gpt-5-mini");
    expect(resolveProjectModel("codex")).toBe("gpt-5");
    expect(resolveProjectModel("gemini")).toBe("gpt-4.1-mini");
  });

  it("falls back to the default project model when none is provided", () => {
    expect(resolveProjectModel(undefined)).toBe(
      resolveProjectModel(DEFAULT_PROJECT_MODEL),
    );
  });

  it("uses a stable fallback OpenAI model", () => {
    expect(resolveFallbackModel()).toBe("gpt-5-mini");
  });
});
