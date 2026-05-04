"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { SiOpenai, SiGoogle } from "react-icons/si";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Usage } from "./usage";
import { useSession } from "@/lib/auth-client";
import { createPortal } from "react-dom";

interface Props {
  projectId: string;
}

const GlassEffect: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`relative overflow-hidden rounded-3xl ${className}`}>
    <div
      className="absolute inset-0 z-0 rounded-3xl"
      style={{ backdropFilter: "blur(14px)", background: "rgba(255, 255, 255, 0.15)" }}
    />
    <div
      className="absolute inset-0 z-10 rounded-3xl"
      style={{
        boxShadow:
          "inset 2px 2px 6px rgba(255,255,255,0.35), inset -2px -2px 6px rgba(0,0,0,0.1)",
      }}
    />
    <div className="relative z-20">{children}</div>
  </div>
);

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Message cannot be empty" })
    .max(1000, { message: "Message cannot be longer than 1000 characters" }),
});

export const MessageForm = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
    mode: "onChange",
  });

  const { data: usage } = useQuery(trpc.usage.status.queryOptions());

  const createMessage = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({ projectId }));
        queryClient.invalidateQueries(
          trpc.generationJobs.latestForProject.queryOptions({ projectId })
        );
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: () => toast.error("Failed to create message"),
    })
  );

  const isPending = createMessage.isPending;
  const isButtonDisabled = isPending || !form.formState.isValid;

  // MODEL SELECTOR
  const models = [
    { name: "codex", label: "GPT-5", icon: <SiOpenai />, isPro: true, description: "Best for deep reasoning" },
    { name: "gemini", label: "GPT-4.1 Mini", icon: <SiGoogle />, isPro: true, description: "Fast balanced general model" },
    { name: "grok", label: "GPT-5 Mini", icon: null, isPro: false, description: "Fastest default OpenAI model" },
  ];

  const [selectedModel, setSelectedModel] = useState(models[2]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownCoords({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX, width: rect.width });
    }
  }, [dropdownOpen]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
      model: selectedModel.name as "grok" | "codex" | "gemini",
    });
  };

  return (
    <Form {...form}>
      {usage && <Usage points={usage.remainingPoints} msBeforeNext={usage.msBeforeNext} />}
      <section className="flex flex-col items-center w-full">
        <GlassEffect
          className={cn(
            "w-full max-w-3xl p-6 transition-all duration-500 border border-primary/20 shadow-lg",
            form.formState.isDirty && "scale-[1.01] ring-2 ring-primary/40"
          )}
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 relative">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  onFocus={() => setDropdownOpen(false)}
                  disabled={isPending}
                  minRows={2}
                  maxRows={8}
                  placeholder="Ask a question or start a conversation..."
                  className={cn(
                    "w-full resize-none border-none bg-transparent text-foreground placeholder:text-muted-foreground focus:ring-0 outline-none transition-all duration-300",
                    "scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent hover:scrollbar-thumb-primary/70"
                  )}
                />
              )}
            />

            <div className="flex items-center justify-between gap-x-2">
              {/* MODEL SELECTOR */}
              <div className="relative">
                <button
                  type="button"
                  ref={buttonRef}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border shadow-sm bg-white/20 dark:bg-white/10 border-white/20 text-foreground hover:bg-white/30 transition-all"
                >
                  {selectedModel.icon && <span className="size-4">{selectedModel.icon}</span>}
                  <span className="font-medium">{selectedModel.label}</span>
                  {selectedModel.isPro && <span className="ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded bg-primary text-primary-foreground">PRO</span>}
                </button>
                {dropdownOpen && buttonRef.current &&
                  createPortal(
                    <div
                      ref={(el) => {
                        if (!el) return;
                        const rect = buttonRef.current!.getBoundingClientRect();
                        const scrollY = window.scrollY;
                        el.style.top = `${rect.top + scrollY - el.offsetHeight}px`; // open above button
                        el.style.left = `${rect.left + window.scrollX}px`;
                        el.style.width = `${Math.max(rect.width, 220)}px`;
                      }}
                      className="rounded-xl bg-background/95 backdrop-blur-md border border-border shadow-lg overflow-hidden min-w-[220px] z-[9999]"
                      style={{ position: "absolute" }}
                    >
                      {models.map((model) => {
                        const disabled = false;
                        const isBest = model.name === "codex";

                        return (
                          <button
                            key={model.name}
                            type="button"
                            disabled={disabled}
                            onClick={() => {
                              if (!disabled) setSelectedModel(model);
                              setDropdownOpen(false);
                            }}
                            className={cn(
                              "flex flex-col w-full px-2 py-1.5 text-left transition-all duration-150 rounded-md",
                              disabled
                                ? "text-muted-foreground cursor-not-allowed opacity-60"
                                : "text-foreground hover:bg-primary/10 hover:scale-[1.01]"
                            )}
                          >
                            <div className="flex items-center gap-1.5 text-xs">
                              {model.icon && <span className="size-3">{model.icon}</span>}
                              <span className="font-medium">{model.label}</span>
                              {isBest && <span className="text-yellow-400 text-[10px]">⭐</span>}
                            </div>
                            <span className="text-[8px] text-muted-foreground pl-4 mt-0.5">
                              {model.name === "codex" && "Best for deep reasoning"}
                              {model.name === "gemini" && "Fast balanced general model"}
                              {model.name === "grok" && "Fastest default OpenAI model"}
                            </span>
                          </button>
                        );
                      })}
                    </div>,
                    document.body
                  )
                }

              </div>

              {/* SUBMIT BUTTON */}
              <div className="flex items-center gap-x-2">
                <div className="text-[10px] text-muted-foreground font-sans">
                  <kbd className="inline-flex h-5 select-none items-center gap-x-1 rounded border border-primary/20 bg-primary/10 px-1.5 font-mono text-[10px] font-medium backdrop-blur-sm">
                    <span className="text-primary font-bold">⌘</span>
                    <span className="text-primary font-bold"> + Enter</span>
                  </kbd>
                </div>

                <Button
                  className={cn(
                    "size-8 rounded-full transition-all hover:scale-105",
                    isButtonDisabled
                      ? "bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 shadow-sm opacity-50 cursor-not-allowed hover:scale-100 hover:bg-white/30"
                      : "bg-primary text-primary-foreground shadow-md hover:bg-primary/40"
                  )}
                  disabled={isButtonDisabled}
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isPending ? (
                    <Loader2Icon className="animate-spin size-4 text-primary bg-primary" />
                  ) : (
                    <ArrowUpIcon className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </GlassEffect>
      </section>

      {/* Scrollbar tweaks */}
      <style jsx global>{`
        textarea::-webkit-scrollbar {
          width: 8px;
        }
        textarea::-webkit-scrollbar-track {
          background: transparent;
        }
        textarea::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 9999px;
        }
        textarea::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.7);
        }
      `}</style>
    </Form>
  );
};

export default MessageForm;
