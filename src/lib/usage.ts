import { RateLimiterPrisma } from "rate-limiter-flexible";
import prisma from "./db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return session.user.id;
}

export async function consumeCredits() {
  const userId = await getAuthenticatedUserId();
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);
  return result;
}

export async function getUsageStatus() {
  const userId = await getAuthenticatedUserId();
  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}
