# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Next dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Run production build
npm run lint     # ESLint (next lint, config: eslint-config-next)
```

No test suite exists. The project is **JavaScript** (jsx/js + `jsconfig.json`), not TypeScript — there is no `tsc` step.

Path alias: `@/*` → `./src/*`.

### Database & seed
- Schema lives in `supabase/schema.sql`. The repo has **no `supabase/migrations/` directory** — schema changes are applied via loose SQL files in the project root (`atualizacao-*.sql`, `migracao-*.sql`, `colaboradores-schema.sql`, `contratos-schema.sql`, `generate*.sql`, `update_enrollments.sql`, `importacao-pe-na-escola.sql`). When changing schema, add a new dated `.sql` file at root *and* update `supabase/schema.sql` so a fresh provision still works.
- Seed scripts: `seed.sql` (idempotent SQL seed) and `seed.mjs` (Node script using anon key — guarded by a count check so it won't double-insert). Both end with `ANALYZE` on all tables; **always re-run ANALYZE after bulk inserts** so `pg_class.reltuples` stays accurate (Supabase MCP `list_tables` reads from this and will otherwise report 0).
- Other root `.mjs` scripts (`parser.mjs`, `parse_fundamental.mjs`, `check_headers.mjs`, `execute_fund.mjs`, `test-app.mjs`) are one-off importers/parsers for the two `*.xlsx` files in root (real enrollment data — treat as sensitive).

## Architecture

**Stack:** Next.js 14.2.35 (App Router) · Supabase (DB + Auth via `@supabase/ssr`) · Tailwind v4 · shadcn/ui · `@react-pdf/renderer` · `recharts` · `xlsx` · `@anthropic-ai/sdk`. Deployed on Vercel.

### Supabase client matrix — pick the right one

| File | When to use | Notes |
|---|---|---|
| `src/lib/supabase/client.js` | Client Components (browser) | Anon key, RLS-bound |
| `src/lib/supabase/server.js` | Server Components, Route Handlers, Server Actions | Reads session from cookies via `next/headers` |
| `src/lib/supabase/middleware.js` + `src/middleware.js` | Edge auth gate | Refreshes session, redirects unauthenticated traffic to `/login` and authenticated traffic away from `/login`. Matcher excludes static assets. |
| `src/lib/supabase/admin.js` | **Server-only**, RLS bypass | Uses `SUPABASE_SERVICE_ROLE_KEY`. Never import from a Client Component. Use only when an action must transcend RLS (e.g. token-based public report routes). |

### RLS posture — important caveat

`supabase/schema.sql:179-189` applies a uniform policy on every table:
```sql
CREATE POLICY "Full access for authenticated users" ON <table> FOR ALL USING (auth.role() = 'authenticated');
```

This is **a session gate, not multi-tenant isolation.** Any logged-in user can read/write every row across all `units`. Treat the database as single-tenant in code, and do not introduce a feature that assumes per-unit isolation without first adding real `unit_id`-scoped policies. The `units` table exists in the schema, but enforcement is application-side only.

### Routes layout

```
src/app/
  (auth)/login/            # public auth UI, route group
  auth/signout/            # POST → clears session
  dashboard/               # protected admin area (middleware-enforced)
    alunos/ boletins/ colaboradores/ configuracoes/
    contratos/ documentos/ financeiro/ frequencia/
    matriculas/ relatorios/ relatorios-trimestrais/ turmas/
  chamada/[classId]/       # attendance entry UI
  relatorio/[token]/       # PUBLIC report viewer — gated by token, not session
  api/
    chamada/[classId]/     # GET roster for class
    chamada/submit/        # POST attendance batch
    relatorio/gerar-token/ # mints opaque token for parent access
    relatorio/submit/      # save quarterly report
```

The **token-gated public route** (`/relatorio/[token]` + `/api/relatorio/gerar-token`) is the only non-authenticated surface besides `/login`. Tokens live in the `report_tokens` table. Any change here is a security-sensitive change — preserve token entropy, revocation, and expiry semantics.

### Components

- `src/components/ui/*` — shadcn/ui primitives (jsx). Edit cautiously; many pages depend on these.
- `src/components/layout/*` — `sidebar.js`, `topbar.js`, `sidebar-context.js`. The sidebar is **dark slate (`#0f172a`)** with gold accent — see DESIGN_SYSTEM.md.
- `src/components/shared/*` — `page-header.js`, `empty-state.js`, `status-badge.js`. Reuse these instead of recreating headers/empty states per page.

### PDFs

`src/lib/pdf/*` renders quarterly reports and attestations using `@react-pdf/renderer`. These are server-rendered and streamed by the report routes. Keep PDF components out of Client Component trees.

## Design system — enforced

`DESIGN_SYSTEM.md` is **not aspirational**, it lists concrete tokens and an explicit anti-pattern list. Notable hard rules:

- Fonts: DM Sans for headings (`font-heading`), Inter for body. Never `font-bold` on body — use `font-medium`/`font-semibold`.
- Cards: white, 12px radius, 1px border, near-invisible shadow. **No `shadow-lg`, no `border-l-4` color stripes, no `ring-1`, no gradient backgrounds.**
- Buttons: solid `--primary` (`#1e40af`), 10px radius, 40px height. **No gradients, no `scale` transforms, no colored shadows.**
- Use CSS variables / tokens, not hardcoded hex (`#ecf5fb` style is banned).
- Tables: header `bg-muted`, 11px uppercase semibold, `px-5 py-3.5` cells.

When generating UI, consult `DESIGN_SYSTEM.md` and avoid the listed anti-patterns rather than producing generic shadcn defaults.

## Environment variables

Required in any environment that runs the app:

- `NEXT_PUBLIC_SUPABASE_URL` — used by all four Supabase clients
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — used by client/server/middleware clients
- `SUPABASE_SERVICE_ROLE_KEY` — required only by `src/lib/supabase/admin.js` (token route, anything that bypasses RLS)

The middleware degrades gracefully if env vars are missing (lets the request through unauthenticated), so missing env in dev shows as "no auth gate" rather than an explicit error — verify env when auth behaves unexpectedly.

## UI text language

Code (identifiers, routes, table names) is English. User-facing strings (page titles, labels, dashboards) are Portuguese (pt-BR). Maintain that split — do not translate identifiers into Portuguese, do not leave English text in views.
