"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function getCurrentOrgSlug(pathname: string) {
  if (!pathname.startsWith("/orgs/")) {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);
  return segments[1] ?? null;
}

export function OrganizationSwitcher() {
  const trpc = useTRPC();
  const pathname = usePathname();
  const currentOrgSlug = getCurrentOrgSlug(pathname);
  const { data: organizations } = useQuery(
    trpc.organizations.listMine.queryOptions()
  );

  if (!organizations || organizations.length === 0) {
    return null;
  }

  const currentOrganization =
    organizations.find((organization) => organization.slug === currentOrgSlug) ??
    organizations[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <span className="max-w-[180px] truncate">{currentOrganization.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {organizations.map((organization) => {
          const isCurrent = organization.slug === currentOrganization.slug;

          return (
            <DropdownMenuItem key={organization.id} asChild>
              <Link
                href={`/orgs/${organization.slug}/projects`}
                className="flex items-center justify-between gap-3"
              >
                <span className="truncate">{organization.name}</span>
                {isCurrent ? (
                  <span className="text-xs text-primary font-medium">Current</span>
                ) : null}
              </Link>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href={`/orgs/${currentOrganization.slug}/settings`}
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Organization settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default OrganizationSwitcher;
