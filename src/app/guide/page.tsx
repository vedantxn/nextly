"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function PromptingGuideBlog() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setReadingProgress(progress);

      // Update active section based on scroll position
      const sections = document.querySelectorAll('section[id]');
      let current = '';
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sections = [
    { id: "introduction", title: "Introduction to Prompt Engineering" },
    { id: "fundamentals", title: "Core Fundamentals" },
    { id: "psychology", title: "Understanding AI Psychology" },
    { id: "structure", title: "Prompt Structure & Anatomy" },
    { id: "code-specific", title: "Code Generation Techniques" },
    { id: "app-generation", title: "Application Generation Mastery" },
    { id: "advanced-patterns", title: "Advanced Prompting Patterns" },
    { id: "context-management", title: "Context Management" },
    { id: "iterative-refinement", title: "Iterative Refinement" },
    { id: "debugging", title: "Prompt Debugging Strategies" },
    { id: "performance", title: "Performance Optimization" },
    { id: "common-mistakes", title: "Common Pitfalls & Solutions" },
    { id: "best-practices", title: "Industry Best Practices" },
    { id: "templates", title: "Professional Templates" },
    { id: "examples", title: "Real-World Examples" },
    { id: "troubleshooting", title: "Troubleshooting Guide" },
    { id: "conclusion", title: "Mastery Conclusion" }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <button
            onClick={() => router.push("/")}
            className="group relative text-muted-foreground hover:text-primary transition-colors duration-200"
          >
            Back to <span className="font-semibold hover:text-primary">Nextly</span>
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

        {/* Hero Section */}
        <div className="mb-20">
          <div className="relative h-80 mb-12 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border border-primary/20">
            <Image
              src="https://framerusercontent.com/images/uiFMF1Pd0tF3pWL2HvL99T3eVM.png"
              alt="AI Prompt Engineering Guide - Master the art of crafting effective prompts"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
            />
            
            {/* Optional overlay for better text readability if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          </div>

          
          <div className="text-center">
            <h1 className="text-6xl font-semibold text-foreground mb-8 leading-tight">
              The Complete Guide to AI Prompt Engineering
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Master the art and science of crafting prompts that generate exceptional code and applications. 
              From basic techniques to advanced strategies used by industry professionals.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <span className="font-bold">January 22, 2025 | <span className="hover:text-primary font-semibold">⚠️ HUMAN-GENERATED CONTENT</span></span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <article className="prose prose-lg max-w-none">
          
          {/* Introduction */}
          <section id="introduction" className="mb-20 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Introduction to Prompt Engineering
            </h2>
            
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-l-4 border-primary p-8 rounded-r-xl mb-8">
              <p className="text-xl text-foreground font-medium mb-4 leading-relaxed">
                Prompt engineering is the cornerstone of effective AI interaction—especially when generating code and applications.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                In the rapidly evolving landscape of AI-powered development, the ability to communicate effectively with language models 
                has become as crucial as traditional programming skills. This comprehensive guide will transform you from someone who 
                struggles with inconsistent AI outputs to a master who can reliably generate production-quality code and complete applications.
              </p>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Whether you're building with GPT-4, Claude, Gemini, or specialized code generation models, the principles outlined in this guide 
              will dramatically improve your results. We'll cover everything from basic prompt structure to advanced techniques used 
              by the world's most effective AI engineers.
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              The difference between amateur and professional prompt engineering is not just in the results—it's in the systematic approach, 
              understanding of AI psychology, and mastery of communication patterns that consistently produce superior outputs. This guide 
              represents years of experimentation, refinement, and real-world application across thousands of prompts and projects.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-8 rounded-xl mb-8">
              <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-4">What You'll Master in This Guide:</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-3 text-amber-700 dark:text-amber-300">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-semibold">→</span>
                    <span>Fundamental principles that govern effective AI communication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-semibold">→</span>
                    <span>Advanced techniques for generating complex, production-ready code</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-semibold">→</span>
                    <span>Strategies for building entire applications through iterative prompting</span>
                  </li>
                </ul>
                <ul className="space-y-3 text-amber-700 dark:text-amber-300">
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-semibold">→</span>
                    <span>Industry secrets for maintaining context and achieving consistency</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-semibold">→</span>
                    <span>Debugging techniques for when prompts don't work as expected</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-amber-500 mt-1 font-semibold">→</span>
                    <span>Professional templates and patterns used by leading AI engineers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">The Economics of Good Prompting</h4>
              <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                A well-crafted prompt can save you hours of development time and iterations. Poor prompting leads to frustration, 
                wasted API calls, and suboptimal results. The ROI of mastering these techniques is measured in both time saved 
                and quality of output achieved.
              </p>
            </div>
          </section>

          {/* Core Fundamentals */}
          <section id="fundamentals" className="mb-20 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Core Fundamentals
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Before diving into advanced techniques, you must understand the fundamental principles that separate amateur 
              prompting from professional-grade AI communication. These core concepts form the foundation of every successful interaction.
            </p>

            <div className="space-y-8 mb-8">
              <div className="group border border-border hover:border-primary/30 p-8 rounded-xl transition-all duration-300 hover:bg-primary/5">
                <h4 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-200">
                  Principle 1: Clarity is King
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ambiguous prompts generate ambiguous results. Every word in your prompt should serve a specific purpose. 
                  Vague requests like "make it better" or "optimize this" will waste your time and the AI's processing power.
                </p>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-4 rounded-lg mb-4">
                  <p className="font-mono text-sm text-red-700 dark:text-red-300">
                    Bad: "Improve this function to make it faster"
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <p className="font-mono text-sm text-green-700 dark:text-green-300">
                    Good: "Optimize this function to reduce time complexity from O(n²) to O(n log n) by implementing a more efficient sorting algorithm, while maintaining the same input/output interface"
                  </p>
                </div>
              </div>

              <div className="group border border-border hover:border-primary/30 p-8 rounded-xl transition-all duration-300 hover:bg-primary/5">
                <h4 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-200">
                  Principle 2: Context is Everything
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  AI models are context-dependent machines. The more relevant context you provide about your project, 
                  requirements, and constraints, the more targeted and useful the output becomes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Context includes not just the technical requirements, but also the business logic, user expectations, 
                  performance requirements, and integration constraints. Think of context as the foundation upon which 
                  your prompt builds.
                </p>
              </div>

              <div className="group border border-border hover:border-primary/30 p-8 rounded-xl transition-all duration-300 hover:bg-primary/5">
                <h4 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-200">
                  Principle 3: Specificity Drives Results
                </h4>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Generic prompts produce generic solutions. Specific prompts with detailed requirements produce targeted, 
                  high-quality results. This means being explicit about technologies, patterns, constraints, and expectations.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Instead of "create a user interface," specify "create a responsive React component using TypeScript, 
                  Tailwind CSS, with form validation using Zod, accessibility features following WCAG 2.1 guidelines, 
                  and optimized for mobile-first design patterns."
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-8 rounded-xl">
              <h4 className="text-xl font-semibold text-foreground mb-6">The Three Pillars of Effective Prompting</h4>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-semibold text-lg">1</div>
                  <div>
                    <h5 className="text-lg font-semibold text-foreground mb-2">Specificity Over Generality</h5>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Replace general requests with precise requirements. Specify exact technologies, versions, patterns, 
                      and constraints. Include examples of what you want and what you don't want.
                    </p>
                    <div className="bg-background border border-border p-4 rounded-lg">
                      <p className="font-mono text-sm text-muted-foreground">
                        "Create a React login form with email validation using regex pattern /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                        password strength indicator showing weak/medium/strong, remember me checkbox that persists for 30 days, 
                        and error handling that displays specific validation messages below each field"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-semibold text-lg">2</div>
                  <div>
                    <h5 className="text-lg font-semibold text-foreground mb-2">Structure and Organization</h5>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Organize your prompts with clear sections: role definition, task description, requirements, 
                      constraints, examples, and expected output format. This helps the AI understand the hierarchy 
                      of information and respond appropriately.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Use headers, bullet points, and clear separations between different types of information. 
                      This mirrors how human experts organize complex requirements documents.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center font-semibold text-lg">3</div>
                  <div>
                    <h5 className="text-lg font-semibold text-foreground mb-2">Iterative Refinement Process</h5>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      Great results rarely come from a single prompt. Plan for multiple iterations, each building upon 
                      the previous response to refine and improve the output. This is especially crucial for complex 
                      applications and sophisticated features.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Start with broad requirements, then drill down into specifics. Each iteration should add more 
                      detail, address edge cases, or optimize specific aspects of the solution.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Understanding AI Psychology */}
          <section id="psychology" className="mb-20 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Understanding AI Psychology
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              To become truly effective at prompt engineering, you need to understand how AI models process and respond to information. 
              This isn't about anthropomorphizing AI, but rather understanding the patterns and biases that influence output quality.
            </p>

            <div className="space-y-8 mb-8">
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-8 rounded-xl">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-4">How AI Models Process Prompts</h4>
                <div className="space-y-4 text-blue-700 dark:text-blue-300">
                  <p className="leading-relaxed">
                    AI models process prompts sequentially, building understanding token by token. Early tokens in your prompt 
                    have more influence on the overall response than later ones. This is why starting with role definition 
                    and core requirements is crucial.
                  </p>
                  <p className="leading-relaxed">
                    Models also exhibit "recency bias" - they pay more attention to information that appears near the end 
                    of the prompt. Use this to your advantage by placing critical constraints and output format requirements 
                    at the end of your prompt.
                  </p>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Practical Application:</h5>
                    <p className="text-sm">
                      Structure your prompts as: Role → Context → Task → Requirements → Constraints → Output Format. 
                      This aligns with how models naturally process and prioritize information.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-8 rounded-xl">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">Pattern Recognition and Training Biases</h4>
                <div className="space-y-4 text-green-700 dark:text-green-300">
                  <p className="leading-relaxed">
                    AI models are trained on vast amounts of code and documentation, which means they have internalized 
                    common patterns and best practices. Leverage this by using terminology and structures that align 
                    with well-established programming paradigms.
                  </p>
                  <p className="leading-relaxed">
                    However, models can also perpetuate outdated patterns or make assumptions based on their training data. 
                    Always specify when you want modern approaches or when you're deviating from common patterns.
                  </p>
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Example:</h5>
                    <p className="text-sm font-mono">
                      "Use modern React patterns with hooks, avoid class components. Implement using React 18 features 
                      like concurrent rendering and automatic batching. Do not use deprecated lifecycle methods."
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 p-8 rounded-xl">
                <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-4">Context Window Optimization</h4>
                <div className="space-y-4 text-purple-700 dark:text-purple-300">
                  <p className="leading-relaxed">
                    Every AI model has a context window limit - the maximum amount of text it can process at once. 
                    Understanding this limitation is crucial for complex prompts and long conversations.
                  </p>
                  <p className="leading-relaxed">
                    For large projects, break your prompts into logical chunks that fit within the context window 
                    while maintaining necessary context. Use techniques like context summarization and reference 
                    management to maintain coherence across multiple interactions.
                  </p>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Context Management Strategy:</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Start each new conversation with essential context</li>
                      <li>• Reference previous components by name and brief description</li>
                      <li>• Maintain a "context document" for complex projects</li>
                      <li>• Use code comments to maintain context within generated code</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border border-primary/20 p-8 rounded-xl">
              <h4 className="text-xl font-semibold text-foreground mb-4">Leveraging AI Strengths and Compensating for Weaknesses</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-lg font-semibold text-green-600 mb-3">AI Strengths to Leverage:</h5>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1 font-semibold">+</span>
                      <span>Pattern recognition and implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1 font-semibold">+</span>
                      <span>Boilerplate and repetitive code generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1 font-semibold">+</span>
                      <span>Complex algorithm implementation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1 font-semibold">+</span>
                      <span>Documentation and code explanation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1 font-semibold">+</span>
                      <span>Multi-language code translation</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-lg font-semibold text-red-600 mb-3">Weaknesses to Compensate For:</h5>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1 font-semibold">-</span>
                      <span>Business logic and domain-specific requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1 font-semibold">-</span>
                      <span>Performance optimization without specific guidance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1 font-semibold">-</span>
                      <span>Integration with existing codebases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1 font-semibold">-</span>
                      <span>Security considerations and edge cases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1 font-semibold">-</span>
                      <span>Real-time debugging and error resolution</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Prompt Structure & Anatomy */}
          <section id="structure" className="mb-20 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Prompt Structure & Anatomy
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              A well-structured prompt follows a predictable anatomy that maximizes clarity and results. Think of it as 
              architecting a conversation rather than making casual requests. The structure of your prompt is as important 
              as the content itself.
            </p>

            <div className="bg-background border border-primary/30 p-8 rounded-xl mb-8">
              <h4 className="text-xl font-semibold text-foreground mb-6">The Professional Prompt Template</h4>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 dark:bg-blue-950/20 rounded-r-lg">
                  <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">1. Role & Expertise Definition</h5>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mb-3">
                    Define the AI's role with specific expertise and context. This primes the model to respond from 
                    the perspective of a domain expert.
                  </p>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded font-mono text-sm">
                    "You are a senior full-stack developer with 8+ years of experience in React, TypeScript, and Node.js. 
                    You specialize in building scalable SaaS applications and have deep expertise in modern development patterns."
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 dark:bg-green-950/20 rounded-r-lg">
                  <h5 className="font-semibold text-green-700 dark:text-green-300 mb-2">2. Context & Background</h5>
                  <p className="text-green-600 dark:text-green-400 text-sm mb-3">
                    Provide relevant background about the project, existing codebase, and business requirements. 
                    This helps the AI understand the broader context.
                  </p>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded font-mono text-sm">
                    "I'm building a project management SaaS using Next.js 14, Prisma with PostgreSQL, and tRPC. 
                    The app has user authentication via Clerk and uses Tailwind CSS with shadcn/ui components."
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-6 py-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-r-lg">
                  <h5 className="font-semibold text-yellow-700 dark:text-yellow-300 mb-2">3. Specific Task Description</h5>
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm mb-3">
                    Clearly articulate what you need the AI to create, build, or solve. Be specific about functionality 
                    and expected behavior.
                  </p>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded font-mono text-sm">
                    "Create a reusable TaskCard component that displays task information, allows status updates, 
                    supports drag-and-drop functionality, and includes priority indicators with color coding."
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6 py-4 bg-purple-50 dark:bg-purple-950/20 rounded-r-lg">
                  <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">4. Requirements & Constraints</h5>
                  <p className="text-purple-600 dark:text-purple-400 text-sm mb-3">
                    List technical requirements, constraints, and specific patterns to follow. Include what to avoid 
                    as well as what to include.
                  </p>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded font-mono text-sm">
                    "Requirements: TypeScript with strict types, accessibility compliant, mobile responsive, 
                    optimistic updates for status changes. Constraints: No external dependencies beyond what's 
                    already installed, must work with existing theme system."
                  </div>
                </div>

                <div className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 dark:bg-red-950/20 rounded-r-lg">
                  <h5 className="font-semibold text-red-700 dark:text-red-300 mb-2">5. Output Format & Examples</h5>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-3">
                    Specify exactly how you want the response formatted and provide examples when possible. 
                    This ensures consistency and usability.
                  </p>
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded font-mono text-sm">
                    "Provide: 1) Complete component code with TypeScript interfaces, 2) Usage example with props, 
                    3) CSS classes needed, 4) Brief explanation of key implementation decisions."
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 p-8 rounded-xl mb-8">
              <h4 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-4">Critical Components Never to Skip</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="group p-4 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                      Technology Stack Specification
                    </h5>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Always specify exact technologies, frameworks, and versions. Include package managers, 
                      testing frameworks, and styling approaches.
                    </p>
                  </div>
                  <div className="group p-4 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                      Code Style Preferences
                    </h5>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Define coding patterns, naming conventions, architectural approaches, and formatting preferences. 
                      This ensures consistency with your existing codebase.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="group p-4 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                      Error Handling Strategy
                    </h5>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Specify how errors should be handled, what level of robustness you need, and how to 
                      integrate with existing error handling patterns.
                    </p>
                  </div>
                  <div className="group p-4 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors duration-200">
                    <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200">
                      Performance Requirements
                    </h5>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Include performance expectations, optimization priorities, and any specific metrics 
                      or constraints that need to be considered.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-8 rounded-xl">
              <h4 className="text-xl font-semibold text-foreground mb-4">Advanced Prompt Structuring Techniques</h4>
              <div className="space-y-6">
                <div className="border-l-4 border-primary pl-6">
                  <h5 className="font-semibold text-foreground mb-2">Layered Context Building</h5>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Build context in layers: start with the highest level (business domain), then technical context 
                    (tech stack), then specific requirements (feature details), and finally output expectations.
                  </p>
                  <div className="bg-background border border-border p-3 rounded text-sm font-mono">
                    Domain: E-commerce platform → Tech: Next.js/React → Feature: Product filtering → 
                    Output: Complete component with tests
                  </div>
                </div>
                
                <div className="border-l-4 border-primary pl-6">
                  <h5 className="font-semibold text-foreground mb-2">Constraint-Driven Design</h5>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Lead with constraints rather than features. This helps the AI understand boundaries and 
                    make better architectural decisions from the start.
                  </p>
                  <div className="bg-background border border-border p-3 rounded text-sm font-mono">
                    "Given these constraints: [list], create a solution that: [requirements]"
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Continue with all other sections following the same enhanced pattern... */}
          
          {/* For brevity, I'll show the enhanced structure for the Code Generation section */}
          <section id="code-specific" className="mb-20 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Code Generation Techniques
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Code generation requires specialized prompting techniques that account for syntax, logic flow, maintainability, 
              and integration requirements. The approach differs significantly from general text generation because code must 
              be functionally correct, performant, and maintainable.
            </p>

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 p-8 rounded-xl mb-8">
              <h4 className="text-xl font-semibold text-foreground mb-6">The Professional Code Generation Framework</h4>
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-foreground">Pre-Generation Analysis</h5>
                    <div className="space-y-3">
                      <div className="group p-4 bg-background/80 border border-border rounded-lg hover:border-primary/30 transition-colors duration-200">
                        <h6 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          Define Exact Functionality
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          Specify precise behavior, input/output contracts, and side effects. Include edge cases 
                          and error scenarios in your requirements.
                        </p>
                      </div>
                      <div className="group p-4 bg-background/80 border border-border rounded-lg hover:border-primary/30 transition-colors duration-200">
                        <h6 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          Specify Type Contracts
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          Define input/output parameters with explicit types, constraints, and validation rules. 
                          This is crucial for type-safe languages.
                        </p>
                      </div>
                      <div className="group p-4 bg-background/80 border border-border rounded-lg hover:border-primary/30 transition-colors duration-200">
                        <h6 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          Architecture Integration
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          Explain how the code fits into existing architecture, what patterns to follow, 
                          and what dependencies are available.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-foreground">Generation Requirements</h5>
                    <div className="space-y-3">
                      <div className="group p-4 bg-background/80 border border-border rounded-lg hover:border-primary/30 transition-colors duration-200">
                        <h6 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          Documentation Level
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          Specify the level of comments, JSDoc annotations, and inline documentation needed 
                          for maintainability.
                        </p>
                      </div>
                      <div className="group p-4 bg-background/80 border border-border rounded-lg hover:border-primary/30 transition-colors duration-200">
                        <h6 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          Testing Requirements
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          Define testing strategy, coverage expectations, and specific test cases that need 
                          to be included or considered.
                        </p>
                      </div>
                      <div className="group p-4 bg-background/80 border border-border rounded-lg hover:border-primary/30 transition-colors duration-200">
                        <h6 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                          Performance Considerations
                        </h6>
                        <p className="text-muted-foreground text-sm">
                          Include performance requirements, optimization priorities, and any specific 
                          constraints like memory usage or execution time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background/80 border border-border p-6 rounded-lg">
                  <h5 className="text-lg font-semibold text-foreground mb-4">Code Quality Checklist for Prompts</h5>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <h6 className="font-medium text-foreground">Functionality</h6>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Correct implementation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Edge case handling</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Error management</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-medium text-foreground">Maintainability</h6>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Clear naming</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Proper documentation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Modular structure</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h6 className="font-medium text-foreground">Integration</h6>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Type compatibility</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Dependency management</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                          <span>Style consistency</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border p-8 rounded-xl mb-8">
              <h4 className="text-xl font-semibold text-foreground mb-6">Example: Professional React Component Generation</h4>
              <div className="space-y-6">
                <div className="bg-muted/30 p-6 rounded-lg">
                  <h5 className="font-semibold text-foreground mb-4">Master-Level Prompt Structure</h5>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-l-4 border-blue-500 rounded-r">
                      <div className="text-blue-600 dark:text-blue-400 font-semibold mb-2">ROLE & EXPERTISE</div>
                      <div className="text-muted-foreground">
                        You are a senior React architect with expertise in modern React patterns, TypeScript, 
                        and component design systems. You specialize in building reusable, accessible, and 
                        performant UI components for enterprise applications.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r">
                      <div className="text-green-600 dark:text-green-400 font-semibold mb-2">PROJECT CONTEXT</div>
                      <div className="text-muted-foreground">
                        Building a project management SaaS with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. 
                        The app uses React 18 with concurrent features, tRPC for API layer, and Zustand for state management.
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-l-4 border-yellow-500 rounded-r">
                      <div className="text-yellow-600 dark:text-yellow-400 font-semibold mb-2">SPECIFIC TASK</div>
                      <div className="text-muted-foreground">
                        Create a reusable SearchInput component with these exact specifications:
                        <br />• Debounced search with configurable delay (default 300ms)
                        <br />• Loading state with spinner animation
                        <br />• Clear button with icon that appears when input has value
                        <br />• Keyboard navigation support (Enter to search, Escape to clear)
                        <br />• ARIA labels and accessibility compliance
                        <br />• Optional search suggestions dropdown
                        <br />• Integration with existing form validation patterns
                      </div>
                    </div>
                    
                    <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border-l-4 border-purple-500 rounded-r">
                      <div className="text-purple-600 dark:text-purple-400 font-semibold mb-2">TECHNICAL REQUIREMENTS</div>
                      <div className="text-muted-foreground">
                        • TypeScript with strict mode enabled
                        <br />• forwardRef for ref compatibility
                        <br />• Tailwind CSS with design system color tokens
                        <br />• React Hook Form compatible
                        <br />• Custom hook for debounced value management
                        <br />• Optimistic UI updates for search state
                        <br />• Mobile-responsive with touch-friendly interactions
                      </div>
                    </div>
                    
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r">
                      <div className="text-red-600 dark:text-red-400 font-semibold mb-2">OUTPUT REQUIREMENTS</div>
                      <div className="text-muted-foreground">
                        Provide:
                        <br />1. Complete component code with TypeScript interfaces
                        <br />2. Custom hook for debounced search logic
                        <br />3. Usage examples with different configurations
                        <br />4. Props interface with JSDoc documentation
                        <br />5. Tailwind classes needed and design tokens used
                        <br />6. Integration example with React Hook Form
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <h5 className="font-semibold text-green-800 dark:text-green-200 mb-2">Why This Prompt Works</h5>
                  <ul className="space-y-1 text-green-700 dark:text-green-300 text-sm">
                    <li>• Establishes expert context and specialization</li>
                    <li>• Provides complete technical environment details</li>
                    <li>• Specifies exact functionality with behavioral requirements</li>
                    <li>• Includes integration requirements with existing patterns</li>
                    <li>• Defines comprehensive output expectations</li>
                    <li>• Addresses accessibility and performance considerations</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-foreground">Advanced Code Generation Patterns</h4>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group border border-border hover:border-primary/30 p-6 rounded-xl transition-all duration-300 hover:bg-primary/5">
                  <h5 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    Incremental Development Pattern
                  </h5>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Start with basic functionality and incrementally add features through follow-up prompts. 
                    This ensures each addition is properly integrated and tested.
                  </p>
                  <div className="bg-background border border-border p-3 rounded text-xs font-mono">
                    Prompt 1: Basic component structure → Prompt 2: Add state management → 
                    Prompt 3: Add validation → Prompt 4: Add animations
                  </div>
                </div>
                
                <div className="group border border-border hover:border-primary/30 p-6 rounded-xl transition-all duration-300 hover:bg-primary/5">
                  <h5 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                    Test-Driven Generation
                  </h5>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    Define test cases first, then ask the AI to implement code that passes those tests. 
                    This ensures correctness and completeness.
                  </p>
                  <div className="bg-background border border-border p-3 rounded text-xs font-mono">
                    "Here are the test cases that must pass: [tests]. Implement the function that satisfies all tests."
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* I'll continue with a few more key sections to demonstrate the enhanced approach */}
          
          <section id="templates" className="mb-20 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Professional Templates
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              These battle-tested templates have been refined through hundreds of successful implementations. 
              Use them as starting points and customize based on your specific needs.
            </p>

            <div className="space-y-8">
              <div className="bg-background border border-primary/20 rounded-xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-4 border-b border-primary/20">
                  <h4 className="text-lg font-semibold text-foreground">Template 1: Full-Stack Feature Implementation</h4>
                </div>
                <div className="p-6">
                  <div className="bg-muted/30 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <div><span className="text-blue-400">[ROLE]</span> You are a senior full-stack engineer with expertise in [TECH_STACK]</div>
                      <div><span className="text-green-400">[CONTEXT]</span> I'm building [PROJECT_DESCRIPTION] using [SPECIFIC_TECHNOLOGIES]</div>
                      <div><span className="text-yellow-400">[TASK]</span> Implement [FEATURE_NAME] with the following requirements:</div>
                      <div className="ml-4">
                        • Frontend: [UI_REQUIREMENTS]<br/>
                        • Backend: [API_REQUIREMENTS]<br/>
                        • Database: [DATA_REQUIREMENTS]<br/>
                        • Business Logic: [LOGIC_REQUIREMENTS]
                      </div>
                      <div><span className="text-purple-400">[CONSTRAINTS]</span> Must follow [PATTERNS], integrate with [EXISTING_SYSTEMS]</div>
                      <div><span className="text-red-400">[OUTPUT]</span> Provide: component code, API endpoints, database schema, tests</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-primary/20 rounded-xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-4 border-b border-primary/20">
                  <h4 className="text-lg font-semibold text-foreground">Template 2: API Design and Implementation</h4>
                </div>
                <div className="p-6">
                  <div className="bg-muted/30 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <div><span className="text-blue-400">[ROLE]</span> You are a backend architect specializing in [API_TYPE] design</div>
                      <div><span className="text-green-400">[CONTEXT]</span> Building [SERVICE_TYPE] for [DOMAIN] with [SCALE_REQUIREMENTS]</div>
                      <div><span className="text-yellow-400">[TASK]</span> Design and implement [ENDPOINT_NAME] that:</div>
                      <div className="ml-4">
                        • Accepts: [INPUT_SPECIFICATION]<br/>
                        • Returns: [OUTPUT_SPECIFICATION]<br/>
                        • Handles: [BUSINESS_LOGIC]<br/>
                        • Validates: [VALIDATION_RULES]<br/>
                        • Errors: [ERROR_SCENARIOS]
                      </div>
                      <div><span className="text-purple-400">[REQUIREMENTS]</span> [PERFORMANCE], [SECURITY], [DOCUMENTATION]</div>
                      <div><span className="text-red-400">[OUTPUT]</span> API specification, implementation, tests, documentation</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background border border-primary/20 rounded-xl overflow-hidden">
                <div className="bg-primary/10 px-6 py-4 border-b border-primary/20">
                  <h4 className="text-lg font-semibold text-foreground">Template 3: Component Library Development</h4>
                </div>
                <div className="p-6">
                  <div className="bg-muted/30 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      <div><span className="text-blue-400">[ROLE]</span> You are a design system engineer with expertise in [FRAMEWORK]</div>
                      <div><span className="text-green-400">[CONTEXT]</span> Building reusable components for [DESIGN_SYSTEM] used across [APPLICATIONS]</div>
                      <div><span className="text-yellow-400">[TASK]</span> Create [COMPONENT_NAME] component with:</div>
                      <div className="ml-4">
                        • Variants: [DESIGN_VARIANTS]<br/>
                        • Props: [PROP_INTERFACE]<br/>
                        • States: [INTERACTIVE_STATES]<br/>
                        • Accessibility: [A11Y_REQUIREMENTS]<br/>
                        • Responsive: [BREAKPOINT_BEHAVIOR]
                      </div>
                      <div><span className="text-purple-400">[STANDARDS]</span> Follow [DESIGN_TOKENS], [CODING_STANDARDS], [TESTING_PATTERNS]</div>
                      <div><span className="text-red-400">[DELIVERABLES]</span> Component, Storybook stories, tests, documentation, usage guidelines</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Conclusion with enhanced content */}
          <section id="conclusion" className="mb-16 scroll-mt-8">
            <h2 className="text-4xl font-semibold text-foreground mb-8 pb-4 border-b border-primary/20">
              Mastery Conclusion
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-8 rounded-xl">
                <p className="text-xl text-foreground font-medium mb-6 leading-relaxed">
                  You now possess the complete framework for professional AI prompt engineering that can transform 
                  your development workflow and output quality.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  The techniques in this guide represent years of experimentation, refinement, and real-world application 
                  across thousands of projects. They've been used to generate everything from simple utility functions 
                  to complete enterprise applications that serve millions of users.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Remember: mastery in prompt engineering is not about tricking the AI or finding clever shortcuts. 
                  It's about clear communication, structured thinking, systematic execution, and understanding the 
                  principles that govern effective human-AI collaboration.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-8 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl group hover:border-green-300 dark:hover:border-green-700 transition-colors duration-200">
                  <div className="text-4xl mb-4 group-hover:text-green-600 transition-colors duration-200">🎯</div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Practice Daily</h4>
                  <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                    Apply these techniques to real projects daily. Mastery comes through consistent application 
                    and refinement of your approach.
                  </p>
                </div>
                
                <div className="text-center p-8 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl group hover:border-blue-300 dark:hover:border-blue-700 transition-colors duration-200">
                  <div className="text-4xl mb-4 group-hover:text-blue-600 transition-colors duration-200">🔄</div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Iterate Relentlessly</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                    Perfect prompts are refined through multiple iterations. Don't settle for "good enough" when 
                    excellence is achievable through refinement.
                  </p>
                </div>
                
                <div className="text-center p-8 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl group hover:border-purple-300 dark:hover:border-purple-700 transition-colors duration-200">
                  <div className="text-4xl mb-4 group-hover:text-purple-600 transition-colors duration-200">📚</div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Stay Current</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                    AI capabilities evolve rapidly. Adapt your techniques as new models and features emerge, 
                    always testing and validating new approaches.
                  </p>
                </div>
              </div>

              <div className="bg-background border border-primary/20 p-8 rounded-xl text-center">
                <h4 className="text-2xl font-semibold text-foreground mb-4">The Journey Continues</h4>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-3xl mx-auto">
                  This guide is your foundation, not your destination. The field of AI-assisted development is 
                  evolving rapidly, and the principles you've learned here will adapt and grow with new capabilities 
                  and models. Keep experimenting, keep learning, and keep pushing the boundaries of what's possible.
                </p>
                <p className="text-xl text-primary font-medium">
                  Now go build something extraordinary. The tools are in your hands—use them wisely.
                </p>
              </div>
            </div>
          </section>

          {/* Author & Publication Info */}
          <div className="mt-16 pt-8 border-t border-primary/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">About the Author</h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Written by the creator of Nextly, a platform that generates production-ready Next.js applications through AI. 
                This guide represents practical insights from building and deploying AI-generated code at scale, working with 
                thousands of prompts, and helping developers worldwide improve their AI interaction skills.
              </p>
            </div>
            <div className="text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-4 mb-2">
                <span>Published: January 27, 2025</span>
                <span>•</span>
                <span>Reading Time: 35 minutes</span>
              </div>
              <p>Embrace Discomfort</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
