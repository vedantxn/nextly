"use client";

import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable";
import { MessagesContainer } from "../components/messages-container";
import { Suspense, useState } from "react";
import { FragmentWeb } from "../components/fragment-web";
import type { Fragment } from "@/lib/types";
import { ProjectHeader } from "../components/project-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, CodeIcon, Loader2, AlertCircle, RocketIcon, RefreshCcwIcon, ExternalLinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileExplorer } from "@/components/file-explorer";
import { UserControl } from "@/components/user-control";
import { ErrorBoundary } from "react-error-boundary";

const LoadingState = ({ message }: { message: string }) => (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">{message}</p>
    </div>
);

const ErrorFallback = ({ message }: { message: string }) => (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-destructive">
        <AlertCircle className="h-8 w-8" />
        <p className="text-center text-sm">{message}</p>
    </div>
);

const EmptyState = () => (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-muted-foreground">
        <RocketIcon className="h-12 w-12 text-primary opacity-50" />
        <h3 className="text-xl font-semibold text-foreground">Select a Version</h3>
        <p className="text-sm">Choose a generated version from the left panel to see its preview and code.</p>
    </div>
);

interface Props {
    projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
    const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
    const [tabState, setTabState] = useState<"preview" | "code">("preview");
    const [copied, setCopied] = useState(false);

    const handleRefresh = () => {
        if (activeFragment?.sandboxUrl) {
            window.location.reload();
        }
    };

    const handleCopyUrl = async () => {
        if (activeFragment?.sandboxUrl) {
            await navigator.clipboard.writeText(activeFragment.sandboxUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const sandboxUrl = activeFragment?.sandboxUrl || "No URL available";
    const displayUrl = sandboxUrl.length > 50 ? `${sandboxUrl.substring(0, 47)}...` : sandboxUrl;

    return (
        <div className="h-screen overflow-hidden bg-background text-foreground">
            <ResizablePanelGroup direction="horizontal" className="animate-in fade-in duration-500">
                {/* LEFT PANEL - Messages with fixed input */}
                <ResizablePanel defaultSize={35} minSize={25} className="flex flex-col min-h-0">
                    {/* Project Header - Fixed at top */}
                    <div className="flex-shrink-0">
                        <ErrorBoundary fallback={<ErrorFallback message="Error loading project header." />}>
                            <Suspense fallback={<LoadingState message="Loading Project..." />}>
                                <ProjectHeader projectId={projectId} />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                    
                    {/* Messages Container - This should handle its own layout with fixed input */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <ErrorBoundary fallback={<ErrorFallback message="Error loading messages." />}>
                            <Suspense fallback={<LoadingState message="Loading Messages..." />}>
                                <MessagesContainer
                                    projectId={projectId}
                                    activeFragment={activeFragment}
                                    setActiveFragment={setActiveFragment}
                                />
                            </Suspense>
                        </ErrorBoundary>
                    </div>
                </ResizablePanel>

                <ResizableHandle className="w-1.5 bg-border transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />

                {/* RIGHT PANEL - Preview/Code */}
                <ResizablePanel defaultSize={65} minSize={30} className="flex min-h-0 flex-col">
                    <Tabs
                        className="flex h-full flex-col"
                        defaultValue="preview"
                        value={tabState}
                        onValueChange={(value) => setTabState(value as "preview" | "code")}
                    >
                        {/* Tab Header - Fixed */}
                        <div className="flex items-center justify-between border-b bg-background/50 p-3 backdrop-blur-sm gap-4">
                            <TabsList className="grid h-9 grid-cols-2 p-1 bg-muted flex-shrink-0">
                                <TabsTrigger 
                                    value="preview" 
                                    className="flex items-center gap-2 transition-all duration-200 hover:bg-background/80"
                                >
                                    <EyeIcon className="h-4 w-4" />
                                    <span>Preview</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="code" 
                                    className="flex items-center gap-2 transition-all duration-200 hover:bg-background/80"
                                >
                                    <CodeIcon className="h-4 w-4" />
                                    <span>Code</span>
                                </TabsTrigger>
                            </TabsList>

                            {activeFragment && (
                                <div className="flex items-center gap-2 flex-1 max-w-md mx-4 bg-background/30 dark:bg-background/50 border border-border rounded-xl shadow-lg backdrop-blur-md hover:shadow-xl transition-all duration-300">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={handleRefresh}
                                        className="hover:bg-primary/20 transition-colors duration-200 m-1 h-8 w-8 rounded-lg flex-shrink-0"
                                        title="Refresh"
                                    >
                                        <RefreshCcwIcon className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        className="flex-1 justify-start truncate font-medium bg-transparent hover:bg-primary/10 transition-all text-sm py-2 px-3 h-8 min-w-0"
                                        disabled={!activeFragment.sandboxUrl || copied}
                                        onClick={handleCopyUrl}
                                        title={copied ? "Copied!" : "Click to copy URL"}
                                    >
                                        <span className="truncate">
                                            {copied ? "Copied!" : displayUrl}
                                        </span>
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        disabled={!activeFragment.sandboxUrl}
                                        onClick={() => activeFragment.sandboxUrl && window.open(activeFragment.sandboxUrl, "_blank")}
                                        className="hover:bg-primary/20 transition-colors duration-200 m-1 h-8 w-8 rounded-lg flex-shrink-0"
                                        title="Open in new tab"
                                    >
                                        <ExternalLinkIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="flex items-center gap-x-3 flex-shrink-0">
                                <div className="transition-transform hover:scale-105">
                                    <UserControl />
                                </div>
                            </div>
                        </div>

                        {/* Tab Content - Scrollable */}
                        <div className="min-h-0 flex-grow overflow-hidden">
                            {!activeFragment ? (
                                <EmptyState />
                            ) : (
                                <>
                                    <TabsContent value="preview" className="h-full m-0 animate-in fade-in-50 duration-300">
                                        <div className="h-full transition-all duration-300">
                                            <FragmentWeb data={activeFragment} />
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="code" className="h-full m-0 min-h-0 animate-in fade-in-50 duration-300">
                                        {activeFragment.files ? (
                                            <div className="h-full transition-all duration-300">
                                                <FileExplorer files={activeFragment.files as { [path: string]: string }} />
                                            </div>
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                                <div className="text-center">
                                                    <CodeIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                                    <p className="text-sm">No code files available for this version.</p>
                                                </div>
                                            </div>
                                        )}
                                    </TabsContent>
                                </>
                            )}
                        </div>
                    </Tabs>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default ProjectView;
