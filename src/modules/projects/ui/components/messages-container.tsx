"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { MessageCard } from "./message-card";
import { MessageForm } from "./message-form";
import { useRef, useEffect } from "react";
import type { Fragment } from "@/lib/types";
import { MessageLoading } from "./message-loading";

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
  const lastAssistantMessageIdRef = useRef<string | null>(null);

  const { data: messages } = useSuspenseQuery(
    trpc.messages.getMany.queryOptions(
      {
        projectId,
      },
      {
        refetchInterval: 5000,
      }
    )
  );

  const { data: latestGenerationJob } = useQuery(
    trpc.generationJobs.latestForProject.queryOptions(
      {
        projectId,
      },
      {
        refetchInterval: 5000,
      },
    ),
  );

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

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  const isGenerating =
    latestGenerationJob?.status === "QUEUED" ||
    latestGenerationJob?.status === "RUNNING";

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto px-2">
        {messages?.map((message) => (
          <MessageCard
            key={message.id}
            content={message.content} // full content of message
            role={message.role}
            fragment={message.fragment} // fragment object
            createdAt={message.createdAt}
            isActiveFragment={
              activeFragment?.id === message.fragment?.id
            }
            onFragmentClick={() =>
              message.fragment && setActiveFragment(message.fragment)
            }
            type={message.type}
          />
        ))}
        {isGenerating && <MessageLoading />}
        <div ref={bottomRef} />
      </div>

      <div className="relative p-3 pt-1">
        <div className="absolute top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-background/70 pointer-events-none" />
        <MessageForm projectId={projectId} />
      </div>
    </div>
  );
};

export default MessagesContainer;
