import prisma from "@/lib/db";
import {
  normalizeOrganizationSlug,
  resolveAccessibleOrganizationBySlug,
} from "@/lib/organization";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const updateOrganizationSchema = z.object({
  orgSlug: z.string().min(1),
  name: z.string().min(1).max(120).optional(),
  slug: z.string().min(1).max(120).optional(),
  logo: z.union([z.string().url(), z.literal("")]).optional(),
});

export const organizationsRouter = createTRPCRouter({
  listMine: protectedProcedure.query(async ({ ctx }) => {
    return prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: ctx.user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        kind: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [{ kind: "asc" }, { createdAt: "asc" }],
    });
  }),

  getOne: protectedProcedure
    .input(
      z.object({
        orgSlug: z.string().min(1),
      }),
    )
    .query(async ({ input, ctx }) => {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: input.orgSlug,
          members: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          kind: true,
          createdAt: true,
          updatedAt: true,
          members: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              role: true,
            },
            take: 1,
          },
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      return {
        ...organization,
        currentRole: organization.members[0]?.role ?? "member",
      };
    }),

  update: protectedProcedure
    .input(updateOrganizationSchema)
    .mutation(async ({ input, ctx }) => {
      const organization = await prisma.organization.findFirst({
        where: {
          slug: input.orgSlug,
          members: {
            some: {
              userId: ctx.user.id,
            },
          },
        },
        select: {
          id: true,
          members: {
            where: {
              userId: ctx.user.id,
            },
            select: {
              role: true,
            },
            take: 1,
          },
        },
      });

      if (!organization) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found",
        });
      }

      if (organization.members[0]?.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners can update settings",
        });
      }

      let normalizedSlug: string | undefined;

      if (typeof input.slug === "string") {
        normalizedSlug = normalizeOrganizationSlug(input.slug);

        if (!normalizedSlug) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Organization slug is invalid",
          });
        }

        const existingOrganization = await resolveAccessibleOrganizationBySlug(
          ctx.user.id,
          normalizedSlug,
        );

        if (existingOrganization && existingOrganization.id !== organization.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Organization slug is already in use",
          });
        }

        const slugConflict = await prisma.organization.findFirst({
          where: {
            slug: normalizedSlug,
            id: {
              not: organization.id,
            },
          },
          select: { id: true },
        });

        if (slugConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Organization slug is already in use",
          });
        }
      }

      return prisma.organization.update({
        where: { id: organization.id },
        data: {
          name: input.name,
          slug: normalizedSlug,
          logo: input.logo === "" ? null : input.logo,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
          kind: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    }),
});

export type OrganizationsRouter = typeof organizationsRouter;
