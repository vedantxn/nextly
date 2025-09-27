"use client";

import ProjectForm from "@/modules/home/ui/components/project-form";
// import Image from "next/image";
// import { HeroPill } from "@/components/21stdev/hero-pill";
import { Announcement } from "@/components/21stdev/announcement";
import { AnnouncementTitle } from "@/components/21stdev/announcement";
import { ArrowUpRightIcon } from "lucide-react";
import BlurText from "@/components/21stdev/blur-text";
import { HowItWorksSection } from "@/modules/home/ui/components/tagline";
//import { DemoScrollStack } from "@/modules/home/ui/components/feature-stack";
import ComparisonFeature from "@/modules/home/ui/components/compariosn";
//import  ScrambledText  from "@/components/ScrambledText";
import { SocialsHome } from "@/modules/home/ui/components/socials-home";
import { Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { ProjectsList } from "@/modules/home/ui/components/projects-list";
import { Features } from "@/modules/home/ui/components/features-bento";

const Page = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full bg-transparent">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <a href="https://github.com/vedantxn/nextable" target="_blank" rel="noopener noreferrer">
          <Announcement className="hover:bg-primary hover:text-primary-foreground">
            <AnnouncementTitle>
              We are building next big thing
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
          From prompt to production-ready code — powered with <strong className="text-primary italic">AI</strong>
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>

        {isSignedIn ? (
          <div className="mt-20">
            <ProjectsList />
          </div>
        ) : (
          <>
            <HowItWorksSection /> 
            <ComparisonFeature />
            <Features />
          </>
        )}
      </section>
      {/* <Footer /> */}
    </div>
    
  );
};

export default Page;