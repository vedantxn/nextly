import { auth } from "@/lib/auth";
import { resolveActiveOrganization } from "@/lib/organization";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

  const organization = await resolveActiveOrganization(session);
  redirect(`/orgs/${organization.slug}/projects`);
}
