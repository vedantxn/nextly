import { Sandbox } from "e2b";
import { SandboxAdapter, type SandboxFile, type SandboxReadResult } from "./types";

const SANDBOX_TIMEOUT = 60_000 * 10 * 3;

async function connectToSandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  await sandbox.setTimeout(SANDBOX_TIMEOUT);
  return sandbox;
}

class E2BSandboxAdapter implements SandboxAdapter {
  constructor(public readonly id: string) {}

  async runCommand(command: string) {
    const buffers = { stdout: "", stderr: "" };

    try {
      const sandbox = await connectToSandbox(this.id);
      const result = await sandbox.commands.run(command, {
        onStdout: (data: string) => {
          buffers.stdout += data;
        },
        onStderr: (data: string) => {
          buffers.stderr += data;
        },
      });

      return result.stdout;
    } catch (error) {
      const details = `Command failed: ${error} \nstddout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
      console.error(details);
      return details;
    }
  }

  async writeFiles(files: SandboxFile[]) {
    const sandbox = await connectToSandbox(this.id);

    for (const file of files) {
      await sandbox.files.write(file.path, file.content);
    }
  }

  async readFiles(paths: string[]): Promise<SandboxReadResult[]> {
    const sandbox = await connectToSandbox(this.id);
    const contents: SandboxReadResult[] = [];

    for (const path of paths) {
      const content = await sandbox.files.read(path);
      contents.push({ path, content });
    }

    return contents;
  }

  async getPreviewUrl(port: number) {
    const sandbox = await connectToSandbox(this.id);
    const host = sandbox.getHost(port);
    return `https://${host}`;
  }
}

export async function createE2BSandboxAdapter(template = "vedant-lovable-test-1") {
  const sandbox = await Sandbox.create(template);
  await sandbox.setTimeout(SANDBOX_TIMEOUT);
  return new E2BSandboxAdapter(sandbox.sandboxId);
}

export async function connectE2BSandboxAdapter(sandboxId: string) {
  await connectToSandbox(sandboxId);
  return new E2BSandboxAdapter(sandboxId);
}
