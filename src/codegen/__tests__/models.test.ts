import { describe, expect, it } from "vitest";
import {
  DEFAULT_PROJECT_MODEL,
  resolveFallbackModel,
  resolveProjectModel,
} from "../models";

describe("codegen model resolution", () => {
  it("resolves to gpt-5.4", () => {
    expect(resolveProjectModel("gpt-5.4")).toBe("gpt-5.4");
  });

  it("falls back to gpt-5.4 when none is provided", () => {
    expect(resolveProjectModel(undefined)).toBe(DEFAULT_PROJECT_MODEL);
  });

  it("uses gpt-5.4 as the fallback model", () => {
    expect(resolveFallbackModel()).toBe("gpt-5.4");
  });
});
