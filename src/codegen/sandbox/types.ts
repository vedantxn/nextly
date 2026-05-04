export type SandboxFile = {
  path: string;
  content: string;
};

export type SandboxReadResult = {
  path: string;
  content: string;
};

export interface SandboxAdapter {
  readonly id: string;
  runCommand(command: string): Promise<string>;
  writeFiles(files: SandboxFile[]): Promise<void>;
  readFiles(paths: string[]): Promise<SandboxReadResult[]>;
  getPreviewUrl(port: number): Promise<string>;
}
