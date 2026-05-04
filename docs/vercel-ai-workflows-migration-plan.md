# Vercel AI SDK + Workflows Migration Plan

## Status

- Active migration plan.
- Execution is in progress.
- Background orchestration is moving from `Inngest + Agent Kit` to `Vercel Workflows + Vercel AI SDK`.
- Sandbox runtime is still `E2B` for now, but the migration is explicitly preparing for a later `Daytona` swap.

## Goal

Replace:

- `inngest` for durable background jobs
- `@inngest/agent-kit` for the agent/tool loop

with:

- `workflow` / `Vercel Workflows` for durable orchestration
- `ai` + `@ai-sdk/openai` for agentic tool execution

while preserving the current product behavior:

- async create-job UX
- message polling UX
- Prisma persistence model
- sandbox-based code generation

## Locked Decisions

- Keep the existing async poll UX for now.
- Use direct `OpenAI` rather than an OpenAI-compatible multi-provider base.
- Add a `generationJob` table instead of keeping implicit pending state.
- Start abstracting sandbox behavior now so `Daytona` can replace `E2B` later.
- Do not migrate to Daytona in this plan.
- Do not use the Vercel CLI during implementation.

## Current Architecture

### App entry points

- `src/modules/projects/server/procedures.ts`
- `src/modules/messages/server/procedures.ts`

Both create user messages and enqueue background work using `inngest.send(...)`.

### Inngest API endpoint

- `src/app/api/inngest/route.ts`

### Current runtime implementation

- `src/inngest/functions.ts`

That single file currently owns:

- model selection
- previous-message loading
- sandbox creation
- tool definitions
- multi-step agent loop
- title generation
- response generation
- final persistence

### Current UX pattern

- `src/modules/projects/ui/components/messages-container.tsx`

The UI polls every 5 seconds and infers that a generation is still pending when the most recent message is a user message.

## Target Architecture

### Durable execution

- `Vercel Workflows`

### Agent runtime

- `Vercel AI SDK Core`

### Model provider

- `@ai-sdk/openai`

### Sandbox boundary

- `SandboxAdapter` interface
- `E2BSandboxAdapter` now
- `DaytonaSandboxAdapter` later

### Persistence

- existing `message` and `fragment` records stay
- add `generationJob` for explicit run state

## Required Keys

### Needed now

- `OPENAI_API_KEY`

### Needed until the Daytona migration happens

- `E2B_API_KEY`

### Optional

- `OPENAI_PROJECT_ID`
- `OPENAI_ORG_ID`

### Expected to disappear later

- `INNGEST_SIGNING_KEY`
- `INNGEST_EVENT_KEY`
- likely `OPENAI_API_BASE`

## New Table

### `generationJob`

Recommended fields:

- `id`
- `projectId`
- `organizationId`
- `triggerMessageId`
- `workflowRunId`
- `status`
- `model`
- `attemptCount`
- `startedAt`
- `completedAt`
- `failedAt`
- `lastError`
- `createdAt`
- `updatedAt`

Recommended status values:

- `QUEUED`
- `RUNNING`
- `COMPLETED`
- `FAILED`
- `CANCELED`

## Phases

## Phase 1: Extract Runtime Boundaries

### Goal

Break the current `src/inngest/functions.ts` monolith into reusable modules without changing app behavior.

### Work

- extract model resolution
- extract previous-message loading
- extract sandbox adapter interface
- implement `E2BSandboxAdapter`
- keep Inngest active for now
- add Vercel-side dependencies that will be used by later phases

### Deliverable

- the current Inngest runtime still works, but the important concepts are no longer trapped in one file

## Phase 2: Add Explicit Job Tracking

### Goal

Introduce `generationJob` and stop relying on implicit “last user message means pending” assumptions.

### Work

- add `generationJob` Prisma model
- create jobs in project/message mutations
- pass job identity into the current Inngest runtime
- update current runtime to mark jobs `running`, `completed`, or `failed`

### Deliverable

- job state exists independently of Inngest or Workflows

## Phase 3: Replace Agent Kit with AI SDK Runtime

### Goal

Move the agent loop from `@inngest/agent-kit` to `Vercel AI SDK` while keeping Inngest as the orchestrator temporarily.

### Work

- replace `createAgent`, `createTool`, `createNetwork`, and `createState`
- use `generateText` with tools and explicit loop control
- preserve:
  - prompt behavior
  - tool names and contracts
  - summary extraction
  - final response generation
  - fragment title generation

### Deliverable

- agent runtime no longer depends on Agent Kit

## Phase 4: Introduce Vercel Workflows

### Goal

Add the workflow runtime and model the generation run as a durable workflow.

### Work

- add workflow entrypoints
- configure Next.js for workflow directives
- model step boundaries for:
  - sandbox creation
  - context load
  - agent run
  - result persistence
  - failure handling

### Deliverable

- workflows exist and can host the generation pipeline

## Phase 5: Switch Job Dispatch from Inngest to Workflows

### Goal

Move the app entry points from event enqueueing to workflow starts.

### Work

- replace `inngest.send(...)` in tRPC procedures
- create workflow runs instead
- persist workflow run IDs into `generationJob`
- keep the current polling UX

### Deliverable

- new generations are orchestrated by Workflows instead of Inngest

## Phase 6: Update Polling and Loading State

### Goal

Use explicit job state in the UI.

### Work

- add a job status query surface
- update loading indicators to read `generationJob.status`
- keep message polling unless and until the product deliberately moves to streaming

### Deliverable

- cleaner and more truthful pending/running/error UX

## Phase 7: Remove Inngest

### Goal

Finish the orchestration cutover.

### Work

- remove `inngest`
- remove `@inngest/agent-kit`
- remove `/api/inngest`
- remove `src/inngest/*`
- remove old env usage

### Deliverable

- no Inngest dependency remains

## Phase 8: Daytona Preparation Pass

### Goal

Finish the isolation layer so sandbox replacement is cheap later.

### Work

- ensure all runtime code uses `SandboxAdapter`
- remove direct `E2B` assumptions from orchestration code
- make sandbox provider selection injectable

### Deliverable

- switching from `E2B` to `Daytona` later is a contained adapter migration

## Phase 9: Hardening and Cleanup

### Goal

Stabilize, document, and verify the new runtime.

### Work

- verify error and retry behavior
- verify job persistence
- verify workflow run correlation
- update docs and local setup instructions

### Deliverable

- production-ready Vercel runtime foundation with E2B still underneath
