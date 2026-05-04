"use client";

import type { Fragment, MessageType, MessageRole } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { 
  ChevronRightIcon, 
  Code2Icon, 
  CopyIcon, 
  CheckIcon,
  AlertCircleIcon,
  UserIcon,
  PlayIcon,
  Loader2
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface UserMessageProps {
  content: string;
  createdAt: Date;
}

const UserMessage = ({ content, createdAt }: UserMessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [content]);

  return (
    <div className="flex justify-end pb-5 px-4 group">
      <div className="flex flex-col items-end max-w-[82%] gap-2">
        {/* User info */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex items-center gap-1.5 bg-muted/60 px-2.5 py-1 rounded-full">
            <UserIcon className="h-3 w-3" />
            <span className="font-medium">You</span>
          </div>
          <span>{formatDistanceToNow(createdAt, { addSuffix: true })}</span>
        </div>
        
        {/* Message bubble - milder background */}
        <Card className="relative bg-primary/90 dark:bg-primary/80 text-primary-foreground rounded-2xl rounded-tr-md p-4 shadow-md border border-primary/20 dark:border-primary/30 group/message">
          {/* Very subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 dark:from-white/3 to-transparent rounded-2xl rounded-tr-md" />
          
          <div className="relative whitespace-pre-wrap break-words leading-relaxed font-medium">
            {content}
          </div>
          
          {/* Copy button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className="absolute top-2.5 right-2.5 h-6 w-6 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/15"
          >
            {copied ? (
              <CheckIcon className="h-3.5 w-3.5" />
            ) : (
              <CopyIcon className="h-3.5 w-3.5" />
            )}
          </Button>
          
          {/* Message tail - milder */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary/90 dark:bg-primary/80 transform rotate-45" />
        </Card>
      </div>
    </div>
  );
};

interface FragmentCardProps {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: FragmentCardProps) => {
  return (
    <div className="relative">
      <button
        onClick={() => onFragmentClick(fragment)}
        className={cn(
          "group flex items-center justify-between p-4 rounded-2xl border-2 w-full transition-all duration-200 relative overflow-hidden",
          isActiveFragment
            ? "border-primary/50 dark:border-primary/60 bg-primary/15 dark:bg-primary/20 text-foreground shadow-lg shadow-primary/10 dark:shadow-primary/20"
            : "border-border bg-card hover:bg-muted/30 dark:hover:bg-muted/20 hover:border-primary/30 dark:hover:border-primary/40 shadow-sm"
        )}
      >
        {/* Much milder background pattern for active state */}
        {isActiveFragment && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary/12 dark:from-primary/18 to-primary/8 dark:to-primary/15" />
        )}
        
        {/* Content */}
        <div className="relative flex items-center gap-4 z-10">
          <div className={cn(
            "p-3 rounded-xl border shadow-sm",
            isActiveFragment 
              ? "bg-primary/20 dark:bg-primary/25 border-primary/30 dark:border-primary/40 text-primary" 
              : "bg-primary/8 dark:bg-primary/12 border-primary/20 dark:border-primary/25 text-primary group-hover:bg-primary/12 dark:group-hover:bg-primary/18"
          )}>
            <Code2Icon size={22} strokeWidth={2} />
          </div>
          
          <div className="flex flex-col items-start gap-1">
            <span className={cn(
              "font-bold text-base",
              isActiveFragment ? "text-foreground" : "text-foreground"
            )}>
              {fragment.title || "Generated Component"}
            </span>
            <div className="flex items-center gap-2 text-sm">
              <PlayIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Interactive Preview
              </span>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRightIcon 
          className={cn(
            "relative z-10 transition-colors duration-200",
            isActiveFragment ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          )} 
          size={24} 
          strokeWidth={2}
        />

        {/* Active indicator - milder */}
        {isActiveFragment && (
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-primary/60 dark:bg-primary/70 rounded-r-full" />
        )}
      </button>
    </div>
  );
};

interface AssistantMessageProps {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
  isGenerating?: boolean;
}

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
  isGenerating = false,
}: AssistantMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [content]);

  // Animated loading dots
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingDots(prev => {
          if (prev === '...') return '';
          return prev + '.';
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isGenerating]);

  const isError = type === "ERROR";
  const isResult = type === "RESULT";

  const getLoadingMessage = () => {
    const messages = [
      "Please wait, I'm generating your component",
      "This may take a few minutes to create the perfect solution",
      "Crafting your Next.js component with care",
      "Building something amazing for you"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="flex flex-col group px-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-muted/80 to-muted dark:from-muted/60 dark:to-muted/80 flex items-center justify-center border-2 border-border shadow-md">
              <Image 
                src="/logo.svg" 
                alt="Nextly AI" 
                width={20} 
                height={20}
              />
            </div>
            {/* Online indicator */}
            <div className={cn(
              "absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background",
              isGenerating ? "bg-yellow-500 animate-pulse" : "bg-green-500"
            )} />
          </div>
          
          {/* Name and status */}
          <div className="flex items-center gap-3">
            <span className="text-base font-bold">Nextly AI</span>
            {isGenerating && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/8 dark:bg-yellow-500/12 border border-yellow-500/20 dark:border-yellow-500/30 rounded-full">
                <Loader2 className="h-3.5 w-3.5 text-yellow-600 animate-spin" />
                <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">Generating</span>
              </div>
            )}
            {isError && !isGenerating && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive/8 dark:bg-destructive/12 border border-destructive/20 dark:border-destructive/30 rounded-full">
                <AlertCircleIcon className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs font-medium text-destructive">Error</span>
              </div>
            )}
            {isResult && !isGenerating && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/8 dark:bg-green-500/12 border border-green-500/20 dark:border-green-500/30 rounded-full">
                <div className="h-2.5 w-2.5 bg-green-500 rounded-full" />
                <span className="text-xs font-medium text-green-700 dark:text-green-400">Generated</span>
              </div>
            )}
          </div>
        </div>

        {/* Timestamp */}
        {!isGenerating && (
          <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-muted/30 dark:bg-muted/40 px-3 py-1.5 rounded-full font-medium">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="pl-12 flex flex-col gap-4">
        {/* Message card */}
        <Card className={cn(
          "relative border-2 rounded-2xl p-5 shadow-sm group/content",
          isGenerating && "border-yellow-500/25 dark:border-yellow-500/35 bg-yellow-500/3 dark:bg-yellow-500/8",
          isError && !isGenerating && "border-destructive/25 dark:border-destructive/35 bg-destructive/3 dark:bg-destructive/8",
          isResult && !isGenerating && "border-primary/25 dark:border-primary/35 bg-primary/3 dark:bg-primary/8",
          !isError && !isResult && !isGenerating && "bg-card border-border"
        )}>
          {/* Very mild background decoration */}
          {isResult && !isGenerating && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/3 dark:from-primary/6 to-transparent rounded-2xl" />
          )}
          
          {/* Content */}
          <div className={cn(
            "relative whitespace-pre-wrap break-words leading-relaxed text-base",
            isError && "text-destructive font-medium"
          )}>
            {isGenerating ? (
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />
                <span className="text-muted-foreground">
                  {getLoadingMessage()}{loadingDots}
                </span>
              </div>
            ) : (
              content
            )}
          </div>

          {/* Copy button */}
          {!isGenerating && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-3 right-3 h-7 w-7 opacity-0 group-hover/content:opacity-100 transition-opacity duration-200 hover:bg-muted/80"
            >
              {copied ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <CopyIcon className="h-4 w-4" />
              )}
            </Button>
          )}

          {/* Message tail - milder */}
          <div className={cn(
            "absolute -bottom-1 left-10 w-4 h-4 border-l-2 border-b-2 transform rotate-45",
            isGenerating ? "bg-yellow-500/3 dark:bg-yellow-500/8 border-yellow-500/25 dark:border-yellow-500/35" :
            isError ? "bg-destructive/3 dark:bg-destructive/8 border-destructive/25 dark:border-destructive/35" : 
            isResult ? "bg-primary/3 dark:bg-primary/8 border-primary/25 dark:border-primary/35" : 
            "bg-card border-border"
          )} />
        </Card>

        {/* Fragment card */}
        {fragment && isResult && !isGenerating && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

interface MessageCardProps {
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: MessageType;
  isGenerating?: boolean;
}

export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
  isGenerating = false,
}: MessageCardProps) => {
  if (role === "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
        isGenerating={isGenerating}
      />
    );
  }

  return <UserMessage content={content} createdAt={createdAt} />;
};

export default MessageCard;
