"use client";

import { formatDuration, intervalToDuration } from "date-fns";
import { useMemo } from "react";

interface Props {
  points: number;
  msBeforeNext: number;
}

export const Usage = ({ points, msBeforeNext }: Props) => {
  const resetTime = useMemo(() => {
    try {
      return formatDuration(
        intervalToDuration({
          start: new Date(),
          end: new Date(Date.now() + msBeforeNext),
        }),
        { format: ["months", "days", "hours", "minutes"] }
      );
    } catch (error) {
      console.error("Error formatting duration", error);
      return "unknown";
    }
  }, [msBeforeNext]);

  return (
    <div className="relative w-full max-w-3xl mx-auto p-3 rounded-2xl bg-background/60 border border-border backdrop-blur-md shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground">
            {points} credits remaining
          </p>
          <p className="text-xs text-muted-foreground">
            Resets in {resetTime}
          </p>
        </div>
      </div>

      <div className="relative w-full h-2 rounded-full bg-muted-foreground/30 overflow-hidden mt-2">
        <div
          className="h-full rounded-full transition-all bg-primary"
          style={{
            width: `${Math.min(points, 100)}%`,
          }}
        />
      </div>
    </div>
  );
};
