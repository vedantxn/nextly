export type SandboxFile = {
  path: string;
  content: string;
};

export type SandboxReadResult = {
  path: string;
  content: string;
};

export type CommandResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

export type DirectoryEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
};

export interface SandboxAdapter {
  readonly id: string;
  // Granular file ops
  writeFile(path: string, content: string): Promise<void>;
  readFile(path: string): Promise<string>;
  listDirectory(path: string): Promise<DirectoryEntry[]>;
  // Batch ops (kept for compat)
  writeFiles(files: SandboxFile[]): Promise<void>;
  readFiles(paths: string[]): Promise<SandboxReadResult[]>;
  // Command execution — returns structured result
  runCommand(command: string): Promise<CommandResult>;
  // Preview
  getPreviewUrl(port: number): Promise<string>;
}
