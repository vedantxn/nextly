# Supabase + Better Auth Migration Plan

## Status

- Drafted, not approved for implementation yet.
- This document is the working source of truth for the migration.
- No implementation phase should begin until explicit user approval.

## Objective

Rebuild the authentication and database foundation for Nextly using:

- `Supabase Postgres` as the database platform
- `Prisma` as the ORM for phase 1 of the rebuild
- `Better Auth` as the authentication system
- Existing `tRPC` and server-side data access patterns

This is a greenfield cutover for infrastructure and auth.

## Explicit Scope

### In scope

- Fresh Supabase-backed database setup
- New auth foundation with Better Auth
- Recreating app tables from scratch
- Replacing Clerk auth dependencies
- Keeping current product domain shape for now
- Single-plan app logic for the first rebuild
- Private projects by default
- OAuth-first auth UX with email support
- Resend setup in phase 9

### Out of scope

- Deployment work
- Migration of old users
- Preservation of old environments
- Billing integration
- Supabase Auth
- RLS in the first pass

## Locked Decisions

- Auth provider: `Better Auth`
- Database: `Supabase Postgres`
- ORM: `Prisma`
- Data access: server-only via `tRPC`, route handlers, and server jobs
- Plans: single plan for now
- Account model: personal accounts only
- Project visibility: private by default
- Security model for phase 1: app-level authorization first, RLS later
- Sign-in methods: `Google`, `GitHub`, `Email/Password`
- UX preference: OAuth-first, with email/password still supported

## Important Architectural Rule

Supabase is the database platform for this migration.
Better Auth is the authentication system.
Supabase Auth is not part of this plan.

## Current Migration Surface

The current codebase is tightly coupled to Clerk and Prisma. Main touchpoints already identified:

### Clerk touchpoints

- `src/app/layout.tsx`
- `src/middleware.ts`
- `src/trpc/init.ts`
- `src/lib/usage.ts`
- `src/components/user-control.tsx`
- `src/app/(home)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(home)/sign-up/[[...sign-up]]/page.tsx`
- `src/modules/home/ui/components/navbar.tsx`
- `src/app/(home)/page.tsx`
- `src/app/(home)/pricing/page.tsx`
- `src/app/projects/page.tsx`
- `src/modules/home/ui/components/projects-list.tsx`
- `src/modules/home/ui/components/project-form.tsx`
- `src/modules/projects/ui/views/project-view.tsx`
- `src/modules/projects/ui/components/message-form.tsx`
- `src/modules/projects/ui/components/usage.tsx`

### Prisma and database touchpoints

- `src/lib/db.ts`
- `prisma/schema.prisma`
- `src/modules/projects/server/procedures.ts`
- `src/modules/messages/server/procedures.ts`
- `src/inngest/functions.ts`

### Prisma type imports currently used in UI

- `src/modules/projects/ui/views/project-view.tsx`
- `src/modules/projects/ui/components/messages-container.tsx`
- `src/modules/projects/ui/components/message-card.tsx`
- `src/modules/projects/ui/components/fragment-web.tsx`

## Target Data Model

### Better Auth tables

- `user`
- `session`
- `account`
- `verification`

### App tables

- `project`
- `message`
- `fragment`
- `usage`

## Recommended Table Shape

### `user`

- `id`
- `name`
- `email`
- `emailVerified`
- `image`
- `role`
- `createdAt`
- `updatedAt`

Notes:

- `role` is optional but recommended now so future admin controls do not require a breaking auth schema change.
- Default role should be a simple app-level value such as `user`.

### `session`

- `id`
- `userId`
- `token`
- `expiresAt`
- `ipAddress`
- `userAgent`
- `createdAt`
- `updatedAt`

### `account`

- `id`
- `userId`
- `providerId`
- `accountId`
- provider token fields required by Better Auth adapter
- `createdAt`
- `updatedAt`

### `verification`

- `id`
- `identifier`
- `value`
- `expiresAt`
- `createdAt`
- `updatedAt`

### `project`

- `id`
- `userId`
- `name`
- `visibility`
- `createdAt`
- `updatedAt`

Notes:

- `userId` must be a real foreign key to `user.id`.
- `visibility` should default to `private`.

### `message`

- `id`
- `projectId`
- `role`
- `type`
- `content`
- `createdAt`
- `updatedAt`

Notes:

- Keep the current enum-style concepts for `role` and `type`.

### `fragment`

- `id`
- `messageId`
- `sandboxUrl`
- `title`
- `files`
- `createdAt`
- `updatedAt`

Notes:

- `messageId` remains unique.
- `files` should stay `jsonb`.

### `usage`

- `id` or `userId` as primary key
- `userId`
- `points`
- `periodStart`
- `periodEnd`
- `createdAt`
- `updatedAt`

Notes:

- For the first rebuild, usage is an app-owned quota table, not a billing table.
- This should no longer depend on auth-provider-specific IDs outside the Better Auth `user` table.

## Required Constraints and Indexes

- Foreign key `project.userId -> user.id`
- Foreign key `message.projectId -> project.id`
- Foreign key `fragment.messageId -> message.id`
- Cascade delete `project -> message -> fragment`
- Index `project.userId`
- Index `project.updatedAt`
- Index `message.projectId`
- Index `message.createdAt`
- Unique index `fragment.messageId`
- Index `session.userId`
- Index `account.userId`
- Index `usage.userId`
- Unique index `user.email`

## Environment Variables Needed

### Database

- `DATABASE_URL`
- `DIRECT_URL`
- `SHADOW_DATABASE_URL` if Prisma migrate requires it in your Supabase setup

### Better Auth

- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL` or equivalent canonical app URL config used by the Better Auth integration

### OAuth

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### Email

- `RESEND_API_KEY`
- `EMAIL_FROM`

### Existing product keys not needed for the tables/auth phases but needed later

- `OPENAI_API_KEY`
- `OPENAI_API_BASE`
- `INNGEST_SIGNING_KEY`
- `INNGEST_EVENT_KEY`
- `E2B_API_KEY`
- `NEXT_PUBLIC_APP_URL` if kept as an explicit runtime config

## Phase Rules

- Do not begin a phase until the user explicitly approves that phase.
- At the end of each completed phase, create one git commit.
- Do not combine multiple phases into one commit.
- If a phase exposes a blocking architecture issue, stop and re-approve before continuing.

## Commit Policy

Each implementation phase should end with:

1. Code and config changes complete for that phase
2. Relevant verification for that phase completed
3. Short written summary of what changed and what remains
4. One git commit

Recommended commit message format:

- `phase 1: connect prisma to supabase`
- `phase 2: add better auth and app schema`
- `phase 3: replace clerk auth boundary`

## Phase 0: Final Preflight and Branch Safety

### Goal

Lock the migration contract before implementation starts.

### Work

- Confirm that this document is approved as the source of truth.
- Confirm exact environment variable names for Better Auth integration.
- Confirm whether `SHADOW_DATABASE_URL` is needed for the chosen Supabase posture.
- Create a migration branch if desired.
- Add or update `.env.example` only after implementation starts, not before.

### Deliverables

- Approved migration plan
- Final list of required secrets
- Agreed execution order

### Exit criteria

- User explicitly approves phase 1 work to begin

## Phase 1: Supabase Database Foundation

### Goal

Establish the fresh Supabase Postgres foundation and clean Prisma connectivity.

### Work

- Create the new Supabase project.
- Select production-appropriate region.
- Obtain connection strings for pooled and direct access.
- Point Prisma to Supabase Postgres using `DATABASE_URL` and `DIRECT_URL`.
- Remove dependence on Prisma Accelerate unless there is a concrete reason to keep it.
- Validate that `prisma generate` and migration tooling work against Supabase.
- Decide whether to use Prisma migrations from repo or `db push` only during bootstrapping.

### Files likely touched

- `prisma/schema.prisma`
- `src/lib/db.ts`
- `package.json`
- `.env.example`
- migration or setup documentation

### Deliverables

- Prisma connects cleanly to Supabase Postgres
- No Clerk or auth changes yet
- DB foundation ready for schema creation

### Verification

- Prisma client generation works
- Local migration or schema push works
- App boot does not fail on DB initialization

### Commit

- One commit at end of phase 1

## Phase 2: Recreate Tables on Supabase

### Goal

Create the new database schema for Better Auth and the existing app domain.

### Work

- Add Better Auth tables: `user`, `session`, `account`, `verification`.
- Recreate app tables: `project`, `message`, `fragment`, `usage`.
- Add proper foreign keys, cascades, indexes, and uniqueness rules.
- Preserve current domain shape where possible to avoid unnecessary product redesign.
- Introduce `visibility` on projects with `private` default.
- Replace old provider-coupled ownership assumptions with FK-based ownership.

### Files likely touched

- `prisma/schema.prisma`
- generated Prisma migration files

### Deliverables

- Fresh Supabase schema exists and is reproducible from the repo
- App tables are ready for Better Auth and server code migration

### Verification

- Migration applies cleanly from an empty database
- All foreign keys and indexes exist as expected
- Prisma client types generate correctly

### Commit

- One commit at end of phase 2

## Phase 3: Add Better Auth Backend Foundation

### Goal

Stand up Better Auth against Supabase Postgres via Prisma.

### Work

- Install and configure Better Auth.
- Create the auth server module and central config.
- Add Prisma adapter wiring.
- Configure session cookies securely for local and production environments.
- Enable providers: Google, GitHub, Email/Password.
- Add email verification and password reset flows in backend config.
- Add trusted origins and callback URL configuration.

### Files likely touched

- new auth server config files
- route handlers for Better Auth endpoints
- environment docs
- package dependencies

### Deliverables

- Better Auth works end-to-end on the backend
- Sessions can be created and resolved server-side

### Verification

- Email/password signup works locally
- Session retrieval works server-side
- OAuth callback routes are configured correctly

### Commit

- One commit at end of phase 3

## Phase 4: Replace Clerk at the App Boundary

### Goal

Remove Clerk from the server boundary and app shell.

### Work

- Remove `ClerkProvider` from `src/app/layout.tsx`.
- Replace Clerk route protection in `src/middleware.ts`.
- Replace tRPC auth context in `src/trpc/init.ts`.
- Rebuild `protectedProcedure` on top of Better Auth session lookup.
- Replace unauthorized handling that currently depends on Clerk helpers.
- Remove Clerk sign-in and sign-up page implementations.

### Files likely touched

- `src/app/layout.tsx`
- `src/middleware.ts`
- `src/trpc/init.ts`
- `src/app/(home)/sign-in/[[...sign-in]]/page.tsx`
- `src/app/(home)/sign-up/[[...sign-up]]/page.tsx`

### Deliverables

- The request/auth boundary no longer depends on Clerk
- Protected server code resolves the current user through Better Auth

### Verification

- Anonymous access works for public pages
- Protected pages reject unauthenticated access
- Authenticated sessions can reach protected routes

### Commit

- One commit at end of phase 4

## Phase 5: Migrate Server Data Ownership and Usage Logic

### Goal

Reconnect app data and quota logic to the new user model.

### Work

- Replace ownership checks in tRPC procedures with Better Auth user IDs.
- Update `src/modules/projects/server/procedures.ts`.
- Update `src/modules/messages/server/procedures.ts`.
- Update `src/inngest/functions.ts` to read and write against the new schema safely.
- Replace the current auth-coupled usage logic in `src/lib/usage.ts`.
- Remove all server-side assumptions about Clerk plans.
- Normalize to one app-owned quota policy for all users.

### Files likely touched

- `src/modules/projects/server/procedures.ts`
- `src/modules/messages/server/procedures.ts`
- `src/modules/usage/server/procedures.ts`
- `src/lib/usage.ts`
- `src/inngest/functions.ts`

### Deliverables

- Server ownership checks work with Better Auth users
- Usage and quotas no longer depend on Clerk
- Background jobs can still persist data correctly

### Verification

- Authenticated user can create and fetch only their own projects
- Message creation still triggers the job pipeline correctly
- Quota checks run without auth-provider-specific plan logic

### Commit

- One commit at end of phase 5

## Phase 6: Decouple the UI from Clerk and Prisma-Specific Types

### Goal

Remove direct Clerk usage in client components and reduce UI coupling to Prisma-generated types.

### Work

- Replace `useUser`, `useAuth`, `useClerk`, `SignedIn`, `SignedOut`, `UserButton`, and `SignUpButton`.
- Create app-level auth UI primitives and client hooks as needed.
- Replace Prisma type imports in UI with app-owned types or inferred procedure output types.
- Update usage and model-gating UI for the single-plan model.

### Files likely touched

- `src/components/user-control.tsx`
- `src/modules/home/ui/components/navbar.tsx`
- `src/app/(home)/page.tsx`
- `src/app/(home)/pricing/page.tsx`
- `src/app/projects/page.tsx`
- `src/modules/home/ui/components/projects-list.tsx`
- `src/modules/home/ui/components/project-form.tsx`
- `src/modules/projects/ui/views/project-view.tsx`
- `src/modules/projects/ui/components/message-form.tsx`
- `src/modules/projects/ui/components/usage.tsx`
- `src/modules/projects/ui/components/messages-container.tsx`
- `src/modules/projects/ui/components/message-card.tsx`
- `src/modules/projects/ui/components/fragment-web.tsx`

### Deliverables

- UI no longer depends on Clerk
- UI no longer imports Prisma types directly
- Single-plan UX is internally consistent

### Verification

- Signed-out and signed-in nav states work
- Auth CTAs route correctly
- Project and message flows still render correctly

### Commit

- One commit at end of phase 6

## Phase 7: Build Auth Screens and Account Flows

### Goal

Provide production-standard auth flows using Better Auth.

### Work

- Build sign-in page
- Build sign-up page
- Build logout flow
- Build forgot-password flow
- Build reset-password flow
- Build verify-email completion flow
- Present Google and GitHub OAuth prominently
- Keep email/password available as secondary path

### Deliverables

- The app has working auth screens and account entry points without Clerk

### Verification

- Sign in with Google works
- Sign in with GitHub works
- Email/password flow works
- Session persists and logout clears it

### Commit

- One commit at end of phase 7

## Phase 8: Hardening, Validation, and Cleanup

### Goal

Finish the cutover cleanly and reduce migration leftovers.

### Work

- Remove Clerk dependencies from `package.json`.
- Remove unused Clerk env references from docs and examples.
- Remove Prisma Accelerate if unused.
- Remove dead auth code and unused pages.
- Update README and local setup instructions.
- Review cookies, session expiry, callback URLs, and error states.
- Run a final auth and ownership regression pass.

### Deliverables

- Clean codebase with Clerk fully removed
- Auth and schema docs updated

### Verification

- Fresh install works
- App boots with the new env contract
- Core auth and app flows pass manual validation

### Commit

- One commit at end of phase 8

## Phase 9: Resend Setup and Email Delivery

### Goal

Wire email delivery for verification and recovery flows using Resend.

### Work

- Add Resend integration.
- Configure `RESEND_API_KEY` and `EMAIL_FROM`.
- Implement email sending utilities for Better Auth flows.
- Create production-appropriate templates for:
  - verify email
  - reset password
  - fallback account notifications if needed
- Ensure local and preview environments fail gracefully when email config is missing.

### Deliverables

- Verification and recovery emails send successfully through Resend

### Verification

- Verification email sends and link works
- Password reset email sends and flow completes
- Email sender identity is correct and stable

### Commit

- One commit at end of phase 9

## Recommended Verification Matrix

Run this after the auth and table migration phases are complete:

- anonymous user can access public pages
- anonymous user cannot access protected pages
- sign up with email/password
- sign in with email/password
- sign in with Google
- sign in with GitHub
- sign out
- email verification flow
- password reset flow
- create project
- fetch own projects only
- create follow-up message
- persist generated fragment output
- prevent cross-user project access
- usage/quota check works under single-plan model

## Open Items Before Starting Implementation

- Confirm final Better Auth env variable names used in code
- Confirm whether `SHADOW_DATABASE_URL` is required
- Confirm exact quota policy for the single-plan model
- Confirm whether the pricing page should be informational or simplified during the rebuild

## Immediate Next Step

Wait for approval.

When approved, start with `Phase 1: Supabase Database Foundation` and stop for review before phase 2.
