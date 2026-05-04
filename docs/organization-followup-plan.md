# Organization Follow-Up Plan

## Status

- Drafted, not approved for implementation yet.
- This is a follow-up plan that starts only after the current migration plan is fully completed.
- This document is separate on purpose so another agent can work from it without changing the current migration scope.

## Depends On

This plan assumes `docs/supabase-better-auth-migration-plan.md` is complete through phase 9, including:

- `Supabase Postgres`
- `Prisma`
- `Better Auth`
- stable auth flows
- stable project/message/fragment/usage baseline
- Resend-based email delivery

## Objective

Move the product from user-owned resources to organization-owned resources, using a Vercel-style account model:

- every user gets a visible personal organization
- users can create additional team organizations
- projects belong to organizations, not directly to users
- usage, quotas, and future billing attach to organizations
- organization membership controls access to resources

## Explicit Scope

### In scope

- organization data model
- personal organization bootstrap
- org membership model
- org switcher in the UI
- slug-based org URLs
- email invite flow
- org-scoped projects and usage
- org settings: name, slug, avatar

### Out of scope

- billing provider integration
- seat-based billing
- custom RBAC beyond owner/member
- project transfer between orgs
- data migration from the pre-org user-owned model

## Locked Decisions

- this starts after the current 9-phase migration is done
- `Owner + Member` roles only in v1
- invite flow is email-based in v1
- personal org is visible in the UI and named from the user, like `Vedant's Organization`
- org switcher exists in the nav
- org slug appears in URLs
- team org creation is open to all users
- no hard limits on org creation or membership in v1
- when a member is removed, projects stay with the org
- org settings in v1: `name`, `slug`, `avatar`
- usage, quotas, and future billing anchor to the organization
- no project transfer between orgs in v1
- if a user deletes their account, their personal org is deleted with it
- start fresh, no migration/backfill for the user-owned project model

## Important Consequence

This is not a compatibility layer.

Once this plan starts, the app ownership model changes from:

- `user owns projects`

to:

- `organization owns projects`

Because the app is being rebuilt on a fresh foundation and old data is not important, this plan intentionally avoids writing backfill logic for the intermediate user-owned schema.

## Product Model

### Personal organization

Every user automatically gets one personal organization on signup.

Example:

- user: `Vedant`
- personal org name: `Vedant's Organization`

Characteristics:

- visible in the org switcher
- has exactly one member at creation
- member role is `OWNER`
- cannot be converted into a team org
- cannot be transferred
- deletes when the user account is deleted

### Team organization

Users can also create additional team organizations.

Characteristics:

- has its own name, slug, and avatar
- can have multiple members
- is managed by owners
- can own projects and usage independently of the personal org

## Recommended URL Model

Use org-scoped URLs as the primary context source.

Recommended route structure:

- `/orgs/[orgSlug]/projects`
- `/orgs/[orgSlug]/projects/[projectId]`
- `/orgs/[orgSlug]/settings`
- `/orgs/[orgSlug]/members`

Why this is recommended:

- avoids collisions with existing public routes like `/pricing` and `/about`
- keeps org context explicit and debuggable
- avoids overloading cookies or session state as the source of truth
- makes switching organizations a navigation action, not a hidden client-side state change

Optional convenience:

- remember the most recently visited org and redirect `/projects` or `/dashboard` there later

But the source of truth should still be the URL slug.

## Authorization Model

### Roles

Only two roles exist in v1:

- `OWNER`
- `MEMBER`

### Owner permissions

- update org settings
- invite members
- revoke invitations
- remove members
- create and delete projects
- manage org-scoped usage settings when needed later

### Member permissions

- access org projects they are allowed to see in that org
- create and update projects in that org
- participate in org-owned project workflows
- view basic org context

### Permission rule

Every protected org resource must verify:

1. the organization exists
2. the current user is a member of it
3. the current user's role is sufficient for the requested action

Do not rely on client-side org state for authorization.

## Data Model

## New Tables

### `organization`

Recommended fields:

- `id`
- `name`
- `slug`
- `image`
- `kind`
- `personalForUserId`
- `createdAt`
- `updatedAt`

Recommended semantics:

- `kind` is `PERSONAL` or `TEAM`
- `slug` is globally unique
- `personalForUserId` is nullable for team orgs
- `personalForUserId` is set for personal orgs and references `user.id`

Recommended constraints:

- unique index on `slug`
- unique index on `personalForUserId`

Why `personalForUserId` is recommended:

- enforces one personal org per user cleanly
- avoids relying only on membership rows to infer personal ownership
- makes signup bootstrap and account deletion safer

### `organizationMember`

Recommended fields:

- `id`
- `organizationId`
- `userId`
- `role`
- `createdAt`
- `updatedAt`

Recommended constraints:

- foreign key `organizationId -> organization.id`
- foreign key `userId -> user.id`
- unique composite index on `organizationId, userId`

Recommended role enum:

- `OWNER`
- `MEMBER`

### `organizationInvitation`

Recommended fields:

- `id`
- `organizationId`
- `email`
- `role`
- `inviterUserId`
- `token`
- `status`
- `expiresAt`
- `createdAt`
- `updatedAt`

Recommended status enum:

- `PENDING`
- `ACCEPTED`
- `EXPIRED`
- `REVOKED`

Recommended constraints:

- foreign key `organizationId -> organization.id`
- foreign key `inviterUserId -> user.id`
- unique index on `token`

Recommended application rules:

- only owners can create invitations
- invitations are email-based
- an accepted invitation creates a membership row
- one active pending invite per `organization + email` should be enforced in app logic if not enforced in SQL

## Changed Tables

### `project`

Current direction after the base migration:

- project ownership is user-oriented

New direction:

- replace direct user ownership with `organizationId`

Recommended fields:

- `id`
- `organizationId`
- `name`
- `visibility` if still needed internally
- `createdAt`
- `updatedAt`

Recommended constraints:

- foreign key `organizationId -> organization.id`
- index `organizationId`
- index `updatedAt`

Important rule:

- projects remain with the org even if the creating member is removed later

### `message`

No new ownership field is required if the chain remains:

- `message -> project -> organization`

### `fragment`

No org field is required if the chain remains:

- `fragment -> message -> project -> organization`

### `usage`

Move usage ownership from user scope to organization scope.

Recommended fields:

- `id` or `organizationId` as key
- `organizationId`
- `points`
- `periodStart`
- `periodEnd`
- `createdAt`
- `updatedAt`

Recommended constraints:

- foreign key `organizationId -> organization.id`
- unique index on `organizationId`

Important rule:

- usage, quotas, and future billing state are org-owned, not user-owned

## Recommended Schema Behavior

### On signup

After a user is created through Better Auth:

1. create a personal org with name derived from user name
2. generate a unique slug
3. set `kind = PERSONAL`
4. set `personalForUserId = user.id`
5. create one `organizationMember` row with role `OWNER`
6. create one org usage row if usage is provisioned at creation time

### On org switch

- switcher navigates to the chosen org URL
- server resolves org by slug
- server verifies the current user is a member

### On member removal

- delete the membership row
- keep org-owned projects intact
- revoke any still-pending invites if needed through owner actions

### On account deletion

- delete the user
- cascade delete the personal org linked by `personalForUserId`
- team org memberships should be removed without deleting the team org itself

### On team org deletion

- only owners can delete a team org
- deleting a team org deletes:
  - its memberships
  - its invitations
  - its projects
  - downstream messages and fragments through cascade
  - its usage state

## Implementation Strategy

Because this is a follow-up to the base migration and no old data matters, the safest strategy is:

1. finish the current migration completely
2. start org work on a clean branch
3. treat the org model as a schema reset of app ownership
4. do not spend time on backfill scripts for intermediate user-owned data

## Phases

## Phase 10: Org Schema Reset and Ownership Redesign

### Goal

Add the organization tables and change ownership from users to orgs.

### Work

- add `organization`
- add `organizationMember`
- add `organizationInvitation`
- change `project` to reference `organizationId`
- change `usage` to reference `organizationId`
- keep `message` and `fragment` attached through project hierarchy
- add required enums, indexes, and cascades
- remove intermediate user-owned assumptions from schema

### Deliverables

- organization-aware Prisma schema
- clean migration files for the org model

### Verification

- empty database can be migrated successfully
- constraints enforce one personal org per user
- project and usage ownership is org-scoped

### Commit

- one commit at end of phase 10

## Phase 11: Personal Org Bootstrap

### Goal

Automatically create a visible personal org for every new user.

### Work

- hook org bootstrap into the post-signup path
- generate org name from user name
- generate a unique slug
- create owner membership
- provision org usage if needed at bootstrap time
- define fallback naming behavior when user name is missing

### Deliverables

- every user gets a personal org automatically

### Verification

- new signup creates org + owner membership + usage state
- duplicate personal org creation is prevented

### Commit

- one commit at end of phase 11

## Phase 12: Org Context, Routing, and Server Authorization

### Goal

Make organization slug the primary runtime scope.

### Work

- add org-scoped routes
- resolve org by slug on the server
- verify membership in middleware or protected server boundary where appropriate
- extend tRPC context so org-aware procedures have:
  - current user
  - current org
  - current membership role
- add helpers for owner-only vs member-level procedures

### Deliverables

- org context is available server-side
- org membership is enforced consistently

### Verification

- user cannot access an org they do not belong to
- owner/member role checks behave correctly

### Commit

- one commit at end of phase 12

## Phase 13: Org Switcher and Org Settings UI

### Goal

Expose personal and team orgs in the app shell.

### Work

- add org switcher to nav
- list all orgs the user belongs to
- label personal org cleanly in the switcher if useful
- navigate by slug-based URLs
- add org settings screen for:
  - name
  - slug
  - avatar

### Deliverables

- visible org context in the UI
- users can switch between organizations reliably

### Verification

- switcher only shows orgs the user belongs to
- changing org settings updates routing safely
- slug changes are handled without broken navigation

### Commit

- one commit at end of phase 13

## Phase 14: Team Org Creation, Invites, and Membership Management

### Goal

Let users create team orgs and collaborate through invitations.

### Work

- add create-team-org flow
- add invite-by-email flow
- add invitation acceptance flow
- add member list UI
- add owner actions:
  - invite
  - revoke invite
  - remove member
- prevent owners from removing the last owner without replacement logic

### Deliverables

- users can create team orgs and add members by email

### Verification

- invited user can accept and join the org
- revoked or expired invites cannot be used
- removed members lose access immediately

### Commit

- one commit at end of phase 14

## Phase 15: Org-Scoped Projects, Usage, and Billing Anchor

### Goal

Finish the resource model so app ownership is consistently org-based.

### Work

- update project queries and mutations to scope by org membership
- update usage/quota logic to scope by org
- update any future billing anchor assumptions to use `organizationId`
- remove remaining direct user-ownership assumptions in app logic
- verify downstream chains `project -> message -> fragment` still behave correctly

### Deliverables

- projects and usage are fully org-owned
- user identity is no longer the ownership boundary for core product resources

### Verification

- projects are isolated by organization
- switching org changes visible resources correctly
- usage/quota state is independent per org

### Commit

- one commit at end of phase 15

## Phase 16: Hardening, Deletes, Docs, and QA

### Goal

Finish the org rollout safely and document it.

### Work

- verify personal org account deletion behavior
- verify team org deletion behavior
- verify member removal behavior
- verify invite expiry behavior
- verify slug collision handling
- document the new org model in repo docs
- clean dead user-owned assumptions from code and docs

### Deliverables

- stable org-aware foundation
- updated documentation for future billing and collaboration work

### Verification

- full org lifecycle works end to end
- auth + org + project boundaries are consistent

### Commit

- one commit at end of phase 16

## Recommended Verification Matrix

- new signup creates personal org automatically
- personal org name is generated correctly
- personal org slug is unique
- nav switcher shows all orgs user belongs to
- org URL access is denied for non-members
- owner can create a team org
- owner can invite member by email
- invited user can accept invitation
- member can access org projects
- member cannot manage org settings reserved for owners
- owner can remove member
- removed member loses access immediately
- team org projects stay with the org after member removal
- usage is isolated per org
- deleting personal account deletes the personal org
- deleting team org cascades safely

## Open Items Before Implementation

- choose the final slug format and normalization rules
- choose whether org slugs are mutable or rename-once/stable
- decide whether `/projects` redirects to last org or to a scope picker
- decide whether members can create projects immediately or only owners in very early v1

## Recommended Defaults For Open Items

- lowercase slug
- letters, numbers, hyphens only
- mutable with uniqueness checks
- `/projects` redirects to org switcher or most recent org later
- members can create projects unless product policy changes

## Immediate Next Step

Do not start this until the current migration plan is complete and approved.

When this plan is approved, start with `Phase 10: Org Schema Reset and Ownership Redesign`.
