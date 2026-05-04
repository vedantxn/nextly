"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";

interface Props {
  orgSlug: string;
}

export function OrganizationSettingsView({ orgSlug }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: organization } = useQuery(
    trpc.organizations.getOne.queryOptions({ orgSlug })
  );

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [logo, setLogo] = useState("");

  useEffect(() => {
    if (!organization) {
      return;
    }

    setName(organization.name);
    setSlug(organization.slug);
    setLogo(organization.logo ?? "");
  }, [organization]);

  const updateOrganization = useMutation(
    trpc.organizations.update.mutationOptions({
      onSuccess: async (updatedOrganization) => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.organizations.listMine.queryOptions()),
          queryClient.invalidateQueries(
            trpc.organizations.getOne.queryOptions({ orgSlug: updatedOrganization.slug })
          ),
        ]);

        toast.success("Organization settings updated");

        if (updatedOrganization.slug !== orgSlug) {
          router.replace(`/orgs/${updatedOrganization.slug}/settings`);
          return;
        }

        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  );

  if (!organization) {
    return null;
  }

  const canEdit = organization.currentRole === "owner";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Organization Settings</h1>
          <p className="text-muted-foreground">
            Update the organization name, slug, and avatar URL.
          </p>
        </div>

        <div className="rounded-2xl border bg-background p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="organization-name">
              Organization name
            </label>
            <input
              id="organization-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={!canEdit || updateOrganization.isPending}
              className="w-full rounded-xl border bg-transparent px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="organization-slug">
              Organization slug
            </label>
            <input
              id="organization-slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              disabled={!canEdit || updateOrganization.isPending}
              className="w-full rounded-xl border bg-transparent px-4 py-3"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="organization-logo">
              Avatar URL
            </label>
            <input
              id="organization-logo"
              value={logo}
              onChange={(event) => setLogo(event.target.value)}
              disabled={!canEdit || updateOrganization.isPending}
              className="w-full rounded-xl border bg-transparent px-4 py-3"
              placeholder="https://example.com/logo.png"
            />
          </div>

          {!canEdit ? (
            <p className="text-sm text-muted-foreground">
              Only organization owners can update settings.
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button
              disabled={!canEdit || updateOrganization.isPending}
              onClick={() =>
                updateOrganization.mutate({
                  orgSlug,
                  name,
                  slug,
                  logo,
                })
              }
            >
              {updateOrganization.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationSettingsView;
