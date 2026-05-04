import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAccessControl, organization } from "better-auth/plugins";
import prisma from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { ensurePersonalOrganization } from "@/lib/organization";

const organizationAccess = createAccessControl({
  organization: ["update", "delete"],
  member: ["create", "update", "delete"],
  invitation: ["create", "cancel"],
  team: ["create", "update", "delete"],
  ac: ["read"],
});

const organizationRoles = {
  owner: organizationAccess.newRole({
    organization: ["update", "delete"],
    member: ["create", "update", "delete"],
    invitation: ["create", "cancel"],
    team: ["create", "update", "delete"],
    ac: ["read"],
  }),
  member: organizationAccess.newRole({
    organization: [],
    member: [],
    invitation: [],
    team: [],
    ac: ["read"],
  }),
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    organization({
      ac: organizationAccess,
      roles: organizationRoles,
      creatorRole: "owner",
      allowUserToCreateOrganization: true,
      membershipLimit: Number.MAX_SAFE_INTEGER,
      invitationLimit: Number.MAX_SAFE_INTEGER,
      schema: {
        organization: {
          additionalFields: {
            kind: {
              type: "string",
              required: true,
              defaultValue: "TEAM",
              input: false,
            },
            personalForUserId: {
              type: "string",
              required: false,
              input: false,
              returned: false,
              references: {
                model: "user",
                field: "id",
                onDelete: "cascade",
              },
            },
          },
        },
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await ensurePersonalOrganization({
            userId: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          });
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          });

          if (!user) {
            return;
          }

          const personalOrganization = await ensurePersonalOrganization({
            userId: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          });

          return {
            data: {
              ...session,
              activeOrganizationId: personalOrganization.id,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Nextly password",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Reset your password</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Click the link below to reset your password. This link expires in 1 hour.</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #C96342; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Reset Password
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your Nextly email",
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2>Verify your email</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Click the link below to verify your email address.</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #C96342; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">
              Verify Email
            </a>
            <p style="margin-top: 24px; color: #666; font-size: 14px;">
              If you didn't create a Nextly account, you can safely ignore this email.
            </p>
          </div>
        `,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],
});
