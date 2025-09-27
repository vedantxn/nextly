"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { LightPullThemeSwitcher } from "@/components/21stdev/light-pull-theme-switcher";
import { FiGithub } from "react-icons/fi";
import { InteractiveHoverButton } from "@/components/21stdev/interactive-hover-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // shadcn/ui
import { ChevronDown } from "lucide-react";

export const Navbar = () => {
  const isScrolled = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "Pricing", href: "/pricing" },
    { name: "Showcase", href: "/showcase" },
  ];

  const resources = [
    {
      title: "About",
      href: "/about",
      description: "Learn more about Nextly and our mission.",
    },
    {
      title: "Prompting Guide",
      href: "/guide",
      description: "Master AI prompting with our in-depth guide.",
    },
    {
      title: "Terms",
      href: "/terms",
      description: "Understand the rules of using our platform.",
    },
    {
      title: "Privacy",
      href: "/privacy",
      description: "How we protect and handle your data.",
    },
    {
      title: "We are hiring ✨",
      href: "/careers",
      description: "Join our team and help shape the future.",
      highlight: true,
    },
    {
      title: "Support",
      href: "/support",
      description: "Get help and find answers to your questions.",
    },
  ];

  return (
    <div
      className={cn(
        "fixed top-4 left-0 right-0 z-50 flex items-center px-4 transition-all duration-700",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      {/* Left outside pill */}
      <div className="flex items-center">
        <LightPullThemeSwitcher />
      </div>

      {/* Center pill */}
      <nav
        className={cn(
          "absolute left-1/2 -translate-x-1/2 flex items-center gap-3 transition-all duration-500 bg-background/90 backdrop-blur-md shadow-lg rounded-full px-3 py-1.5",
          isScrolled ? "gap-2 py-1" : "gap-3 py-1.5"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/logo.svg"
            alt="Nextly"
            width={isScrolled ? 22 : 26}
            height={isScrolled ? 22 : 26}
            className="transition-transform duration-300 group-hover:rotate-90"
          />
          <span
            className={cn(
              "italic font-bold transition-colors duration-300",
              isScrolled ? "text-sm" : "text-base",
              "group-hover:text-primary"
            )}
          >
            Nextly
          </span>
        </Link>

        {/* Nav Items */}
        <div
          className={cn(
            "flex items-center gap-2 px-2 rounded-full transition-all duration-300 font-semibold",
            isScrolled ? "gap-1.5 px-2" : "gap-2 px-2"
          )}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative group px-2 py-1 rounded-full text-foreground hover:text-primary transition-colors duration-300 text-sm"
            >
              {item.name}
              <span className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-primary rounded-full transition-all duration-500 group-hover:w-2/3 -translate-x-1/2"></span>
            </Link>
          ))}

          {/* Resources Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative group flex items-center gap-1 px-2 py-1 rounded-full text-foreground hover:text-primary transition-colors duration-300 text-sm">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-background/95 backdrop-blur-md border border-border p-4 rounded-xl w-[420px] grid grid-cols-2 gap-3 shadow-lg"
              align="center"
            >
              {resources.map((item) => (
                <DropdownMenuItem key={item.title} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex flex-col items-start gap-0.5 p-2 rounded-lg transition-colors",
                      "hover:bg-primary/10 hover:text-primary",
                      item.highlight && "text-primary font-semibold"
                    )}
                  >
                    <span className="text-sm">{item.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GitHub Icon */}
          <a
            href="https://github.com/vedantxn/nextable"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group flex items-center justify-center p-1.5 rounded-full hover:bg-primary/10 transition-all duration-300"
          >
            <FiGithub
              className={cn(
                "text-foreground",
                isScrolled ? "w-4 h-4" : "w-4.5 h-4.5",
                "transition-transform duration-300 group-hover:scale-110"
              )}
            />
          </a>
        </div>
      </nav>

      {/* Right side */}
      <div className="flex items-center ml-auto gap-2">
        <SignedOut>
          <SignUpButton>
            <InteractiveHoverButton text="Sign Up" />
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserControl />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
