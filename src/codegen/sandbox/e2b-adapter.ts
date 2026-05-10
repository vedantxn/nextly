import { Sandbox } from "e2b";
import type { SandboxAdapter, SandboxFile, SandboxReadResult, CommandResult, DirectoryEntry } from "./types";

const SANDBOX_TIMEOUT = 60_000 * 10 * 3;

class E2BSandboxAdapter implements SandboxAdapter {
  private _sandbox: Sandbox | null = null;

  constructor(public readonly id: string) {}

  private async getSandbox(): Promise<Sandbox> {
    if (!this._sandbox) {
      this._sandbox = await Sandbox.connect(this.id);
      await this._sandbox.setTimeout(SANDBOX_TIMEOUT);
    }
    return this._sandbox;
  }

  async runCommand(command: string): Promise<CommandResult> {
    const stdout: string[] = [];
    const stderr: string[] = [];

    try {
      const sandbox = await this.getSandbox();
      const result = await sandbox.commands.run(command, {
        onStdout: (data: string) => { stdout.push(data); },
        onStderr: (data: string) => { stderr.push(data); },
      });

      return {
        stdout: stdout.join(""),
        stderr: stderr.join(""),
        exitCode: result.exitCode,
      };
    } catch (error) {
      return {
        stdout: stdout.join(""),
        stderr: stderr.join("") || String(error),
        exitCode: 1,
      };
    }
  }

  async writeFile(path: string, content: string): Promise<void> {
    const sandbox = await this.getSandbox();
    await sandbox.files.write(path, content);
  }

  async readFile(path: string): Promise<string> {
    const sandbox = await this.getSandbox();
    return sandbox.files.read(path);
  }

  async listDirectory(path: string): Promise<DirectoryEntry[]> {
    const sandbox = await this.getSandbox();
    const entries = await sandbox.files.list(path);
    return entries.map((entry) => ({
      name: entry.name,
      path: entry.path,
      type: entry.type === "dir" ? "dir" : "file",
    }));
  }

  async writeFiles(files: SandboxFile[]): Promise<void> {
    for (const file of files) {
      await this.writeFile(file.path, file.content);
    }
  }

  async readFiles(paths: string[]): Promise<SandboxReadResult[]> {
    const results: SandboxReadResult[] = [];
    for (const path of paths) {
      const content = await this.readFile(path);
      results.push({ path, content });
    }
    return results;
  }

  async getPreviewUrl(port: number): Promise<string> {
    const sandbox = await this.getSandbox();
    const host = sandbox.getHost(port);
    return `https://${host}`;
  }
}

export async function createE2BSandboxAdapter(template = "nextly-base-dev") {
  const sandbox = await Sandbox.create(template);
  await sandbox.setTimeout(SANDBOX_TIMEOUT);
  return new E2BSandboxAdapter(sandbox.sandboxId);
}

export async function connectE2BSandboxAdapter(sandboxId: string) {
  return new E2BSandboxAdapter(sandboxId);
}
