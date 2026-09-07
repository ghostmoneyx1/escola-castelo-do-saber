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
    contratos/ documentos/ ferramentas/ financeiro/ frequencia/
    matriculas/ relatorios/ relatorios-trimestrais/ turmas/
  chamada/[classId]/       # attendance entry UI
  relatorio/[token]/       # PUBLIC report viewer — gated by token, not session
  mensalidades/            # PUBLIC tuition lookup for guardians (no session)
  api/
    chamada/[classId]/     # GET roster for class
    chamada/submit/        # POST attendance batch
    mensalidades/consulta/ # POST {nome, tel} → pending months + payment links
    relatorio/gerar-token/ # mints opaque token for parent access
    relatorio/submit/      # save quarterly report
```

The **token-gated public route** (`/relatorio/[token]` + `/api/relatorio/gerar-token`) is the only non-authenticated surface besides `/login` and `/mensalidades`. Tokens live in the `report_tokens` table. Any change here is a security-sensitive change — preserve token entropy, revocation, and expiry semantics.

### Consulta de Mensalidades (`/mensalidades`)

Public tool the school shares with guardians. Guardian types the child's name +
the last 4 digits of the responsible party's phone, and sees the open months with
an InfinitePay payment link per month.

**Its data does not live in Supabase.** `src/lib/mensalidades/sheet.js` reads the
school's "SISTEMA DE COBRANÇA" Google Sheet live, via its *Publish to web → CSV*
URL (`MENSALIDADES_SHEET_CSV_URL`, server-only), with a 60s in-process cache. The
sheet stays the source of truth — the secretariat keeps editing it as before.

Sheet layout the parser expects (header row auto-detected by the `ALUNO` column):
`ALUNO | RESPONSÁVEL | TELEFONE | SÉRIE | VALOR | JANEIRO … DEZEMBRO`. Each month
cell is `PAGO` (settled, hidden), a `https://…` payment link (open), `DEVE`
(overdue), `À VENCER` (upcoming, no link yet), or empty (never charged — skipped).

`/api/mensalidades/consulta` is rate-limited (20 hits / 5 min per IP) because it is
unauthenticated and returns children's names. It accepts either `{nome, tel}` (the
guardian types) or `{codigo}` (direct link the school sends ready-made).

**Direct link per student.** Each row gets a stable 12-hex `codigo` =
`HMAC-SHA256(MENSALIDADES_LINK_SECRET, normalizedName|digitsOnlyPhone)`, so
`/mensalidades?a=<codigo>` opens already loaded. HMAC (not a plain hash) so the code
cannot be derived from a name someone already knows. **Rotating
`MENSALIDADES_LINK_SECRET` invalidates every link already sent** — treat it as
long-lived. `buscarMensalidades`/`buscarPorCodigo` return a trimmed shape that never
includes `telefone`, `whatsapp` or `codigo`; only authenticated routes see those.

**Secretariat side.** `/dashboard/cobranca` (Server Component → `obterCobranca()`)
shows arrears totals, per-student open months, and a one-click **"Cobrar"** that opens
`wa.me` with the message from `src/lib/mensalidades/whatsapp.js` pre-filled. Phone
numbers in the sheet come in two shapes — 11 digits (fine) and 10 digits (old format,
missing the mobile `9`); `normalizarWhatsapp` inserts the `9` and flags the row as
`telefoneSuspeito` so the page can warn instead of silently messaging a wrong number.

**Student file.** `/dashboard/alunos/[id]` renders
`<SituacaoFinanceira nome={student.name} />`, which hits `/api/mensalidades/aluno`.
Supabase and the sheet were typed separately, so `casarAlunoDaPlanilha` matches
exact → substring → shared-surname suggestions, and the card says which case it hit
rather than implying "nothing owed" when the match simply failed.

`/api/mensalidades/qr` returns an SVG QR (authenticated) for the general link or for
one student's `?a=` link. `/dashboard/ferramentas` lists the public URL and the mural QR.

### Components

- `src/components/ui/*` — shadcn/ui primitives (jsx). Edit cautiously; many pages depend on these.
- `src/components/layout/*` — `sidebar.js`, `topbar.js`, `sidebar-context.js`. The sidebar is **dark slate (`#0f172a`)** with gold accent — see DESIGN_SYSTEM.md.
- `src/components/shared/*` — `page-header.js`, `empty-state.js`, `status-badge.js`. Reuse these instead of recreating headers/empty states per page.
- **Busca dentro de um `Select`.** Passe `<SelectSearch>` pela prop `header` do
  `SelectContent` — nunca coloque um `<Input>` entre os `SelectItem`. O `List` do
  Base UI é uma composite que trata typeahead e setas, então um input ali dentro
  recebe as teclas como navegação e a lista pula em vez de filtrar. Com `header`
  o campo fica fora da `List` e o popup passa a ancorar pela borda
  (`alignItemWithTrigger` desligado), senão o cabeçalho sai da tela.

### PDFs

`src/lib/pdf/*` renders quarterly reports and attestations using `@react-pdf/renderer`. These are server-rendered and streamed by the report routes. Keep PDF components out of Client Component trees.

- **Razão social nos documentos.** Header, footer e histórico usam `SCHOOL_LEGAL_NAME` ("Instituto de Educação e Cidadania Castelo do Saber"), exigência da secretaria após a mudança de razão social. `SCHOOL_NAME` ("Escola Castelo do Saber") continua sendo o nome fantasia da UI.
- **Unidade → CNPJ/endereço.** `units.name` no banco é "Boa Vista do Lobato" (matriz, CNPJ 0001-58) e "Alto do Cabrito" (filial, CNPJ 0002-39). `isFilialUnit()` em `header.js` detecta a filial por regex (`filial|cabrito`) — não compare com "Filial"/"Matriz".
- **Histórico Escolar** cabe em uma folha A4 por exigência da escola. Lista fixa de 6 matérias em `historico-data.js` (com aliases para casar com `subjects.name`), nota = média anual das unidades na coluna da série atual, CH em branco. Os traços do bloco "Certificado" (série e ano letivo) ficam vazios de propósito: a secretaria preenche à mão.
- **Tipos de documento** vivem em dois lugares: `DOCUMENT_TYPES` (constants.js) e o CHECK de `documents.type` no schema. Novo tipo exige os dois + um `case` em `generate.js`.
- Os arquivos do PDF são `.js` com JSX; o vitest só transforma `.jsx`. Para renderizar um PDF fora do Next (preview), use um config temporário com plugin `transformWithOxc(code, id, { lang: "jsx" })` para `src/**/*.js`.

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
- `SUPABASE_SERVICE_ROLE_KEY` — required only by `src/lib/supabase/admin.js` (token route, rate limiting, anything that bypasses RLS)
- `MENSALIDADES_SHEET_CSV_URL` — server-only. CSV export URL of the billing Google Sheet, consumed by `/api/mensalidades/consulta`. Without it that route returns 502; the rest of the app is unaffected.
- `MENSALIDADES_LINK_SECRET` — server-only HMAC key for the per-student direct links. Changing it invalidates every `/mensalidades?a=…` link already handed out.

The middleware degrades gracefully if env vars are missing (lets the request through unauthenticated), so missing env in dev shows as "no auth gate" rather than an explicit error — verify env when auth behaves unexpectedly.

## Server/Client Component split (RSC pattern)

When converting `/dashboard/*` list pages from full Client Components to
the Server Component pattern, follow what `dashboard/alunos` and
`dashboard/turmas` already do:

- **`page.js` is a Server Component.** It calls
  `await createClient()` from `@/lib/supabase/server`, fetches the
  initial data (and any aggregates that don't need interactivity), and
  returns a sibling `<FeatureClient initialX={...} />`. Add
  `export const dynamic = "force-dynamic"` so the cookies-aware Supabase
  client doesn't get accidentally cached.
- **The sibling `feature-client.jsx`** (`"use client"`) receives the
  prefetched data as a prop, owns all state (filters, search, dialogs),
  filters in memory when the dataset is small, and triggers
  `router.refresh()` inside `useTransition` after mutations so the
  Server Component re-fetches.
- **Mutations** (delete/insert/update) keep using the browser Supabase
  client for now. Move to API routes only if a mutation needs to
  bypass RLS or run server-only logic.
- **Charts (Recharts) and forms** stay in the Client Component — they
  rely on hooks and event handlers.
- **Forms-only pages** (`alunos/novo`, `contratos/novo`, etc.) and
  pages whose entire UI is a single interactive widget
  (`chamada/[classId]`) stay as full Client Components; there's no
  initial data to prefetch.

Pages still on the old pattern (full `"use client"` with `useEffect`
data fetch) — convert in this priority order: `dashboard/page.js`,
`boletins`, `financeiro`, `frequencia`, `documentos`, `matriculas`,
`relatorios`, `relatorios-trimestrais`, `contratos`, `colaboradores`,
`colaboradores/pagamentos`, and detail pages under `/[id]`.

## UI text language

Code (identifiers, routes, table names) is English. User-facing strings (page titles, labels, dashboards) are Portuguese (pt-BR). Maintain that split — do not translate identifiers into Portuguese, do not leave English text in views.
