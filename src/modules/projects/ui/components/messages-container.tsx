"use client";

import { useQuery, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useRef, useEffect, useState } from "react";
import type { Fragment } from "@/lib/types";
import { MessageLoading } from "./message-loading";
import { GenerationStream, GenerationStreamErrorBoundary } from "./generation-stream";
import { useGenerationStream } from "@/hooks/use-generation-stream";

interface Props {
  projectId: string;
  activeFragment: Fragment | null;
  setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({
  projectId,
  activeFragment,
  setActiveFragment,
}: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const lastAssistantMessageIdRef = useRef<string | null>(null);

  // The active job ID we're streaming — set when a new generation starts
  const [streamingJobId, setStreamingJobId] = useState<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      { projectId },
      { refetchInterval: 5000 },
    )
  );

  const { data: latestGenerationJob } = useQuery(
    trpc.generationJobs.latestForProject.queryOptions(
      { projectId },
      { refetchInterval: 5000 },
    ),
  );

  // When a job becomes active, start streaming it
  useEffect(() => {
    if (
      latestGenerationJob?.id &&
      (latestGenerationJob.status === "QUEUED" || latestGenerationJob.status === "RUNNING") &&
      latestGenerationJob.id !== streamingJobId
    ) {
      setStreamingJobId(latestGenerationJob.id);
    }
  }, [latestGenerationJob, streamingJobId]);

  // Connect to the stream for the active job
  const { state: streamState, respond, cancel } = useGenerationStream(streamingJobId);

  // When stream finishes, invalidate queries to load the final persisted message
  useEffect(() => {
    if (streamState.status === "done") {
      queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
      queryClient.invalidateQueries(
        trpc.generationJobs.latestForProject.queryOptions({ projectId })
      );
      // Clear the streaming job ID after a short delay so the UI transitions cleanly
      const t = setTimeout(() => setStreamingJobId(null), 2000);
      return () => clearTimeout(t);
    }
  }, [streamState.status, queryClient, trpc, projectId]);

  // Auto-set active fragment from last assistant message
  useEffect(() => {
    const lastAssistantMessage = messages?.findLast(
      (message) => message.role === "ASSISTANT"
    );
    if (
      lastAssistantMessage?.fragment &&
      lastAssistantMessage.id !== lastAssistantMessageIdRef.current
    ) {
      setActiveFragment(lastAssistantMessage.fragment);
      lastAssistantMessageIdRef.current = lastAssistantMessage.id;
    }
  }, [messages, setActiveFragment]);

  // Scroll to bottom on new messages or stream events
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length, streamState.events.length]);

  const isGenerating =
    latestGenerationJob?.status === "QUEUED" ||
    latestGenerationJob?.status === "RUNNING";

  const isStreaming =
    streamingJobId !== null &&
    (streamState.status === "connecting" || streamState.status === "streaming");

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto px-2">
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content}
            role={message.role}
            fragment={message.fragment}
            createdAt={message.createdAt}
            isActiveFragment={activeFragment?.id === message.fragment?.id}
            onFragmentClick={() =>
              message.fragment && setActiveFragment(message.fragment)
            }
            type={message.type}
          />
        ))}

        {/* Show real-time stream when available */}
        {isStreaming && streamingJobId && (
          <GenerationStreamErrorBoundary>
            <GenerationStream
              state={streamState}
              jobId={streamingJobId}
              onRespond={(hookToken, answer) => respond(streamingJobId, hookToken, answer)}
              onCancel={() => cancel(streamingJobId)}
            />
          </GenerationStreamErrorBoundary>
        )}

        {/* Fallback: plain loading state when job is active but stream not connected yet */}
        {isGenerating && !isStreaming && <MessageLoading />}

        <div ref={bottomRef} />
      </div>

      <div className="relative p-3 pt-1">
        <div className="absolute top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm
          projectId={projectId}
          onJobCreated={(jobId) => setStreamingJobId(jobId)}
        />
      </div>
    </div>
  );
};

export default MessagesContainer;
