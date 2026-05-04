import { describe, expect, it } from "vitest";
import { extractTaskSummary } from "../runtime";

describe("extractTaskSummary", () => {
  it("returns the inner task summary content", () => {
    expect(
      extractTaskSummary(`
        <task_summary>
        Built a new dashboard.
        </task_summary>
      `),
    ).toBe("Built a new dashboard.");
  });

  it("returns undefined when no task summary tags are present", () => {
    expect(extractTaskSummary("No summary here.")).toBeUndefined();
  });
});
