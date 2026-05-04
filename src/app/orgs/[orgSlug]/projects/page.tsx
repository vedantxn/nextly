import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ProjectsPageView } from "@/modules/projects/ui/views/projects-page-view";

interface Props {
  params: Promise<{ orgSlug: string }>;
}

export default async function OrganizationProjectsPage({ params }: Props) {
  const { orgSlug } = await params;

  const queryClient = await getQueryClient();
  void queryClient.prefetchQuery(
    trpc.projects.getMany.queryOptions({ orgSlug })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <Suspense fallback={<p>Loading...</p>}>
          <ProjectsPageView orgSlug={orgSlug} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
}
