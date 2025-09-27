"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ShowcasePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    "Conceptualizing the impossible",
    "Building revolutionary features", 
    "Perfecting the user experience",
    "Preparing for launch"
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10"></div>
      <div className="fixed top-1/4 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="fixed bottom-1/4 -left-32 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => router.push("/")}
            className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            ← Back to Reality
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="group relative text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300 ease-out"></span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            {/* Hero Title */}
            <div className="mb-12">
              <div className="inline-block p-3 bg-primary/10 rounded-xl mb-6">
                <div className="text-primary font-medium text-sm tracking-wide">
                  NEXTLY SHOWCASE
                </div>
              </div>
              <h1 className="text-6xl md:text-7xl font-semibold text-foreground mb-8 leading-tight">
                Something
                <br />
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Extraordinary
                </span>
                <br />
                Is Coming
              </h1>
            </div>

            {/* Dynamic Phase Indicator */}
            <div className="mb-12 h-16 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl px-8 py-4">
                <p className="text-lg text-muted-foreground font-medium transition-all duration-500">
                  {phases[currentPhase]}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-16 max-w-2xl mx-auto space-y-6">
              <p className="text-xl text-muted-foreground leading-relaxed">
                We're crafting an experience that will fundamentally change how developers interact with AI. 
                What you've seen with Nextly is just the beginning.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Behind the scenes, we're building something that pushes the boundaries of what's possible. 
                A showcase of innovation that will demonstrate the true potential of AI-powered development.
              </p>
            </div>

            {/* Progress Visualization */}
            <div className="mb-16">
              <div className="bg-background/60 backdrop-blur-sm border border-primary/20 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Development Progress</h3>
                <div className="space-y-4">
                  {[
                    { phase: "Core Architecture", progress: 95, status: "complete" },
                    { phase: "Advanced Features", progress: 78, status: "active" },
                    { phase: "UI/UX Polish", progress: 45, status: "in-progress" },
                    { phase: "Performance Optimization", progress: 20, status: "planned" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">{item.phase}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{item.progress}%</span>
                          <div className={`w-2 h-2 rounded-full ${
                            item.status === 'complete' ? 'bg-green-500' :
                            item.status === 'active' ? 'bg-primary animate-pulse' :
                            item.status === 'in-progress' ? 'bg-yellow-500' :
                            'bg-muted'
                          }`} />
                        </div>
                      </div>
                      <div className="w-full h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-1000 ease-out"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification Signup */}
            <div className="max-w-md mx-auto">
              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="bg-background/80 backdrop-blur-sm border border-primary/20 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-foreground mb-3">
                      Get Exclusive Early Access
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Be the first to experience what we're building. No spam, just updates when it matters.
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:border-primary focus:outline-none transition-colors duration-200"
                        required
                      />
                      <button
                        type="submit"
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 whitespace-nowrap"
                      >
                        Notify Me
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                      You're on the list!
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      We'll notify you the moment our showcase goes live.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Hint */}
            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                Expected Launch: <span className="font-medium text-foreground">Dec 2025</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Great things take time. Extraordinary things take a little longer.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
}
