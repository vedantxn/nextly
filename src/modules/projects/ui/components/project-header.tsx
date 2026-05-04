"use client";

import Link from "next/link";
import Image from "next/image";
// import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useTRPC } from "@/trpc/client";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuRadioGroup,
//   DropdownMenuRadioItem,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { LightPullThemeSwitcher } from "@/components/21stdev/light-pull-theme-switcher";

interface Props {
  orgSlug: string;
  projectId: string;
}

export const ProjectHeader = ({ orgSlug, projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({ id: projectId, orgSlug })
  );

  // const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-50">
      {/* Left: Logo + Project Name */}
      <div className="flex items-center gap-3">
        <Image src="/logo.svg" alt="Vibe" width={32} height={32} />
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground">
            {project?.name ?? "Project"}
          </span>
          <Link
            href={`/orgs/${orgSlug}/projects`}
            className="flex items-center text-sm text-muted-foreground hover:text-primary gap-1"
          >
            <ChevronLeftIcon size={16} /> Back to dashboard
          </Link>
        </div>
      </div>
      <LightPullThemeSwitcher />
    </header>
  );
};
