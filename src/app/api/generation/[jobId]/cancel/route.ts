import { auth } from "@/lib/auth";
import { getGenerationJobById, markGenerationJobFailed } from "@/lib/generation-jobs";
import { getRun } from "workflow/api";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await getGenerationJobById(jobId);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  if (job.workflowRunId) {
    try {
      const run = getRun(job.workflowRunId);
      await run.cancel();
    } catch {
      // Run may have already finished — ignore
    }
  }

  await markGenerationJobFailed(jobId, "Cancelled by user");

  return Response.json({ ok: true });
}
