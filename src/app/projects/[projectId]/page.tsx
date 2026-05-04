import { auth } from "@/lib/auth";
import { resolveProjectOrganizationForUser } from "@/lib/organization";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

interface Props {
    params: Promise<{ projectId: string }>
}

const Page = async ({ params }: Props) => {
    const { projectId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/sign-in");
    }

    const scopedProject = await resolveProjectOrganizationForUser(
      session.user.id,
      projectId,
    );

    if (!scopedProject?.organization) {
      notFound();
    }

    redirect(`/orgs/${scopedProject.organization.slug}/projects/${projectId}`);
}

export default Page
