# Session Log — Zoftware White-Label V2

Each session is tagged in git as `session/NN-slug`.

```bash
git checkout session/NN-slug     # detached HEAD at that snapshot
git checkout main                # return to latest
git diff session/01-theme2-enterprise HEAD   # diff sessions
```

---

## Session 01 — Theme 2 Enterprise Slate
**Tag:** `session/01-theme2-enterprise`
**Commit:** `4225635`
**Branch:** `theme-2`
**Date:** Jun 10, 2026

Full dual-theme design system built on top of all prior V2 work:

- **globals.css**: Changed `@theme inline` → `@theme` (Tailwind v4) so semantic utilities
  reference CSS variables at runtime, enabling live switching. Added Plus Jakarta Sans Google
  Font. Defined `:root` (Theme 1) and `[data-theme="2"]` (Theme 2 — Enterprise Slate) token
  sets: accent `#2563EB`, nav background `#0F172A`, page background `#F8FAFC`, Plus Jakarta
  Sans font, rounder border-radius scale, slate borders, subtle card elevation.
- **ThemeProvider.tsx**: Client component that reads `zw_theme` from localStorage on mount
  and sets `data-theme="2"` on `<html>`.
- **ThemeToggle.tsx**: Palette icon toggle button — switches Classic ↔ Enterprise, persists
  preference to localStorage.
- **GatewayHeader.tsx**: Migrated to `gw-header` / `gw-nav-*` CSS classes for CSS-variable-
  driven nav background/text, works dark in Theme 2. ThemeToggle injected.
- **Navbar.tsx**: ThemeToggle injected.
- **layout.tsx**: ThemeProvider wrapped around children.
- **Bulk class replacements across 19 files (~900 instances)**:
  - `bg/text/border/ring-[#007AFF]` → `bg/text/border/ring-accent`
  - `hover:bg/text-[#0051D5]` → `hover:bg/text-accent-hover`
  - `bg-[#f5f5f7]` → `bg-surface`, `text-[#86868b]` → `text-muted`
  - `accent-[#007AFF]` → `accent-accent`, inline gradients updated to CSS vars

Prior work in this codebase (earlier sessions before SESSIONS.md was created):

- V2 initial build: landing page, gateway, software catalog, bundles, checkout, profile panel
- Bundle product info expandable panels
- DataDirect logo removed, generic LOGO mark added
- UserProfilePanel redesign: removed overview tab, full-screen layout, CSM card prominent
- CSM deduplication (left sidebar only)
- All 6,000+ references updated to 50+
- Checkout fixes: broken inputs (Field component remount bug), step-by-1 licenses, bundles get
  license selector, Designation field

---

## Session 02 — Warm Studio Pixel-Perfect Audit
**Tag:** `session/02-warm-studio-fixes`
**Commit:** `acd6d33`
**Branch:** `theme-2`
**Date:** Jun 10, 2026

Complete Theme 2 redesign from dark Enterprise Slate → light Warm Studio, then a full pixel-
perfect audit pass fixing all visual regressions.

### Theme Redesign (dark → Warm Studio light)
- Rejected dark (#0D1117 near-black, violet) in favour of a warm cream / rose-crimson palette
  inspired by BordUp HR, Codename CRM, FundView reference screenshots
- **Warm Studio tokens**: accent `#DB3D5E` (rose-crimson), page bg `#F6F1EB` (cream),
  surface `#EDE6DF` (warm stone), muted `#9E8E84`, warm card shadows, Plus Jakarta Sans
- ThemeToggle: "Classic" vs "Warm Studio" labels + colour swatches; landing page shows full
  dropdown with `showLabel` prop; nav bars show compact Palette icon only

### UI Audit & Bug Fixes
- **Oval/circular feature cards**: Root cause: `[data-theme="2"] a.border { border-radius:
  100px }` was pill-shaping ALL anchor+border elements. Removed that broad rule; pill shape
  now targets only `.bg-accent` CTAs.
- **Blue hero gradient**: inline `style={{ background: '#f0f7ff...' }}` can't be overridden
  by CSS. Added class names `th-hero-section`, `th-hero-dots`, `th-hero-glow` to elements;
  CSS overrides in globals.css suppress glow divs and replace gradient with warm cream.
- **Software Gateway blue section**: added `th-section-warm` / `th-section-glow` classes;
  CSS overrides → warm gradient.
- **gatewayTools / stat colors**: JS object values `'#007AFF'` → `'var(--color-accent)'`
  so inline `style={{ color: tool.color }}` respects the CSS variable in Theme 2.
- **Checkout page**: bulk sed — `bg-[#eff6ff]`→`bg-accent/8`, `bg-blue-50`→`bg-accent/6`,
  `border-blue-100`→`border-accent/20`, `border-zinc-*`→`border-black/8|10`,
  `text-zinc-*`→`text-muted`, `bg-zinc-50`→`bg-surface`, `rounded-xl`→`rounded-lg`
- **globals.css CSS overrides** for `bg-[#eff6ff]`, `bg-blue-50`, `border-zinc-200/100`,
  `text-zinc-400`, `hover:bg-[#f8fbff]` / `hover:bg-[#f9fafb]` → warm equivalents

<!-- New sessions appended below -->
