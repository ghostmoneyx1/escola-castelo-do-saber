# Design System — Escola Castelo do Saber

## Filosofia
"Premium educacional" — Sofisticado como um SaaS de primeira linha, mas com a alma de uma escola.
Referências visuais: Linear, Vercel Dashboard, Notion — clean, espaçoso, tipografia forte.

## Tipografia
- **Headings:** DM Sans (bold, tracking-tight) — personalidade sem ser infantil
- **Body:** Inter (regular/medium) — legibilidade máxima
- **Escala:** 11px labels / 13px body-sm / 14px body / 16px subtitle / 20px h3 / 28px h2 / 36px h1
- **Regra:** Headings SEMPRE em `font-heading`. Nunca usar font-bold em body text — usar font-medium.

## Paleta de Cores

### Superfícies (hierarquia de profundidade)
- `--background`: #fafbfd (off-white quente, não azulado)
- `--surface`: #ffffff (cards)
- `--surface-elevated`: #ffffff com shadow
- `--muted`: #f4f5f7 (backgrounds neutros)

### Marca (Escola)
- `--primary`: #1e40af (azul profundo — confiança, não genérico)
- `--primary-hover`: #1e3a8a
- `--accent`: #d97706 (dourado âmbar — não amarelo berrante)
- `--accent-subtle`: #fef3c7

### Semântico
- `--success`: #059669 (emerald-600)
- `--warning`: #d97706 (amber-600)
- `--danger`: #dc2626 (red-600)

### Texto
- `--text-primary`: #111827 (quase preto)
- `--text-secondary`: #6b7280 (gray-500)
- `--text-tertiary`: #9ca3af (gray-400)

### Bordas
- `--border`: #e5e7eb (gray-200)
- `--border-subtle`: #f3f4f6 (gray-100)

## Sidebar
- Background: #0f172a (slate-900, profundo)
- Active item: pill com bg-white/10, borda left accent gold
- Hover: bg-white/5
- Tipografia: 13px medium, slate-400 → white on active

## Cards
- Background: white
- Border: 1px solid var(--border)
- Border-radius: 12px (0.75rem)
- Shadow: 0 1px 3px rgba(0,0,0,0.04) — sutil, quase imperceptível
- Padding: 24px
- SEM ring-1, SEM border-l-4, SEM gradient backgrounds

## Botões
### Primário
- bg: var(--primary) sólido (SEM gradiente)
- hover: var(--primary-hover)
- text: white, font-semibold (não bold)
- radius: 10px
- height: 40px padrão
- SEM shadow-lg, SEM scale transforms

### Secundário
- bg: white
- border: 1px solid var(--border)
- hover: var(--muted)

### Ghost
- bg: transparent
- hover: var(--muted)

## Tabelas
- Header: bg var(--muted), text 11px uppercase tracking-wide, font-semibold (não bold)
- Rows: hover bg var(--muted)/50
- Dividers: border-bottom var(--border-subtle)
- Cell padding: px-5 py-3.5

## Badges/Status
- Pill shape: rounded-full
- Font: 11px font-semibold (não bold, não uppercase berrante)
- Cores sutis: bg-color/10, text-color-700
- Dot indicator: 6px circle

## Spacing
- Page padding: px-8 py-6
- Section gap: 24px (gap-6)
- Card internal: 24px
- Between label and input: 6px

## Anti-patterns (NUNCA usar)
- ❌ bg-gradient-to-br em botões
- ❌ shadow-lg / shadow-xl em cards normais
- ❌ shadow-blue-500/20 (colored shadows)
- ❌ border-l-4 colored borders em cards
- ❌ ring-1 ring-gray-200/50 (redundante com border)
- ❌ text-[10px] ou text-[11px] hardcoded
- ❌ hover:scale-[1.02] em botões (gimmicky)
- ❌ active:scale-[0.98] (mobile feel em desktop app)
- ❌ Gradient blobs decorativos
- ❌ Uppercase tracking-widest em tudo
- ❌ bg-[#ecf5fb] hardcoded (usar tokens)
