"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { decodeEventLine, type AgentStreamEvent } from "@/codegen/stream-events";

export type GenerationStreamState = {
  events: AgentStreamEvent[];
  status: "idle" | "connecting" | "streaming" | "done" | "error";
  currentStatus: string | null;
  pendingQuestion: { question: string; hookToken: string } | null;
  error: string | null;
};

export function useGenerationStream(jobId: string | null) {
  const [state, setState] = useState<GenerationStreamState>({
    events: [],
    status: "idle",
    currentStatus: null,
    pendingQuestion: null,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);
  const startIndexRef = useRef<number | undefined>(undefined);

  const connect = useCallback(
    (id: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState((prev) => ({ ...prev, status: "connecting", events: [], error: null }));

      const url = startIndexRef.current !== undefined
        ? `/api/generation/${id}/stream?startIndex=${startIndexRef.current}`
        : `/api/generation/${id}/stream`;

      (async () => {
        try {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok || !response.body) {
            throw new Error("Stream failed: " + response.status);
          }

          setState((prev) => ({ ...prev, status: "streaming" }));

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let chunkIndex = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            chunkIndex++;

            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const event = decodeEventLine(line);
              if (!event) continue;

              startIndexRef.current = chunkIndex;

              setState((prev) => {
                const next: GenerationStreamState = {
                  ...prev,
                  events: [...prev.events, event],
                };

                if (event.type === "status") {
                  next.currentStatus = event.status;
                } else if (event.type === "ask_user") {
                  next.pendingQuestion = { question: event.question, hookToken: event.hookToken };
                  next.currentStatus = "waiting_for_user";
                } else if (event.type === "done" || event.type === "error") {
                  next.status = "done";
                  next.pendingQuestion = null;
                }

                return next;
              });
            }
          }

          setState((prev) => ({ ...prev, status: "done" }));
        } catch (err) {
          if ((err as Error).name === "AbortError") return;
          // Attempt reconnect on network failure
          setState((prev) => ({
            ...prev,
            status: "error",
            error: (err as Error).message,
          }));
        }
      })();
    },
    [],
  );

  const respond = useCallback(async (jobId: string, hookToken: string, answer: string) => {
    setState((prev) => ({ ...prev, pendingQuestion: null }));
    await fetch(`/api/generation/${jobId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hookToken, answer }),
    });
  }, []);

  useEffect(() => {
    if (!jobId) return;
    startIndexRef.current = undefined;
    connect(jobId);
    return () => {
      abortRef.current?.abort();
    };
  }, [jobId, connect]);

  return { state, respond };
}
