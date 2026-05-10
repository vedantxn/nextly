"use client";

import Image from "next/image";
import { Component, type ReactNode, useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, Terminal, FileText, Search, FolderOpen, Package, AlertTriangle, StopCircle, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AgentStreamEvent } from "@/codegen/stream-events";
import type { GenerationStreamState } from "@/hooks/use-generation-stream";

// ─── Error Boundary ──────────────────────────────────────────────────────────

interface ErrorBoundaryProps { children: ReactNode; fallback?: ReactNode }
interface ErrorBoundaryState { hasError: boolean; message: string }

export class GenerationStreamErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, message: error instanceof Error ? error.message : "Unknown error" };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="px-4 pb-6">
          <div className="pl-12">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-600 dark:text-red-400">
              <XCircle className="h-4 w-4 shrink-0" />
              Stream error: {this.state.message}
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface Props {
  state: GenerationStreamState;
  jobId: string;
  onRespond: (hookToken: string, answer: string) => void;
  onCancel: () => void;
}

const TOOL_ICONS: Record<string, ReactNode> = {
  writeFile: <FileText className="h-3.5 w-3.5" />,
  readFile: <FileText className="h-3.5 w-3.5" />,
  createOrUpdateFiles: <FileText className="h-3.5 w-3.5" />,
  terminal: <Terminal className="h-3.5 w-3.5" />,
  installPackage: <Package className="h-3.5 w-3.5" />,
  searchFiles: <Search className="h-3.5 w-3.5" />,
  listDirectory: <FolderOpen className="h-3.5 w-3.5" />,
};

function statusLabel(status: string | null): string {
  switch (status) {
    case "running": return "Building your app";
    case "building": return "Verifying build";
    case "fixing": return "Fixing build errors";
    case "waiting_for_user": return "Waiting for your answer";
    case "completed": return "Done";
    case "failed": return "Failed";
    default: return "Generating";
  }
}

function ToolCallRow({ event }: { event: AgentStreamEvent & { type: "tool_start" } }) {
  const icon = TOOL_ICONS[event.tool] ?? <Terminal className="h-3.5 w-3.5" />;
  const label =
    event.tool === "writeFile" && typeof event.args.path === "string"
      ? event.args.path
      : event.tool === "terminal" && typeof event.args.command === "string"
      ? event.args.command.slice(0, 60)
      : event.tool === "installPackage" && Array.isArray(event.args.packages)
      ? (event.args.packages as string[]).join(", ")
      : event.tool;

  return (
    <div className="flex items-center gap-2 py-1 px-2 rounded-md bg-muted/40 text-xs text-muted-foreground font-mono">
      <span className="text-primary/70">{icon}</span>
      <span className="truncate">{label}</span>
    </div>
  );
}

function BuildResultRow({ event }: { event: AgentStreamEvent & { type: "build_result" } }) {
  return (
    <div className={cn(
      "flex items-start gap-2 py-1.5 px-2 rounded-md text-xs font-mono",
      event.pass
        ? "bg-green-500/10 text-green-700 dark:text-green-400"
        : "bg-red-500/10 text-red-700 dark:text-red-400",
    )}>
      {event.pass
        ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        : <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
      <span>
        {event.pass ? "Build passed" : "Build failed (attempt " + event.attempt + ")"}
        {!event.pass && event.errors && (
          <span className="block mt-1 text-[10px] opacity-70 whitespace-pre-wrap">
            {event.errors.slice(0, 300)}{event.errors.length > 300 ? "…" : ""}
          </span>
        )}
      </span>
    </div>
  );
}

function AskUserInput({ question, onSubmit }: { question: string; onSubmit: (answer: string) => void }) {
  const [value, setValue] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(300);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{question}</p>
        <span className="text-[10px] text-muted-foreground tabular-nums">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 h-8 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Your answer..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSubmit(value.trim());
              setValue("");
            }
          }}
          autoFocus
        />
        <Button
          size="sm"
          disabled={!value.trim()}
          onClick={() => { onSubmit(value.trim()); setValue(""); }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GenerationStream({ state, jobId, onRespond, onCancel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.events.length]);

  const toolStartEvents = state.events.filter(
    (e): e is AgentStreamEvent & { type: "tool_start" } => e.type === "tool_start",
  );
  const buildEvents = state.events.filter(
    (e): e is AgentStreamEvent & { type: "build_result" } => e.type === "build_result",
  );
  const fixEvents = state.events.filter(
    (e): e is AgentStreamEvent & { type: "fix_attempt" } => e.type === "fix_attempt",
  );

  const isStreaming = state.status === "streaming" || state.status === "connecting";
  const isReconnecting = isStreaming && state.error !== null;
  const [cancelling, setCancelling] = useState(false);

  return (
    <div className="flex flex-col group px-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-muted/80 to-muted dark:from-muted/60 dark:to-muted/80 flex items-center justify-center border-2 border-border shadow-md">
              <Image src="/logo.svg" alt="Nextly AI" width={20} height={20} />
            </div>
            {isStreaming && !isReconnecting && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-yellow-500 rounded-full border-2 border-background animate-pulse" />
            )}
            {isReconnecting && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-background animate-pulse" />
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-bold">Nextly AI</span>
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 border rounded-full",
              isReconnecting
                ? "bg-orange-500/10 border-orange-500/20"
                : isStreaming
                ? "bg-yellow-500/8 border-yellow-500/20 dark:border-yellow-500/30"
                : "bg-muted/40 border-border",
            )}>
              {isReconnecting
                ? <WifiOff className="h-3.5 w-3.5 text-orange-500" />
                : isStreaming
                ? <Loader2 className="h-3.5 w-3.5 text-yellow-600 animate-spin" />
                : state.status === "done" && state.currentStatus !== "failed"
                ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                : <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
              <span className={cn(
                "text-xs font-medium",
                isReconnecting ? "text-orange-600" :
                isStreaming ? "text-yellow-700 dark:text-yellow-400" : "text-muted-foreground",
              )}>
                {isReconnecting ? state.error : statusLabel(state.currentStatus)}
              </span>
            </div>
          </div>
        </div>

        {/* Cancel button */}
        {isStreaming && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1"
            disabled={cancelling}
            onClick={async () => {
              setCancelling(true);
              await onCancel();
            }}
          >
            <StopCircle className="h-3.5 w-3.5" />
            {cancelling ? "Stopping…" : "Stop"}
          </Button>
        )}
      </div>

      {/* Stream content */}
      <div className="pl-12 flex flex-col gap-2">
        <Card className={cn(
          "relative border-2 rounded-2xl p-4 shadow-sm",
          state.currentStatus === "failed"
            ? "border-red-500/25 bg-red-500/3"
            : "border-yellow-500/25 dark:border-yellow-500/35 bg-yellow-500/3 dark:bg-yellow-500/8",
        )}>
          <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
            {toolStartEvents.length === 0 && fixEvents.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Starting agent...</span>
              </div>
            )}
            {toolStartEvents.map((e, i) => <ToolCallRow key={i} event={e} />)}
            {fixEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 font-medium px-2 py-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Fix attempt {e.attempt} of {e.maxAttempts}
              </div>
            ))}
            {buildEvents.map((e, i) => <BuildResultRow key={i} event={e} />)}
          </div>

          {state.pendingQuestion && (
            <AskUserInput
              question={state.pendingQuestion.question}
              onSubmit={(answer) => onRespond(state.pendingQuestion!.hookToken, answer)}
            />
          )}

          <div ref={scrollRef} />
        </Card>
      </div>
    </div>
  );
}
