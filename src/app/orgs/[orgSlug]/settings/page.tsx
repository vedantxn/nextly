import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { OrganizationSettingsView } from "@/modules/organizations/ui/views/organization-settings-view";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrganizationSettingsPage({ params }: Props) {
  const { orgSlug } = await params;

  const queryClient = await getQueryClient();
  void queryClient.prefetchQuery(
    trpc.organizations.getOne.queryOptions({ orgSlug })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <OrganizationSettingsView orgSlug={orgSlug} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
