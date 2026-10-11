---
name: InventarioSIS
description: Pastel bakery operations dashboard — dough-toned surfaces, stage-coded roles, amber reserved for action.
colors:
  masa: "#f6efe3"
  tarjeta: "#fffdf8"
  borde: "#e8dcc8"
  tinta: "#4a3b32"
  suave: "#756252"
  rosa: "#f2c9c2"
  pistacho: "#c9d9c5"
  melaza: "#e8d4c0"
  ambar: "#e8a87c"
  ambar-fuerte: "#d4845a"
  verde: "#4d7d5e"
  alerta: "#b85c4a"
  serie-a: "#f2c9c2"
  serie-b: "#e8d4c0"
  serie-c: "#c9d9c5"
typography:
  kpi:
    fontFamily: "Nunito, ui-rounded, Segoe UI, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tabular-nums"
  h1:
    fontFamily: "Nunito, ui-rounded, Segoe UI, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Nunito, ui-rounded, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Nunito, ui-rounded, Segoe UI, sans-serif"
    fontSize: "13.5px"
    fontWeight: 600
    lineHeight: 1.55
  label-mono:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  sm: "8px"
  xl: "12px"
  card: "16px"
  pill: "9999px"
  focus: "4px"
spacing:
  control-x: "14px"
  grid-gap: "16px"
  card: "20px"
  card-login: "28px"
  container-x: "16px"
components:
  card:
    backgroundColor: "{colors.tarjeta}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.card}"
    padding: "20px"
  button-primary:
    backgroundColor: "{colors.ambar}"
    textColor: "#3b2417"
    rounded: "{rounded.xl}"
    padding: "14px 20px"
    typography: "Nunito 800 15px"
  button-primary-hover:
    backgroundColor: "{colors.ambar-fuerte}"
  button-small:
    backgroundColor: "{colors.ambar}"
    textColor: "#3b2417"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
    typography: "Nunito 800 12px"
  nav-link-active:
    backgroundColor: "{colors.rosa}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    typography: "Nunito 600 14px"
  input:
    backgroundColor: "{colors.masa}"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "14px 16px"
    typography: "IBM Plex Mono 400 15px"
  stage-pill-done:
    backgroundColor: "{colors.pistacho}"
    textColor: "#33463a"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
    typography: "Nunito 700 12px"
  stage-pill-now:
    backgroundColor: "{colors.ambar}"
    textColor: "#3b2417"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
    typography: "Nunito 700 12px"
  stage-pill-next:
    backgroundColor: "{colors.melaza}"
    textColor: "#5c4a3d"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
    typography: "Nunito 700 12px"
  alert-stock:
    backgroundColor: "rgba(232, 168, 124, 0.15)"
    textColor: "{colors.tinta}"
    rounded: "{rounded.xl}"
    padding: "14px 16px"
    typography: "Nunito 700 13px"
  alert-ok:
    backgroundColor: "rgba(201, 217, 197, 0.25)"
    textColor: "#33463a"
    rounded: "{rounded.xl}"
    padding: "14px 16px"
    typography: "Nunito 700 13px"
---

# Design System: InventarioSIS

## Overview

**Creative North Star: "Masa Viva"** — the bakery as a living production line, not a spreadsheet.

Every surface is dough-toned: the page floor is raw masa, cards are flour-white sheets, and the three pastel stage colors (rosa, pistacho, melaza) encode what each number *means* in the bakery's day — sales, profit, cost. Time is dough: every temporal series rises like a fermentation curve, and the workday is a rail of stage pills (done → now → next). The system refuses the generic SaaS dashboard (light gray floor, corporate blue, interchangeable cards) on both aesthetic and product grounds: the owner is a baker, not an analyst, and the interface should feel like the counter of their shop.

Density is calm and generous: one accent family, one mono voice for machine labels, one rounded humanist face for everything else. The single saturated color in the entire system is oven amber, and it is spent only where the user can act or where the system is currently alive. Everything else is pastel or ink.

**When to extend:** add a new card by reusing `tarjeta` on `masa`, a 16px radius, a 1px `borde`, and at most one pastel role bar. Add a new chart series from `serie-a/b/c`. Add a new status by picking an existing stage role. **When not to extend:** do not invent a fifth saturated color, do not put a shadow under a card, do not set a page background other than `masa`, do not use amber for decoration.

**Key Characteristics:**

- Pastel stage roles: rosa = sales/income, pistacho = profit/good, melaza = cost; amber = action and aliveness only.
- Border-only elevation — depth comes from masa/tarjeta tone step plus a 1px border, never from shadows.
- Monumental tabular KPI figures (32px extrabold) under tiny uppercase mono labels.
- One motion family: soft rise, horizontal dough grow, slow live pulse; all disabled under reduced motion.
- Spanish UI copy with voseo forms, es-BO number formatting, ▲/▼ deltas.

## Colors

Frontmatter hexes are the light-mode canonical values; dark mode is a 1:1 role remap via `.dark` CSS custom properties (`src/app/globals.css`). Dark pastels lift in clarity; amber is the pivot that stays saturated in both modes.

### Surfaces & Ink (Neutral)

| Role | Light | Dark | Use |
|---|---|---|---|
| **masa** | `#f6efe3` | `#241f1c` | Page floor, input wells, scrollbar halo |
| **tarjeta** | `#fffdf8` | `#2e2823` | Cards, header, tooltips, chart tooltip |
| **borde** | `#e8dcc8` | `#423a32` | Card borders, dividers, chart grid/axis, icon-button rings, scrollbar thumb |
| **tinta** | `#4a3b32` | `#f0e6d8` | Primary text and figures |
| **suave** | `#756252` | `#b5a28e` | Secondary text, mono micro-labels, axis ticks, placeholders (80% opacity) |

### Stage Roles

| Role | Light | Dark | Meaning |
|---|---|---|---|
| **rosa** (fermentado) | `#f2c9c2` | `#e8a99e` | Ventas/ingresos: KPI ingresos bar, active nav pill, text selection, chart fill |
| **pistacho** | `#c9d9c5` | `#a8c4a4` | Ganancia/bien: KPI ganancia bar, "done" stage pills, healthy-stock state |
| **melaza** | `#e8d4c0` | `#c9ab88` | Costos: KPI costos bar, "next" stage pills, nav hover wash |

### Action & Signal

| Role | Light | Dark | Use |
|---|---|---|---|
| **ambar** | `#e8a87c` | `#e8a87c` (identical) | The only saturated color. Primary buttons, focus ring, caret, curve stroke, live dot, "now" pill, stock-alert accent, chart cursor |
| **ambar-fuerte** | `#d4845a` | `#f0b88e` | Hover/pressed of amber; brand wordmark "SIS". **Inverts in dark** (stronger = lighter) |
| **verde** | `#4d7d5e` | `#8fbd9e` | Positive delta numerals only (▲) |
| **alerta** | `#b85c4a` | `#e08a76` | Negative delta numerals (▼), error boxes, destructive hover (logout) |

### Chart Series

`serie-a` `#f2c9c2` / dark `#e8a99e` — primary area fill (mirrors rosa). `serie-b` `#e8d4c0` / dark `#c9ab88` — second series (mirrors melaza). `serie-c` `#c9d9c5` / dark `#a8c4a4` — third series (mirrors pistacho). Curve stroke is always `ambar`, never a series color.

### On-Ink Values (hardcoded, component-scoped)

Surfaces too light for `tinta` carry dedicated ink hexes; use these exact pairs, do not substitute `tinta`:

- On amber (`#e8a87c`): `#3b2417` light / `#2b1a10` dark.
- On pistacho (`#c9d9c5`): `#33463a` light / `#dff0e2` dark.
- On melaza text (stage "next"): `#5c4a3d` light / `suave` dark.
- DEMO badge text: `#8f4f2b` light / `ambar` dark.

### Named Rules

**The Amber Rule.** `ambar` is the only saturated color in the system and is spent exclusively on: things you can click, the keyboard focus ring, the text caret, the chart's live point and stroke, and the "now" stage. If a screen has more than ~3 amber elements, one of them is wrong.

**The Stage-Color Law.** rosa = ingresos, pistacho = ganancia, melaza = costos. These meanings are fixed system-wide; never reassign a pastel to a different semantic to "make a card pop."

**The One-Floor Rule.** Page backgrounds are always `masa`. Cards are always `tarjeta`. There is no third surface tone and no colored page background.

## Typography

**UI Font:** Nunito (via `next/font` as `--font-nunito`, fallback `ui-rounded, "Segoe UI", sans-serif`) — rounded humanist, weights 600–800 in practice.
**Mono Font:** IBM Plex Mono (`--font-plex-mono`, weights 500/600, fallback `ui-monospace, monospace`) — machine voice only.

**Character:** Nunito's roundness carries the bakery warmth; Plex Mono's rigidity marks anything the system computes (labels, license keys, axis ticks). The two never blend inside one text run.

### Hierarchy

- **KPI figure** (Nunito 800, 32px, leading-none, tracking −0.02em, `tabular-nums`): the monumental number. `Bs`/`USD` unit rides beside it at 15px/700 `suave`.
- **H1 page title** (800, 26px, tracking −0.02em): one per page. Login wordmark is the exception at 34px.
- **H2 card title** (800, 15px, tracking −0.01em): card/section headers.
- **Body / sub** (600–700, 12.5–15px, 1.55): descriptions, table cells (13.5px), helper lines, empty states.
- **Micro-label** (Plex Mono 600, 10–11px, uppercase, tracking 0.1–0.12em, `suave`): KPI labels, "Jornada de hoy" kicker, table headers. This is the *only* place uppercase lives.

### Named Rules

**The Mono Caps Rule.** Uppercase is reserved for Plex Mono micro-labels and the DEMO badge. Nunito never goes uppercase.

**The Tabular Rule.** Any number the user compares column-down or across states — KPI values, table units/revenues, axis ticks, license input — gets `.tnum` (`font-variant-numeric: tabular-nums`). The body default disables tnum globally (`"tnum" 0`); opt in per element.

**The Delta Rule.** Period-over-period change renders as `▲ 12,5%` / `▼ 3,2%` / `• 0,0%` (`deltaPct`), colored `verde` when up, `alerta` when down. Never a bare sign, never a colored pill.

## Layout

- **Container:** `max-w-6xl` (1152px) centered, `px-4` → `px-6` at `sm`. Main content `py-8`.
- **Header:** sticky, `h-16`, `border-b border-borde`, `bg-tarjeta/95` + `backdrop-blur-sm`, `z-40`.
- **Dashboard grid:** KPI row `grid-cols-1 → sm:grid-cols-2 → xl:grid-cols-4`, `gap-4`. Analysis row `lg:grid-cols-[1.55fr_1fr]` (curve | top products + alert), `gap-4`.
- **Mobile (<lg):** nav collapses to a hamburger sheet under the header; KPIs stack single-column (cards keep full padding and the 4px role bar); charts and tables stay full-bleed inside their cards.
- **Rhythm:** 4/8/12/16px base steps; grid gaps 16px; card padding 20px; control padding 14px; login card 28px. No 24px "marketing" whitespace inside the app.

## Elevation & Depth

**The Border-Only Rule.** No card, button, or input carries a `box-shadow`. Depth is a two-step tonal ladder — `masa` floor → `tarjeta` card — sealed by a 1px `borde` line. The only translucency device in the system is the sticky header's `bg-tarjeta/95` + `backdrop-blur-sm`. Focus is a *ring* (2px `ambar` outline, 2px offset, 4px radius), not elevation.

## Shapes

- **Cards & large surfaces:** 16px radius (Tailwind `rounded-2xl`) — KPI cards, chart/table sections, login card, error card.
- **Controls & alerts:** 12px (`rounded-xl`) — buttons, license input, stock/error alert boxes, mobile nav rows, chart tooltip (Recharts `borderRadius: 12`).
- **Small buttons:** 8px (`rounded-lg`) — "Ver inventario" inline CTA.
- **Pills & icon buttons:** fully round (`rounded-full`) — stage pills, nav links, DEMO badge, logout/theme/menu buttons (36×36px), chart live dot.
- **Role bars:** KPI cards carry a 4px (`w-1`) full-height pastel bar flush to the left edge, inside the card's `overflow-hidden` clip.

## Components

### KPI Card

The workhorse. 16px card, 20px padding, left 4px role bar in `rosa`|`melaza`|`pistacho`|`ambar` (ingresos/costos/ganancia/margen). Mono micro-label → 32px tnum figure (optional 15px unit) → 12.5px `suave` sub-line (USD equivalent, delta, or verdict copy). Enters with `rise-in`; siblings stagger by `animationDelay` 0/80/160/240ms.

### Stage Rail (signature)

Workday as production stages. Mono kicker "Jornada de hoy" + inline pills separated by `›` in `borde`. Pill states: **done** = `pistacho` bg + check icon; **now** = `ambar` bg + wheat icon; **next** = `melaza` bg + clock icon (dark: `melaza/40` + `suave` text). Pills are `rounded-full px-3 py-1.5`, 12px/700, Lucide icons at 12px. State derives from clock hour (≥19 = closed). `flex-wrap` on mobile.

### Dough Curve (signature)

Recharts `AreaChart`, 240px tall, wrapped in `dough-grow`. Fill = vertical gradient `serie-a` 0.95 → 0.16 opacity; stroke = `ambar` 2.5px; dots off except **LiveDot** on the last point: halo circle r=10 `ambar` @25% running `pulse-dot` (`transform-box: fill-box`) + core r=4.5 `ambar` with 2px `tarjeta` ring. Grid: horizontal only, `borde`. Axis ticks: 11px/600 `suave`. Tooltip: `tarjeta` bg, `borde` border, 12px radius, cursor line `ambar`. Container carries `role="img"` with a Spanish summary `aria-label`. Recharts animation 900ms.

### Tables

Header row: mono 10px uppercase `suave` labels, `border-b border-borde`, right-aligned numeric columns. Body rows 13.5px (600 name, 700 tnum revenue), separators `border-b border-borde/60`, last row borderless. Empty state: one `suave` sentence, no illustration.

### Alerts

- **Stock bajo (actionable):** `bg-ambar/15`, `border-ambar/50`, 12px radius; 32px `ambar` icon circle (on-ink `#3b2417`); bold first line + `suave` second; optional small amber CTA "Ver inventario".
- **Healthy (no items):** `bg-pistacho/25`, `border-pistacho/70`, pistacho on-ink text. No CTA.
- **Error:** `bg-alerta/10`, `border-alerta/40`, `alerta` text, `role="alert"`.

### Buttons

- **Primary:** `bg-ambar`, on-ink `#3b2417` (dark `#2b1a10`), 12px radius, 14–14.5px vertical padding, Nunito 800 15px, optional 16px leading icon. Hover → `ambar-fuerte`. Disabled → `opacity-45` + `cursor-not-allowed`.
- **Small CTA:** same colors, 8px radius, 12px/800.
- **Icon button:** 36px circle, `border-borde`, `suave` glyph; hover `border-ambar` + `ambar-fuerte` icon (destructive variant: `alerta`).
- **Amber is only rendered on a button when the button does something.** Decorative chips use pastels.

### Navigation

Pill links `rounded-full px-3.5 py-2`, 14px/600, Lucide icon 15px. Active: `bg-rosa text-tinta` + `aria-current="page"`. Idle: `suave`, hover `bg-melaza/50`. Mobile sheet: 12px-radius rows, same active/idle logic. Brand wordmark: Nunito 800 19px, "SIS" in `ambar-fuerte` (login adds a wavy `ambar-fuerte` underline, 6px offset).

### Input (license field)

`bg-masa` well inside a `tarjeta` card, `border-borde`, 12px radius, 14×16px padding, Plex Mono 15px `tracking-wider` + tnum (license keys are character-grid). Focus: `border-ambar`, no outline (global ring still applies elsewhere). Placeholder `suave` @80%.

### Browser Surfaces (global)

- **Selection:** `rosa` background, `tinta` text.
- **Caret:** `ambar` (`caret-color` on body).
- **Focus ring:** 2px solid `ambar`, 2px offset, 4px radius — every interactive element, no exceptions.
- **Scrollbar:** 10px, thin; thumb `borde`, 8px radius, 2px `masa` inner border; transparent track.

### Motion

Three keyframes in `globals.css`, one easing: `cubic-bezier(0.16, 1, 0.3, 1)`.

| Name | Spec | Where |
|---|---|---|
| `rise-in` | 0.55s, translateY(10px)→0 + fade, `both` | Every card/section/page block on mount; staggered via inline `animationDelay` (dashboard: 0→380ms in ~60–80ms steps) |
| `dough-grow` | 0.9s, scaleX(0.92)→1 from `left center` | Dough-curve container on mount |
| `pulse-dot` | 2.2s ease-in-out infinite, scale 1→1.45 + opacity 1→0.55, `transform-box: fill-box; transform-origin: center` | LiveDot halo on the chart |

Theme switch cross-fades body background/color at 0.35s ease. Interactive states use Tailwind `transition-colors`.

**Reduced-motion contract:** under `prefers-reduced-motion: reduce`, all three classes get `animation: none !important` and every `transition-duration` collapses to `0.01ms !important`. Final states are already correct (`both` fill / no transform needed), so nothing jumps or disappears. New animations must ship their own reduced-motion kill switch in the same block.

## Do's and Don'ts

### Do:

- **Do** build every card as `tarjeta` on `masa` with a 1px `borde` and 16px radius — the whole system is that one recipe.
- **Do** keep amber to actions, focus, caret, and the live chart point; measure a new screen by counting its amber elements.
- **Do** label every number group with a Plex Mono uppercase micro-label (10–11px, tracking ≥0.1em, `suave`).
- **Do** put `.tnum` on every comparable figure and format with `es-BO` (`bs()`, `usd()`, `pct()`, `deltaPct()` helpers).
- **Do** reuse stage roles for any new metric: rosa sales-side, pistacho good-side, melaza cost-side; new series come from `serie-a/b/c`.
- **Do** enter new page blocks with `rise-in` and stagger siblings ~60–80ms; keep total stagger under 400ms.
- **Do** write UI copy in Spanish with the shipped voseo voice ("Subí", "Conectá", "mirá") and honest empty/error sentences.

### Don't:

- **Don't** add `box-shadow` to cards, buttons, or inputs — the border-only rule is absolute.
- **Don't** introduce a new saturated hue, a dark "premium" card, or a colored page background.
- **Don't** set Nunito in uppercase, or Plex Mono for sentences/numbers-that-aren't-labels.
- **Don't** color a stage pill or role bar by taste — the rosa/pistacho/melaza meanings are fixed.
- **Don't** use amber text on pastel or masa surfaces for "emphasis"; use `tinta` or `suave`.
- **Don't** animate under reduced motion, and don't ship an infinite animation other than the live-dot pulse.
- **Don't** fabricate customers, testimonials, or decorative data — PRODUCT.md forbids invented evidence.

### Accessibility notes

- Global `:focus-visible` ring (2px `ambar`, 2px offset) is the floor; never remove it without replacement.
- Amber buttons use `#3b2417`/`#2b1a10` ink specifically for contrast on the light amber.
- Charts: `role="img"` + Spanish summary label; decorative bars/icons `aria-hidden`.
- Nav active state pairs color (`bg-rosa`) with `aria-current="page"`; stage pills pair color with icon + text.
- Errors use `role="alert"`; theme toggle and icon buttons carry Spanish `aria-label`s.
- Respect the reduced-motion contract for any new motion.

---

*Divergences from the direction contract (build wins): card radius shipped as Tailwind `rounded-2xl` = 16px, not the briefed 18px; dark `borde` shipped as `#423a32`, not the briefed `#3d362f`. On-ink hexes and the DEMO badge `#8f4f2b` are component-scoped literals, not global tokens.*
