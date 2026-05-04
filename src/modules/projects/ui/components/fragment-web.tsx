"use client";

import { Button } from "@/components/ui/button";
import type { Fragment } from "@/lib/types";
import { AlertTriangleIcon, ExternalLinkIcon, Loader2, MonitorIcon } from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [refreshIdx, setRefreshIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshIdx((i) => i + 1);
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading preview...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center animate-in fade-in-50 duration-500">
      <div className="relative">
        <AlertTriangleIcon className="h-16 w-16 text-destructive/60" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full animate-pulse" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Preview Unavailable</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The preview couldn't be loaded. This might be due to network issues or the sandbox being temporarily unavailable.
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2">
          <Loader2 className="h-4 w-4" />
          Try Again
        </Button>
        {data.sandboxUrl && (
          <Button asChild variant="ghost" size="sm" className="gap-2">
            <a href={data.sandboxUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLinkIcon className="h-4 w-4" />
              Open Direct
            </a>
          </Button>
        )}
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center animate-in fade-in-50 duration-500">
      <div className="relative">
        <MonitorIcon className="h-16 w-16 text-muted-foreground/40" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-transparent animate-pulse" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-foreground">No Preview Available</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          This version doesn't have a sandbox URL yet. Try generating a new version or wait for the current one to finish processing.
        </p>
      </div>
    </div>
  );

  if (!data.sandboxUrl) {
    return (
      <div className="flex flex-col w-full h-full">
        <div className="flex-1 relative border-2 border-dashed border-border/50 rounded-2xl overflow-hidden bg-muted/20">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex-1 relative border border-border rounded-2xl overflow-hidden shadow-lg bg-background">
        {/* Main iframe container */}
        <div className="relative w-full h-full">
          <iframe
            key={refreshIdx}
            src={data.sandboxUrl}
            className="w-full h-full border-none transition-opacity duration-300"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
            loading="lazy"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
          
          {/* Loading overlay */}
          {isLoading && <LoadingOverlay />}
          
          {/* Error state overlay */}
          {hasError && !isLoading && (
            <div className="absolute inset-0 bg-background rounded-2xl">
              <ErrorState />
            </div>
          )}
        </div>

        {/* Subtle glass effect border */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl bg-gradient-to-br from-white/[0.02] via-transparent to-black/[0.02] dark:from-white/[0.01] dark:to-white/[0.01]" />
        
        {/* Inner shadow for depth */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl shadow-inner shadow-black/5 dark:shadow-white/5" />
      </div>
    </div>
  );
}
