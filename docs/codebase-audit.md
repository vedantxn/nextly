# Nextly — Codebase Audit

## What Nextly Is

Nextly is an AI-powered Next.js app generator. A user types a prompt, and an AI agent builds a complete Next.js app inside an E2B sandbox — writing files, running terminal commands, installing packages — then serves a live preview via iframe. Essentially a Lovable/Bolt competitor built solo.

---

## Architecture

### Frontend
- Next.js 15 (App Router) + React 19 + Tailwind v4 + tRPC v11
- Clerk for auth (middleware protects non-public routes)
- Split-panel project view — conversation on the left, live preview/code explorer on the right
- Resizable panels, tabs for Preview/Code, file explorer for generated code
- Theme support (light/dark) via `next-themes`
- Fonts: Geist Sans + Geist Mono
- Primary color: `#C96342` (set in Clerk config)

### Backend
- tRPC procedures: `projects`, `messages`, `usage`
- Prisma + Postgres (with Prisma Accelerate extension) for persistence
- Rate limiting via `rate-limiter-flexible` (RateLimiterPrisma)

### AI Pipeline
- Inngest background job (`code-agent/run`) triggers an agent built with `@inngest/agent-kit`
- The coding agent has 3 tools:
  - `terminal` — run shell commands in the sandbox
  - `createOrUpdateFiles` — write files to the sandbox
  - `readFiles` — read files from the sandbox
- Agent runs inside an E2B sandbox with a pre-built Next.js template
- Iterates up to 15 times (maxIter) until it produces a `<task_summary>`
- Two additional agents:
  - `fragment-title-generator` — generates a 3-word title
  - `response-generator` — generates a user-friendly 1-3 sentence response
- System prompt is detailed (~130 lines) with strict rules about file paths, Shadcn usage, Tailwind-only styling, no dev server restarts

### Models Available
- **Grok 4 Fast** (free) — `x-ai/grok-4-fast:free`
- **GPT-5 Codex** (pro) — `openai/gpt-5-codex`
- **Gemini 2.5 Flash** (pro) — `google/gemini-2.5-flash`
- All routed through an OpenRouter-style base URL (`OPENAI_API_BASE`)
- Fallback model: `openai/gpt-oss-120b:free`

### Sandbox (E2B)
- Template: `vedant-lovable-test-1` (ID: `lwltsannu9hu8y6qaqv0`)
- Base: Node 21-slim, Next.js 15.3.3, all shadcn components pre-installed
- Dev server auto-starts on port 3000 via `compile_page.sh`
- Sandbox timeout: 30 minutes (`60_000 * 10 * 3`)

---

## Database Schema

```
Project: id, name (random slug), userId, createdAt, updatedAt, messages[]
Message: id, content, role (USER/ASSISTANT), type (RESULT/ERROR), projectId, fragment?
Fragment: id, messageId (unique), sandboxUrl, title, files (JSON blob)
Usage: key (userId), points, expire
```

---

## Pages

| Route | Description |
|---|---|
| `/` (home) | Prompt form + projects list (signed in) OR marketing sections (signed out) |
| `/projects/[projectId]` | Main workspace — resizable split: messages left, preview/code right |
| `/projects` | All projects list |
| `/pricing` | Free vs Pro plan comparison |
| `/guide` | Usage guide |
| `/about` | About page |
| `/showcase` | Showcase page |
| `/careers` | Careers page |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |

---

## Key Files

| File | Purpose |
|---|---|
| `src/inngest/functions.ts` | Core AI agent pipeline — sandbox creation, agent execution, result saving |
| `src/prompt.ts` | All system prompts (coding agent, response generator, title generator, enhance) |
| `src/modules/projects/server/procedures.ts` | Project CRUD + triggers Inngest job |
| `src/modules/messages/server/procedures.ts` | Message CRUD + triggers Inngest job for follow-ups |
| `src/modules/projects/ui/views/project-view.tsx` | Main workspace UI (split panels, tabs, preview/code) |
| `src/modules/home/ui/components/project-form.tsx` | Homepage prompt input with model selector |
| `src/modules/projects/ui/components/message-form.tsx` | In-project message input with model selector |
| `src/modules/projects/ui/components/messages-container.tsx` | Message list with 5s polling |
| `src/modules/projects/ui/components/fragment-web.tsx` | Iframe preview of sandbox |
| `src/modules/projects/ui/components/message-card.tsx` | User/assistant message rendering |
| `src/modules/home/ui/components/navbar.tsx` | Main navigation bar |
| `src/lib/usage.ts` | Rate limiting logic |
| `src/lib/db.ts` | Prisma client singleton |
| `src/middleware.ts` | Clerk auth middleware |
| `sandbox-templates/nextjs/e2b.Dockerfile` | E2B sandbox template definition |

---

## Things Noticed (Facts Only)

- `package.json` name is `lovable-clone`, Inngest client ID is `lovable-clone`
- E2B Dockerfile has a duplicated `FROM node:21-slim` block
- Projects list hardcodes "Vedant's Projects" instead of using the user's name
- Delete/Edit project actions are commented out (non-functional)
- Pro plan checkout button says "Coming Soon" (disabled)
- Usage gives both free and pro users 100 points (same `FREE_POINTS` and `PRO_POINTS` = 100)
- Some typos in code: `exsitingProject`, `autheticatd`, `angent`
- `GlassEffect` component is duplicated in both `project-form.tsx` and `message-form.tsx`
- Model selector dropdown logic is duplicated in both form components
- Homepage comparison slider uses external image from `framerusercontent.com`
- `features-bento.tsx` uses inline `<style>` tags for CSS animations instead of Tailwind
- `message-form.tsx` uses `<style jsx global>` for scrollbar styling
- The `docs/` folder is untracked (in git status)
- No tests exist in the project
- ESLint is set to `ignoreDuringBuilds: true`
