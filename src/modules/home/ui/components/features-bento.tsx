import type { FC, HTMLAttributes } from "react";
import { 
    Rocket, Brain, Palette, Check, Terminal, Play, Eye, Sparkles, 
    Code, Zap, Settings, ChevronRight, Copy, ExternalLink, 
    GitBranch, Clock, Users, Star, ArrowRight, Loader2,
    Monitor, Smartphone, Tablet, Layers, Download
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

// Enhanced FeaturedIcon component with hover effects
const FeatureIcon: FC<{ icon: any; className?: string }> = ({ icon: Icon, className }) => (
    <div className={clsx(
        "group relative w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/20 cursor-pointer",
        className
    )}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <Icon className="relative w-6 h-6 text-primary transition-transform duration-300 group-hover:scale-110" />
    </div>
);

// Enhanced CheckItemText component
const FeatureItem: FC<{ text: string }> = ({ text }) => (
    <li className="group flex items-start gap-3 cursor-pointer transition-all duration-300 hover:translate-x-2">
        <div className="mt-0.5 w-5 h-5 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-primary/20 group-hover:to-primary/10">
            <Check className="w-3 h-3 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>
        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{text}</span>
    </li>
);

const AnimatedMockup: FC<HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div
            className={clsx(
                "group relative size-full rounded-[9.03px] bg-gradient-to-br from-foreground to-foreground/90 p-[0.9px] shadow-2xl ring-[0.56px] ring-border ring-inset md:rounded-[20.08px] md:p-0.5 md:shadow-3xl md:ring-[1.25px] lg:absolute lg:w-auto lg:max-w-none backdrop-blur-sm transition-all duration-500 hover:shadow-4xl hover:scale-[1.02]",
                props.className,
            )}
        >
            <div className="size-full rounded-[7.9px] bg-gradient-to-br from-foreground to-foreground/95 p-0.5 shadow-inner md:rounded-[17.57px] md:p-[3.5px]">
                <div className="relative size-full overflow-hidden rounded-[6.77px] ring-[0.56px] ring-border md:rounded-[15.06px] md:ring-[1.25px] bg-gradient-to-br from-background via-background/98 to-background/95">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

// Ultra-Enhanced Deployment Pipeline Mockup
const DeploymentMockup = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [isDeploying, setIsDeploying] = useState(false);

    return (
        <div className="size-full p-6 flex flex-col justify-center relative overflow-hidden">
            {/* Dynamic background particles */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping delay-0"></div>
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-primary/20 rounded-full animate-ping delay-1000"></div>
                <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-primary/25 rounded-full animate-ping delay-2000"></div>
            </div>
            
            <div className="relative z-10 space-y-6">
                {/* Enhanced Terminal Interface */}
                <div className="group bg-gradient-to-br from-muted/90 to-muted/70 rounded-xl p-4 border border-border/50 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm hover:bg-red-500 transition-colors duration-200 cursor-pointer"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm hover:bg-yellow-500 transition-colors duration-200 cursor-pointer"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm hover:bg-green-500 transition-colors duration-200 cursor-pointer"></div>
                        </div>
                        <Terminal className="w-4 h-4 text-primary ml-2 group-hover:text-primary/80 transition-colors duration-200" />
                        <span className="text-xs text-muted-foreground font-mono group-hover:text-foreground transition-colors duration-200">nextly-ai-terminal</span>
                        <div className="ml-auto flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-500 font-medium">Connected</span>
                        </div>
                    </div>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex items-center gap-2 group-hover:bg-primary/5 p-2 rounded transition-colors duration-200">
                            <span className="text-primary">$</span> 
                            <span className="text-foreground">
                                Create a modern e-commerce dashboard with dark mode
                            </span>
                            <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse"></span>
                        </div>
                        <div className="text-xs text-muted-foreground pl-4 space-y-1">
                            <div className="flex items-center gap-2">
                                <Check className="w-3 h-3 text-green-500" />
                                <span>Prompt analyzed and validated</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                                <span>Generating component architecture...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Pipeline Steps */}
                <div className="space-y-4">
                    {[
                        { 
                            id: 0,
                            label: "AI Code Generation", 
                            status: "complete", 
                            delay: 0,
                            sublabel: "Generated 1,247 lines • 23 components",
                            progress: 100,
                            time: "2.3s",
                            icon: Code
                        },
                        { 
                            id: 1,
                            label: "E2B Sandbox Deployment", 
                            status: "active", 
                            delay: 800,
                            sublabel: "Container: sb_2024_xyz123 • Node.js 18.17",
                            progress: 75,
                            time: "8.7s",
                            icon: Rocket
                        },
                        { 
                            id: 2,
                            label: "Vercel Production Deploy", 
                            status: activeStep > 1 ? "active" : "pending", 
                            delay: 1600,
                            sublabel: "Building optimized bundle • CDN distribution",
                            progress: activeStep > 1 ? 45 : 0,
                            time: "12.1s",
                            icon: Zap
                        },
                    ].map((step, i) => (
                        <div 
                            key={step.id} 
                            className="group bg-gradient-to-br from-background/90 to-background/70 rounded-xl p-4 border border-border/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-1"
                            style={{ animationDelay: `${step.delay}ms` }}
                            onMouseEnter={() => setActiveStep(step.id)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className={clsx(
                                        "w-10 h-10 rounded-xl border-2 transition-all duration-500 shadow-lg flex items-center justify-center",
                                        step.status === "complete" && "bg-gradient-to-br from-green-400/20 to-green-500/20 border-green-400",
                                        step.status === "active" && "bg-gradient-to-br from-primary/20 to-primary/10 border-primary animate-pulse",
                                        step.status === "pending" && "bg-muted/50 border-muted-foreground/30"
                                    )}>
                                        <step.icon className={clsx(
                                            "w-5 h-5 transition-all duration-300",
                                            step.status === "complete" && "text-green-500",
                                            step.status === "active" && "text-primary",
                                            step.status === "pending" && "text-muted-foreground"
                                        )} />
                                        {step.status === "active" && (
                                            <div className="absolute inset-0 rounded-xl border-2 border-primary animate-ping opacity-30"></div>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                                            {step.label}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground font-mono">{step.time}</span>
                                            </div>
                                            {step.status === "complete" && (
                                                <Check className="w-5 h-5 text-green-500 animate-bounce" style={{ animationDuration: "2s" }} />
                                            )}
                                            {step.status === "active" && (
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map((j) => (
                                                        <div 
                                                            key={j} 
                                                            className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" 
                                                            style={{ animationDelay: `${j * 200}ms`, animationDuration: "1s" }}
                                                        ></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                                        {step.sublabel}
                                    </div>
                                    
                                    {step.status !== "pending" && (
                                        <div className="mt-3 w-full bg-muted/50 rounded-full h-2 overflow-hidden shadow-inner">
                                            <div 
                                                className={clsx(
                                                    "h-2 rounded-full transition-all duration-2000 ease-out shadow-sm",
                                                    step.status === "complete" 
                                                        ? "bg-gradient-to-r from-green-400 to-green-500" 
                                                        : "bg-gradient-to-r from-primary to-primary/70 animate-pulse"
                                                )}
                                                style={{ 
                                                    width: `${step.progress}%`,
                                                    transitionDelay: `${step.delay + 500}ms`
                                                }}
                                            ></div>
                                        </div>
                                    )}
                                </div>

                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Live Application Card */}
                <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl p-5 border border-primary/30 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
                            </div>
                            <span className="text-lg font-semibold text-primary">Live Application</span>
                            <div className="px-2 py-1 bg-green-500/20 rounded-full text-xs text-green-600 font-medium">
                                Production
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground font-mono">1,247 views</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-200 group">
                                    <Copy className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                                </button>
                                <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors duration-200 group">
                                    <ExternalLink className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="font-mono text-sm text-primary/90 bg-background/30 rounded-lg p-3 border border-primary/20 group-hover:bg-background/40 transition-colors duration-200">
                        https://nextly-ecommerce-abc123.vercel.app
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                            <div className="flex gap-3 text-xs">
                                <span className="flex items-center gap-1 text-green-500">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    SSL Secured
                                </span>
                                <span className="flex items-center gap-1 text-blue-500">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    CDN Optimized
                                </span>
                            </div>
                            <div className="flex gap-3 text-xs">
                                <span className="flex items-center gap-1 text-purple-500">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    Edge Functions
                                </span>
                                <span className="flex items-center gap-1 text-primary">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    Auto-scaling
                                </span>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <div className="text-xs text-muted-foreground">Performance</div>
                            <div className="text-2xl font-bold text-green-500">98%</div>
                            <div className="text-xs text-muted-foreground">Lighthouse Score</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Ultra-Enhanced AI Models Hub Mockup
const AIModelsMockup = () => {
    const [selectedModel, setSelectedModel] = useState(0);
    const [isProcessing, setIsProcessing] = useState(true);

    return (
        <div className="size-full p-6 relative overflow-hidden">
            {/* Enhanced background with animated elements */}
            <div className="absolute inset-0">
                <div className="absolute top-6 right-8 w-32 h-32 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-6 left-8 w-24 h-24 bg-gradient-to-tr from-purple-500/15 to-purple-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-full blur-lg animate-pulse delay-2000"></div>
            </div>

            <div className="relative z-10 space-y-6">
                {/* Enhanced Header with Interactive Elements */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Brain className="w-6 h-6 text-primary animate-pulse" />
                        <div>
                            <h3 className="text-lg font-bold text-foreground">AI Model Hub</h3>
                            <p className="text-xs text-muted-foreground">Next-generation language models</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1.5 hover:bg-primary/20 transition-colors duration-200 cursor-pointer">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-primary font-semibold">3 Active</span>
                        </div>
                        <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110">
                            <Settings className="w-4 h-4 text-primary" />
                        </button>
                    </div>
                </div>

                {/* Enhanced Model Cards with Tabs */}
                <div className="space-y-4">
                    {[
                        { 
                            id: 0,
                            name: "GPT-5 Codex", 
                            status: "active", 
                            performance: 98, 
                            delay: 0,
                            version: "v5.0.1",
                            description: "Advanced code generation & architecture",
                            tokens: "2.1M",
                            speed: "1.2s avg",
                            specialty: "React/Next.js",
                            requests: "1,247",
                            accuracy: "99.2%",
                            provider: "OpenAI"
                        },
                        { 
                            id: 1,
                            name: "Gemini-2.5 Pro", 
                            status: "available", 
                            performance: 95, 
                            delay: 200,
                            version: "v2.5.0",
                            description: "Complex reasoning & system design",
                            tokens: "1.8M",
                            speed: "1.8s avg",
                            specialty: "System Architecture",
                            requests: "892",
                            accuracy: "97.8%",
                            provider: "Google"
                        },
                        { 
                            id: 2,
                            name: "Claude-3.5 Sonnet", 
                            status: "standby", 
                            performance: 92, 
                            delay: 400,
                            version: "v3.5.2",
                            description: "Code analysis & debugging specialist",
                            tokens: "1.5M",
                            speed: "2.1s avg",
                            specialty: "Error Handling",
                            requests: "634",
                            accuracy: "96.4%",
                            provider: "Anthropic"
                        },
                    ].map((model, i) => (
                        <div 
                            key={model.id} 
                            className={clsx(
                                "relative p-5 rounded-xl border transition-all duration-500 backdrop-blur-sm shadow-lg hover:shadow-2xl group cursor-pointer",
                                selectedModel === model.id
                                    ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-primary/20 scale-[1.02]"
                                    : "border-border bg-gradient-to-br from-background/90 to-background/70 hover:border-primary/30 hover:-translate-y-1"
                            )} 
                            style={{ animationDelay: `${model.delay}ms` }}
                            onClick={() => setSelectedModel(model.id)}
                        >
                            {/* Model Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className={clsx(
                                            "w-4 h-4 rounded-full shadow-md transition-all duration-300",
                                            model.status === "active" && "bg-green-500",
                                            model.status === "available" && "bg-blue-500",
                                            model.status === "standby" && "bg-yellow-500"
                                        )}>
                                            {model.status === "active" && (
                                                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-40"></div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-bold text-foreground">{model.name}</span>
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                                                {model.version}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">{model.description}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {model.status === "active" && (
                                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                                    )}
                                    <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                        <ArrowRight className="w-4 h-4 text-primary" />
                                    </button>
                                </div>
                            </div>

                            {/* Model Stats Grid */}
                            <div className="grid grid-cols-4 gap-3 mb-4">
                                <div className="text-center p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-200">
                                    <div className="text-xs text-muted-foreground mb-1">Tokens</div>
                                    <div className="font-mono text-sm font-bold text-foreground">{model.tokens}</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-200">
                                    <div className="text-xs text-muted-foreground mb-1">Speed</div>
                                    <div className="font-mono text-sm font-bold text-foreground">{model.speed}</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-200">
                                    <div className="text-xs text-muted-foreground mb-1">Requests</div>
                                    <div className="font-mono text-sm font-bold text-primary">{model.requests}</div>
                                </div>
                                <div className="text-center p-2 rounded-lg bg-background/50 hover:bg-background/70 transition-colors duration-200">
                                    <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
                                    <div className="font-mono text-sm font-bold text-green-500">{model.accuracy}</div>
                                </div>
                            </div>

                            {/* Enhanced Performance Bar */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">Performance Score</span>
                                    <span className="text-xs font-mono text-foreground">{model.performance}%</span>
                                </div>
                                <div className="relative w-full bg-muted/50 rounded-full h-3 overflow-hidden shadow-inner">
                                    <div 
                                        className={clsx(
                                            "h-3 rounded-full transition-all duration-2000 ease-out shadow-lg relative overflow-hidden",
                                            model.status === "active" 
                                                ? "bg-gradient-to-r from-green-400 via-primary to-green-500" 
                                                : model.status === "available"
                                                ? "bg-gradient-to-r from-blue-400 to-primary"
                                                : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                                        )}
                                        style={{ 
                                            width: `${model.performance}%`,
                                            transitionDelay: `${model.delay + 800}ms`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Provider Badge */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="text-xs bg-muted/80 text-muted-foreground px-2 py-1 rounded-full font-medium">
                                    {model.provider}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Processing Indicator */}
                <div className="bg-gradient-to-br from-muted/60 to-muted/40 rounded-xl p-4 border border-border/30 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[0, 1, 2, 3].map((i) => (
                                    <div 
                                        key={i} 
                                        className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-sm" 
                                        style={{ 
                                            animationDelay: `${i * 150}ms`, 
                                            animationDuration: "1.2s" 
                                        }}
                                    ></div>
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                                Processing with <span className="text-primary font-semibold">GPT-5 Codex</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs text-muted-foreground font-mono">
                                Tokens: <span className="text-primary">1,247</span> / 4M
                            </div>
                            <button 
                                className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-medium transition-colors duration-200"
                                onClick={() => setIsProcessing(!isProcessing)}
                            >
                                {isProcessing ? 'Pause' : 'Resume'}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="w-full bg-background/40 rounded-full h-2 overflow-hidden shadow-inner">
                            <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full animate-pulse shadow-sm" style={{ width: "67%" }}></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Generating components...</span>
                            <span>67% complete</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Ultra-Enhanced Prototype Generator Mockup
const PrototypeMockup = () => {
    const [activeTab, setActiveTab] = useState('design');
    const [selectedDevice, setSelectedDevice] = useState('desktop');
    const [isGenerating, setIsGenerating] = useState(true);

    return (
        <div className="size-full p-5 relative overflow-hidden">
            {/* Enhanced animated grid background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.4)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-primary/5"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col">
                {/* Enhanced Header with Tabs */}
                <div className="border-b border-border/50 pb-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Palette className="w-5 h-5 text-primary animate-pulse" />
                            <div>
                                <h3 className="text-base font-bold text-foreground">Prototype Engine</h3>
                                <p className="text-xs text-muted-foreground">AI-powered design system</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-3 py-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-green-600 font-medium">Live</span>
                            </div>
                            <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all duration-200 hover:scale-110">
                                <Download className="w-4 h-4 text-primary" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Interactive Tabs */}
                    <div className="flex gap-1 bg-muted/30 p-1 rounded-lg">
                        {[
                            { id: 'design', label: 'Design System' },
                            { id: 'components', label: 'Components', icon: Layers },
                            { id: 'preview', label: 'Preview', icon: Eye }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-primary text-white shadow-lg"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === 'design' && (
                    <div className="space-y-4">
                        {/* Enhanced Color Palette */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-foreground">Color Palette</span>
                                <button className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-200">
                                    Regenerate
                                </button>
                            </div>
                            {[
                                { name: 'Primary', colors: ['#3B82F6', '#1D4ED8', '#1E40AF'], delay: 0 },
                                { name: 'Secondary', colors: ['#8B5CF6', '#7C3AED', '#6D28D9'], delay: 200 },
                                { name: 'Accent', colors: ['#F59E0B', '#D97706', '#B45309'], delay: 400 }
                            ].map((palette, i) => (
                                <div key={palette.name} className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground w-16 font-medium">{palette.name}</span>
                                    <div className="flex gap-2">
                                        {palette.colors.map((color, j) => (
                                            <div 
                                                key={color}
                                                className="relative group w-8 h-8 rounded-lg border border-border shadow-md cursor-pointer transform transition-all duration-300 hover:scale-125 hover:shadow-lg"
                                                style={{ 
                                                    backgroundColor: color,
                                                    animationDelay: `${palette.delay + j * 100}ms`
                                                }}
                                            >
                                                <div className="absolute inset-0 rounded-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <div className="bg-foreground text-background text-xs px-2 py-1 rounded shadow-lg font-mono">
                                                        {color}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="ml-auto p-1 rounded hover:bg-muted/50 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                                        <Copy className="w-3 h-3 text-muted-foreground" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Typography Scale */}
                        <div className="space-y-3">
                            <span className="text-sm font-medium text-foreground">Typography</span>
                            <div className="space-y-2">
                                {[
                                    { name: 'Heading', size: 'text-xl', weight: 'font-bold' },
                                    { name: 'Subheading', size: 'text-lg', weight: 'font-semibold' },
                                    { name: 'Body', size: 'text-sm', weight: 'font-normal' },
                                    { name: 'Caption', size: 'text-xs', weight: 'font-medium' }
                                ].map((type, i) => (
                                    <div key={type.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors duration-200 cursor-pointer">
                                        <span className="text-xs text-muted-foreground w-20">{type.name}</span>
                                        <span className={clsx(type.size, type.weight, "text-foreground")}>
                                            The quick brown fox jumps
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'components' && (
                    <div className="flex-1 space-y-4">
                        {/* Component Library */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { name: 'Header', status: 'complete', icon: '🏠' },
                                { name: 'Hero Section', status: 'generating', icon: '✨' },
                                { name: 'Feature Cards', status: 'pending', icon: '📋' },
                                { name: 'Footer', status: 'pending', icon: '📄' }
                            ].map((component, i) => (
                                <div 
                                    key={component.name}
                                    className="group relative border border-border/50 rounded-xl p-3 bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                                    style={{ animationDelay: `${i * 150}ms` }}
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="relative space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{component.icon}</span>
                                                <span className="text-xs font-medium text-foreground">{component.name}</span>
                                            </div>
                                            <div className={clsx(
                                                "w-2 h-2 rounded-full",
                                                component.status === 'complete' && "bg-green-500",
                                                component.status === 'generating' && "bg-primary animate-pulse",
                                                component.status === 'pending' && "bg-muted-foreground"
                                            )}></div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="h-2 bg-primary/20 rounded w-full animate-pulse"></div>
                                            <div className="h-1.5 bg-primary/10 rounded w-3/4 animate-pulse delay-100"></div>
                                            <div className="h-1.5 bg-primary/5 rounded w-1/2 animate-pulse delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'preview' && (
                    <div className="flex-1 space-y-4">
                        {/* Device Preview Selector */}
                        <div className="flex items-center gap-2">
                            {[
                                { id: 'desktop', icon: Monitor, label: 'Desktop' },
                                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                                { id: 'mobile', icon: Smartphone, label: 'Mobile' }
                            ].map((device) => (
                                <button
                                    key={device.id}
                                    onClick={() => setSelectedDevice(device.id)}
                                    className={clsx(
                                        "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                                        selectedDevice === device.id
                                            ? "bg-primary text-white shadow-md"
                                            : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted/70"
                                    )}
                                >
                                    <device.icon className="w-3 h-3" />
                                    {device.label}
                                </button>
                            ))}
                        </div>

                        {/* Preview Window */}
                        <div className="flex-1 border border-border rounded-lg bg-gradient-to-br from-background/90 to-background/70 flex flex-col overflow-hidden shadow-lg">
                            <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <div className="flex-1 bg-muted rounded px-2 py-1 text-xs text-muted-foreground font-mono">
                                    localhost:3000
                                </div>
                            </div>
                            <div className="flex-1 p-4 space-y-3">
                                <div className="h-4 bg-gradient-to-r from-primary/30 to-primary/10 rounded animate-pulse w-3/4"></div>
                                <div className="h-3 bg-gradient-to-r from-primary/20 to-primary/5 rounded animate-pulse w-1/2 delay-100"></div>
                                <div className="h-8 bg-gradient-to-r from-primary/15 to-primary/5 rounded animate-pulse w-full delay-200"></div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded animate-pulse delay-300"></div>
                                    <div className="h-12 bg-gradient-to-br from-primary/15 to-primary/10 rounded animate-pulse delay-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Generate Button */}
                <div className="mt-6 pt-4 border-t border-border/50">
                    <button 
                        className="relative group w-full cursor-pointer"
                        onClick={() => setIsGenerating(!isGenerating)}
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-xl blur opacity-75 animate-pulse"></div>
                        <div className="relative w-full h-12 bg-gradient-to-r from-primary/95 to-primary/80 rounded-xl flex items-center justify-center shadow-2xl backdrop-blur-sm border border-primary/30 hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-3">
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                        <span className="text-white font-semibold">Generating Beautiful UI...</span>
                                        <div className="flex gap-1">
                                            {[0, 1, 2].map((i) => (
                                                <div 
                                                    key={i} 
                                                    className="w-2 h-2 bg-white rounded-full animate-bounce shadow-sm" 
                                                    style={{ 
                                                        animationDelay: `${i * 200}ms`, 
                                                        animationDuration: "1s" 
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                                        <span className="text-white font-semibold">Start Generation</span>
                                        <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
                                    </>
                                )}
                            </div>
                        </div>
                    </button>
                    
                    {/* Enhanced Progress Tracking */}
                    {isGenerating && (
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Component Assembly</span>
                                <span className="text-primary font-medium">73%</span>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2 overflow-hidden shadow-inner">
                                <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-primary rounded-full shadow-lg relative overflow-hidden" style={{ width: "73%" }}>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>ETA: 12 seconds</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span>Premium Quality</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Features = () => {
    return (
        <section className="flex flex-col gap-12 overflow-hidden bg-gradient-to-br from-background via-background to-background/95 py-16 sm:gap-16 md:gap-20 md:py-24 lg:gap-24">
            <div className="mx-auto w-full max-w-container px-4 md:px-8">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                        <span className="text-sm font-semibold text-primary">Features</span>
                    </div>
                    <h2 className="text-display-sm font-bold text-foreground md:text-display-md bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                        From prompt to production in seconds
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground md:text-xl max-w-2xl leading-relaxed">
                        Experience the future of web development with AI that understands your vision and delivers production-ready Next.js applications instantly.
                    </p>
                </div>
            </div>

            <div className="mx-auto flex w-full max-w-container flex-col gap-16 px-4 sm:gap-20 md:gap-24 md:px-8 lg:gap-32">
                <div className="grid grid-cols-1 gap-12 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center">
                        <FeatureIcon icon={Rocket} />
                        <h2 className="mt-6 text-display-xs font-bold text-foreground md:text-display-sm">
                            Prompt to deployment in one click
                        </h2>
                        <p className="mt-4 text-md text-muted-foreground md:text-lg leading-relaxed">
                            Powered by E2B sandboxes, your apps go from idea to live deployment seamlessly. No configuration, no setup - just instant results with enterprise-grade infrastructure.
                        </p>
                        <ul className="mt-8 flex flex-col gap-5 pl-2 md:pl-4">
                            {[
                                "Instant deployment to Vercel, Netlify, and more platforms",
                                "Secure E2B sandbox environment with real-time testing",
                                "Zero configuration required - just describe and deploy globally",
                            ].map((feat) => (
                                <FeatureItem key={feat} text={feat} />
                            ))}
                        </ul>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AnimatedMockup className="lg:left-0">
                            <DeploymentMockup />
                        </AnimatedMockup>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center lg:order-last">
                        <FeatureIcon icon={Brain} />
                        <h2 className="mt-6 text-display-xs font-bold text-foreground md:text-display-sm">
                            Powered by cutting-edge AI models
                        </h2>
                        <p className="mt-4 text-md text-muted-foreground md:text-lg leading-relaxed">
                            Harness the power of GPT-5 Codex, Gemini-2.5 Pro, and other state-of-the-art models for unmatched code quality, architecture decisions, and creative solutions.
                        </p>
                        <ul className="mt-8 flex flex-col gap-5 pl-2 md:pl-4">
                            {[
                                "GPT-5 Codex for advanced code generation and React expertise",
                                "Gemini-2.5 Pro for complex architectural and system design decisions",
                                "Smart model selection algorithm based on your specific project needs",
                            ].map((feat) => (
                                <FeatureItem key={feat} text={feat} />
                            ))}
                        </ul>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AnimatedMockup className="lg:right-0">
                            <AIModelsMockup />
                        </AnimatedMockup>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12 md:gap-20 lg:grid-cols-2 lg:gap-24">
                    <div className="max-w-xl flex-1 self-center">
                        <FeatureIcon icon={Palette} />
                        <h2 className="mt-6 text-display-xs font-bold text-foreground md:text-display-sm">
                            Beautiful prototypes that feel alive
                        </h2>
                        <p className="mt-4 text-md text-muted-foreground md:text-lg leading-relaxed">
                            Our advanced prototype engine creates stunning, responsive frontends with perfect design systems, interactive components, and pixel-perfect previews that feel like real applications.
                        </p>
                        <ul className="mt-8 flex flex-col gap-5 pl-2 md:pl-4">
                            {[
                                "Auto-generated design systems with perfect color harmony and typography",
                                "Fully responsive layouts optimized for all devices and screen sizes",
                                "Interactive previews with real functionality and smooth animations",
                            ].map((feat) => (
                                <FeatureItem key={feat} text={feat} />
                            ))}
                        </ul>
                    </div>

                    <div className="relative w-full flex-1 lg:h-128">
                        <AnimatedMockup className="lg:left-0">
                            <PrototypeMockup />
                        </AnimatedMockup>
                    </div>
                </div>
            </div>
        </section>
    );
};