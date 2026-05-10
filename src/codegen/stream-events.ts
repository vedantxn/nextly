export type AgentStreamEvent =
  | { type: "status"; status: "running" | "building" | "fixing" | "waiting_for_user" | "completed" | "failed" }
  | { type: "tool_start"; tool: string; args: Record<string, unknown> }
  | { type: "tool_result"; tool: string; result: unknown }
  | { type: "text_delta"; content: string }
  | { type: "build_result"; pass: boolean; errors?: string; attempt: number }
  | { type: "fix_attempt"; attempt: number; maxAttempts: number }
  | { type: "ask_user"; question: string; hookToken: string }
  | { type: "done"; summary: string }
  | { type: "error"; message: string }

export function encodeEvent(event: AgentStreamEvent): string {
  return "data: " + JSON.stringify(event) + "\n\n";
}

export function decodeEventLine(line: string): AgentStreamEvent | null {
  if (!line.startsWith("data: ")) return null;
  try {
    return JSON.parse(line.slice(6)) as AgentStreamEvent;
  } catch {
    return null;
  }
}
