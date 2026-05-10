import { auth } from "@/lib/auth";
import { getGenerationJobById } from "@/lib/generation-jobs";
import { resumeHook } from "workflow/api";
import { headers } from "next/headers";
import { z } from "zod";

export const runtime = "nodejs";

const bodySchema = z.object({
  hookToken: z.string().min(1),
  answer: z.string(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  // Authenticate
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const job = await getGenerationJobById(jobId);
  if (!job) {
    return Response.json({ error: "Job not found" }, { status: 404 });
  }

  const body = bodySchema.safeParse(await request.json());
  if (!body.success) {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { hookToken, answer } = body.data;

  await resumeHook(hookToken, { answer });

  return Response.json({ ok: true });
}
