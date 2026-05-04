import { afterEach, describe, expect, it, vi } from "vitest";

const mockCreateE2B = vi.fn();
const mockConnectE2B = vi.fn();

vi.mock("../sandbox/e2b-adapter", () => ({
  createE2BSandboxAdapter: (...args: any[]) => mockCreateE2B(...args),
  connectE2BSandboxAdapter: (...args: any[]) => mockConnectE2B(...args),
}));

import {
  connectSandboxAdapter,
  createSandboxAdapter,
} from "../sandbox/provider";

describe("sandbox provider", () => {
  const originalProvider = process.env.SANDBOX_PROVIDER;

  afterEach(() => {
    if (typeof originalProvider === "string") {
      process.env.SANDBOX_PROVIDER = originalProvider;
    } else {
      delete process.env.SANDBOX_PROVIDER;
    }
    vi.clearAllMocks();
  });

  it("defaults to the E2B adapter when no provider is configured", async () => {
    mockCreateE2B.mockResolvedValue({ id: "sandbox-1" });

    await createSandboxAdapter();

    expect(mockCreateE2B).toHaveBeenCalled();
  });

  it("throws when daytona is selected before the adapter exists", async () => {
    process.env.SANDBOX_PROVIDER = "daytona";

    await expect(createSandboxAdapter()).rejects.toThrow(/not supported yet/i);
  });

  it("connects through the E2B adapter while E2B is the active provider", async () => {
    mockConnectE2B.mockResolvedValue({ id: "sandbox-1" });

    await connectSandboxAdapter("sandbox-1");

    expect(mockConnectE2B).toHaveBeenCalledWith("sandbox-1");
  });
});
