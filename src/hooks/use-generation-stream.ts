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

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 2000;

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
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback((id: string, isReconnect = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    if (!isReconnect) {
      setState((prev) => ({ ...prev, status: "connecting", events: [], error: null }));
    }

    const url = startIndexRef.current !== undefined
      ? `/api/generation/${id}/stream?startIndex=${startIndexRef.current}`
      : `/api/generation/${id}/stream`;

    (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok || !response.body) {
          throw new Error("Stream request failed: " + response.status);
        }

        reconnectAttemptsRef.current = 0;
        setState((prev) => ({ ...prev, status: "streaming", error: null }));

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let chunkIndex = startIndexRef.current ?? 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          chunkIndex++;
          startIndexRef.current = chunkIndex;

          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const event = decodeEventLine(line);
            if (!event) continue;

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

        setState((prev) => {
          if (prev.status !== "done") return { ...prev, status: "done" };
          return prev;
        });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        // Auto-reconnect on transient network errors
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current++;
          const delay = RECONNECT_DELAY_MS * reconnectAttemptsRef.current;
          setState((prev) => ({ ...prev, error: `Connection lost, reconnecting... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})` }));
          reconnectTimerRef.current = setTimeout(() => connect(id, true), delay);
        } else {
          setState((prev) => ({
            ...prev,
            status: "error",
            error: "Connection failed after " + MAX_RECONNECT_ATTEMPTS + " attempts. " + (err as Error).message,
          }));
        }
      }
    })();
  }, []);

  const respond = useCallback(async (jobId: string, hookToken: string, answer: string) => {
    setState((prev) => ({ ...prev, pendingQuestion: null }));
    await fetch(`/api/generation/${jobId}/respond`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hookToken, answer }),
    });
  }, []);

  const cancel = useCallback(async (jobId: string) => {
    abortRef.current?.abort();
    if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    setState((prev) => ({ ...prev, status: "done", currentStatus: "failed", pendingQuestion: null }));
    await fetch(`/api/generation/${jobId}/cancel`, { method: "POST" });
  }, []);

  useEffect(() => {
    if (!jobId) return;
    startIndexRef.current = undefined;
    reconnectAttemptsRef.current = 0;
    connect(jobId);
    return () => {
      abortRef.current?.abort();
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
    };
  }, [jobId, connect]);

  return { state, respond, cancel };
}
