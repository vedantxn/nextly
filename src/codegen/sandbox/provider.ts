import {
  connectE2BSandboxAdapter,
  createE2BSandboxAdapter,
} from "./e2b-adapter";

export type SandboxProvider = "e2b" | "daytona";

function resolveSandboxProvider(): SandboxProvider {
  const configured = process.env.SANDBOX_PROVIDER?.toLowerCase();

  if (!configured || configured === "e2b") {
    return "e2b";
  }

  if (configured === "daytona") {
    throw new Error(
      "SANDBOX_PROVIDER=daytona is not supported yet. Complete the Daytona adapter migration before enabling it.",
    );
  }

  throw new Error(`Unsupported sandbox provider: ${configured}`);
}

export async function createSandboxAdapter() {
  switch (resolveSandboxProvider()) {
    case "e2b":
      return createE2BSandboxAdapter();
  }

  throw new Error("No sandbox adapter is configured");
}

export async function connectSandboxAdapter(sandboxId: string) {
  switch (resolveSandboxProvider()) {
    case "e2b":
      return connectE2BSandboxAdapter(sandboxId);
  }

  throw new Error("No sandbox adapter is configured");
}
