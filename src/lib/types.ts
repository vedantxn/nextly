export type Fragment = {
  id: string;
  messageId: string;
  sandboxUrl: string;
  title: string;
  files: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export type MessageRole = "USER" | "ASSISTANT";
export type MessageType = "RESULT" | "ERROR";
