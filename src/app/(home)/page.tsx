"use client";

import ProjectForm from "@/modules/home/ui/components/project-form";
import { Announcement } from "@/components/21stdev/announcement";
import { AnnouncementTitle } from "@/components/21stdev/announcement";
import { ArrowUpRightIcon, ChevronDownIcon } from "lucide-react";
import BlurText from "@/components/21stdev/blur-text";
import { HowItWorksSection } from "@/modules/home/ui/components/tagline";
import ComparisonFeature from "@/modules/home/ui/components/compariosn";
import { Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import { Features } from "@/modules/home/ui/components/features-bento";

const Page = () => {
  const { data: session, isPending } = useSession();
  const isSignedIn = !!session?.user;

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 100,
      behavior: 'smooth'
    });
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full bg-transparent">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <a href="https://github.com/vedantxn/nextly" target="_blank" rel="noopener noreferrer">
            <Announcement className="hover:bg-primary hover:text-primary-foreground">
              <AnnouncementTitle>
                🌟 Give us a star on GitHub
                <ArrowUpRightIcon size={16} className="shrink-0 text-muted-foreground" />
              </AnnouncementTitle>
            </Announcement>
          </a>
        </div>
        <BlurText 
          text="Build Next.js Apps at the Speed of Thought"
          className="font-bold text-4xl md:text-5xl text-center transition-all duration-300 pl-4"
        />  
        <p className="text-lg md:text-xl text-muted-foreground text-center hover:italic">
          From prompt to production-ready code — powered by <strong className="text-primary italic">AI</strong>
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>

        {/* Simple inline scroll indicator - only for non-signed-in users */}
        {!isSignedIn && (
          <div className="flex justify-center">
            <button
              onClick={scrollToContent}
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              <span className="text-sm font-medium ">Scroll down</span>
              <ChevronDownIcon className="h-5 w-5 animate-bounce group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}

        {isSignedIn ? (
          <div className="mt-20">
            <ProjectsList />
          </div>
        ) : (
          <>
            <HowItWorksSection /> 
            <ComparisonFeature />
            <Features />
            {/* Professional Text Section */}
            <div className="flex items-center justify-center w-full">
              <p className="
                text-7xl 
                font-semibold 
                text-center 
                tracking-tighter 
                cursor-pointer 
                text-foreground 
                transition-all 
                duration-300 
                ease-in-out
                hover:underline
                hover:-translate-y-2
              ">
                Stop Dreaming. <span className="text-primary">Start Building.</span>
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Page;
