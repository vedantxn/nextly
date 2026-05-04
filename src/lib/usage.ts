import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { resolveActiveOrganizationId } from "@/lib/organization";

const POINTS = 100;
const DURATION = 30 * 24 * 60 * 60; // 30 days
const GENERATION_COST = 1;

export async function getUsageTracker() {
  const usageTracker = new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "RateLimiter",
    points: POINTS,
    duration: DURATION,
  });

  return usageTracker;
}

async function getAuthenticatedOrganizationId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const organizationId = await resolveActiveOrganizationId(session);
  return organizationId;
}

export async function consumeCredits() {
  const organizationId = await getAuthenticatedOrganizationId();
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(`organization:${organizationId}`, GENERATION_COST);
  return result;
}

export async function getUsageStatus() {
  const organizationId = await getAuthenticatedOrganizationId();
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(`organization:${organizationId}`);
  return result;
}
