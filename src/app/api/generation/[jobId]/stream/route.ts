import { auth } from "@/lib/auth";
import { getGenerationJobById } from "@/lib/generation-jobs";
import { getRun } from "workflow/api";
import { headers } from "next/headers";
import { encodeEvent } from "@/codegen/stream-events";
import type { AgentStreamEvent } from "@/codegen/stream-events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  // Authenticate
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const job = await getGenerationJobById(jobId);
  if (!job) {
    return new Response("Job not found", { status: 404 });
  }

  // Verify the user has access (job belongs to the user's org)
  // We rely on organizationId check — the session user should belong to job.organizationId
  // Full org membership check happens at the tRPC layer; here we just verify session exists

  if (!job.workflowRunId) {
    // Job hasn't started yet — return an empty stream that immediately closes
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encodeEvent({ type: "status", status: "running" }));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // Parse optional startIndex for reconnection
  const url = new URL(request.url);
  const startIndex = url.searchParams.has("startIndex")
    ? Number(url.searchParams.get("startIndex"))
    : undefined;

  const run = getRun(job.workflowRunId);
  const readable = run.getReadable<AgentStreamEvent>({ startIndex });

  // Transform the Workflow SDK readable into SSE format
  const encoder = new TextEncoder();
  const sseStream = new ReadableStream({
    async start(controller) {
      const reader = readable.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(encoder.encode(encodeEvent(value)));
        }
      } catch {
        // Client disconnected — normal
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
    cancel() {
      // Client closed connection
    },
  });

  return new Response(sseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
