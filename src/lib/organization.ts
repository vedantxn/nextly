import prisma from "@/lib/db";

const ORGANIZATION_PERIOD_DAYS = 30;
const MAX_SLUG_ATTEMPTS = 50;

type SessionWithOrganization = {
  user?: {
    id?: string | null;
  } | null;
  session?: {
    activeOrganizationId?: string | null;
  } | null;
};

type PersonalOrganizationInput = {
  userId: string;
  name?: string | null;
  email: string;
  image?: string | null;
};

export type AccessibleOrganization = {
  id: string;
  slug: string;
  name: string;
  kind: string;
};

function slugifySegment(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 48);
}

function getFallbackDisplayName(email: string) {
  const localPart = email.split("@")[0]?.trim();
  return localPart && localPart.length > 0 ? localPart : "Personal";
}

export function buildPersonalOrganizationName(name?: string | null, email?: string) {
  const baseName = name?.trim() || (email ? getFallbackDisplayName(email) : "Personal");
  return `${baseName}'s Organization`;
}

export async function generateUniqueOrganizationSlug(source: string) {
  const baseSlug = slugifySegment(source) || "personal-organization";

  for (let attempt = 1; attempt <= MAX_SLUG_ATTEMPTS; attempt += 1) {
    const suffix = attempt === 1 ? "" : `-${attempt}`;
    const trimmedBase = baseSlug.slice(0, Math.max(1, 48 - suffix.length));
    const slug = `${trimmedBase}${suffix}`;
    const existing = await prisma.organization.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }
  }

  throw new Error("Unable to generate a unique organization slug");
}

export async function ensurePersonalOrganization({
  userId,
  name,
  email,
  image,
}: PersonalOrganizationInput) {
  const existing = await prisma.organization.findUnique({
    where: { personalForUserId: userId },
  });

  if (existing) {
    return existing;
  }

  const organizationName = buildPersonalOrganizationName(name, email);
  const slug = await generateUniqueOrganizationSlug(organizationName);
  const now = new Date();
  const periodEnd = new Date(now.getTime() + ORGANIZATION_PERIOD_DAYS * 24 * 60 * 60 * 1000);

  try {
    return await prisma.organization.create({
      data: {
        name: organizationName,
        slug,
        logo: image ?? null,
        kind: "PERSONAL",
        personalForUserId: userId,
        members: {
          create: {
            userId,
            role: "owner",
          },
        },
        usage: {
          create: {
            points: 0,
            periodStart: now,
            periodEnd,
          },
        },
      },
    });
  } catch (error) {
    const recovered = await prisma.organization.findUnique({
      where: { personalForUserId: userId },
    });

    if (recovered) {
      return recovered;
    }

    throw error;
  }
}

export async function resolveActiveOrganizationId(session: SessionWithOrganization) {
  const activeOrganizationId = session.session?.activeOrganizationId;

  if (activeOrganizationId) {
    return activeOrganizationId;
  }

  const userId = session.user?.id;

  if (!userId) {
    throw new Error("No authenticated user available");
  }

  const personalOrganization = await prisma.organization.findUnique({
    where: { personalForUserId: userId },
    select: { id: true },
  });

  if (personalOrganization) {
    return personalOrganization.id;
  }

  const firstMembership = await prisma.member.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { organizationId: true },
  });

  if (firstMembership) {
    return firstMembership.organizationId;
  }

  throw new Error("No organization is available for this user");
}

export async function resolveActiveOrganization(session: SessionWithOrganization): Promise<AccessibleOrganization> {
  const organizationId = await resolveActiveOrganizationId(session);
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      id: true,
      slug: true,
      name: true,
      kind: true,
    },
  });

  if (!organization) {
    throw new Error("The active organization could not be found");
  }

  return organization;
}

export async function resolveAccessibleOrganizationBySlug(userId: string, orgSlug: string): Promise<AccessibleOrganization | null> {
  return prisma.organization.findFirst({
    where: {
      slug: orgSlug,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      kind: true,
    },
  });
}

export async function resolveProjectOrganizationForUser(userId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      organization: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    select: {
      organization: {
        select: {
          id: true,
          slug: true,
          name: true,
          kind: true,
        },
      },
    },
  });
}
