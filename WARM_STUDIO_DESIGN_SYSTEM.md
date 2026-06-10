# Warm Studio — Design System Reference
**Theme 2 · Zoftware White-Label Platform**

Use this document to replicate the Warm Studio theme exactly across any dashboard, admin panel, or product tool. Every token, rule, and component decision is captured here.

---

## 1. Design Language

| Attribute | Classic (Theme 1) | Warm Studio (Theme 2) |
|---|---|---|
| Personality | Clean · Corporate · Apple-inspired | Warm · Editorial · Premium SaaS |
| Page canvas | Pure white `#FFFFFF` | Warm cream `#F6F1EB` |
| Cards | Flat, borderless | White elevated cards on cream |
| Accent | iOS Blue `#007AFF` | Rose-crimson `#DB3D5E` |
| Font | SF Pro / System UI | Plus Jakarta Sans |
| Buttons | Rounded rectangle | Full pill shape |
| Shadows | None | Warm amber-tinted elevation |
| Borders | `rgba(0,0,0,0.08)` transparent | `#E8E0D8` warm stone |

---

## 2. Activation

Theme 2 is triggered by setting `data-theme="2"` on the `<html>` element.

```js
// Enable Warm Studio
document.documentElement.setAttribute('data-theme', '2');

// Revert to Classic
document.documentElement.removeAttribute('data-theme');

// Persist to localStorage
localStorage.setItem('zw_theme', '2');
```

On page load, read the saved preference:
```js
const saved = localStorage.getItem('zw_theme') ?? '1';
if (saved === '2') document.documentElement.setAttribute('data-theme', '2');
```

---

## 3. CSS Variables — Complete Token Set

Paste into your root stylesheet. Theme 1 tokens go on `:root`, Theme 2 tokens go on `[data-theme="2"]`.

```css
/* ── Semantic tokens (Tailwind @theme or CSS custom properties) ── */
@theme {
  --color-accent:        #007AFF;
  --color-accent-hover:  #0051D5;
  --color-surface:       #f5f5f7;
  --color-surface-hover: #e5e5e7;
  --color-muted:         #86868b;
  --color-border:        rgba(0,0,0,0.08);
}

/* ── THEME 1 — Classic ── */
:root {
  --color-accent:         #007AFF;
  --color-accent-hover:   #0051D5;
  --color-surface:        #f5f5f7;
  --color-surface-hover:  #e5e5e7;
  --color-muted:          #86868b;
  --color-border:         rgba(0,0,0,0.08);
  --th-page-bg:           #ffffff;
  --th-body-color:        #000000;
  --th-card-bg:           #ffffff;
  --th-card-border:       rgba(0,0,0,0.08);
  --th-card-shadow:       none;
  --th-input-bg:          #f5f5f7;
  --th-input-border:      rgba(0,0,0,0.08);
  --th-nav-bg:            rgba(255,255,255,0.95);
  --th-nav-border:        rgba(0,0,0,0.06);
  --th-nav-text:          #000000;
  --th-nav-text-muted:    #86868b;
  --th-nav-hover-bg:      #f5f5f7;
  --th-nav-hover-text:    #000000;
  --th-font:              -apple-system, BlinkMacSystemFont, 'SF Pro Display',
                          'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
}

/* ── THEME 2 — Warm Studio ── */
[data-theme="2"] {
  --color-accent:         #DB3D5E;
  --color-accent-hover:   #C22E4F;
  --color-surface:        #EDE6DF;
  --color-surface-hover:  #E1D9D0;
  --color-muted:          #9E8E84;
  --color-border:         #E2D9D0;
  --th-page-bg:           #F6F1EB;
  --th-body-color:        #1A130C;
  --th-card-bg:           #FFFFFF;
  --th-card-border:       #E8E0D8;
  --th-card-shadow:       0 1px 2px rgba(60,30,10,0.04),
                          0 4px 16px rgba(60,30,10,0.07);
  --th-input-bg:          #FAF7F4;
  --th-input-border:      #D8CEC4;
  --th-nav-bg:            #FFFFFF;
  --th-nav-border:        #E2D9D0;
  --th-nav-text:          #1A130C;
  --th-nav-text-muted:    #9E8E84;
  --th-nav-hover-bg:      #F6F1EB;
  --th-nav-hover-text:    #1A130C;
  --th-font:              'Plus Jakarta Sans', -apple-system,
                          BlinkMacSystemFont, sans-serif;
}
```

---

## 4. Colour Palette

### Primary / Accent
| Role | Theme 1 | Theme 2 |
|---|---|---|
| Accent (primary CTA, links, active states) | `#007AFF` | `#DB3D5E` |
| Accent Hover | `#0051D5` | `#C22E4F` |
| Accent tint 6% (light bg) | `rgba(0,122,255,0.06)` | `color-mix(in oklch, #DB3D5E 6%, white)` |
| Accent tint 10% | `rgba(0,122,255,0.10)` | `color-mix(in oklch, #DB3D5E 10%, white)` |
| Accent border tint | `rgba(0,122,255,0.20)` | `color-mix(in oklch, #DB3D5E 28%, transparent)` |

### Page & Surfaces
| Role | Theme 1 | Theme 2 |
|---|---|---|
| Page background | `#FFFFFF` | `#F6F1EB` |
| Card background | `#FFFFFF` | `#FFFFFF` |
| Surface (secondary bg, inputs) | `#F5F5F7` | `#EDE6DF` |
| Surface hover | `#E5E5E7` | `#E1D9D0` |
| Warm off-white (section panels) | `#F9FAFB` | `#FAF7F4` |

### Text
| Role | Theme 1 | Theme 2 |
|---|---|---|
| Primary body text | `#000000` | `#1A130C` |
| Secondary / `#333` | `#333333` | `#2C2016` |
| Tertiary / `#444` | `#444444` | `#4A3928` |
| Muted / `#555` | `#555555` | `#6B5644` |
| Muted label / `#86868b` | `#86868B` | `#9E8E84` |

### Borders
| Role | Theme 1 | Theme 2 |
|---|---|---|
| Default border | `rgba(0,0,0,0.08)` | `#E8E0D8` |
| Subtle divider | `rgba(0,0,0,0.05)` | `#E8E0D8` |
| Input border | `rgba(0,0,0,0.08)` | `#D8CEC4` |
| Zinc-100 | `#F4F4F5` | `#E2D9D0` |
| Zinc-200 | `#E4E4E7` | `#E2D9D0` |

### Semantic Colours (same in both themes)
| Role | Value |
|---|---|
| Success green | `#16A34A` |
| Success bg | `#DCFCE7` |
| Warning amber | `#D97706` |
| Warning bg | `#FEF3C7` |
| Error / destructive | `#EA580C` |
| WhatsApp | `#25D366` |

---

## 5. Typography

### Font
```css
/* Load via Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

/* Apply via CSS variable (auto-switches with theme) */
body { font-family: var(--th-font); }
```

### Type Scale (used across platform)
| Token | Size | Weight | Use |
|---|---|---|---|
| Display | `36–48px` | `500–600` | Page hero headings |
| Heading 1 | `28px` | `600` | Section headings |
| Heading 2 | `22–26px` | `600` | Card headings |
| Heading 3 | `20px` | `600` | Sub-section |
| Heading 4 | `16–18px` | `600` | Card titles |
| Body large | `14px` | `400` | Primary body copy |
| Body | `13px` | `400` | Secondary copy |
| Label | `12px` | `500–600` | Metadata, tags |
| Caption | `11px` | `400–500` | Timestamps, footnotes |
| Micro | `10px` | `600–700` | Badges, uppercase labels |
| Nano | `9–10px` | `700` | Pill badges |

### Letter Spacing
| Context | Tracking |
|---|---|
| Display / H1 headings | `-0.02em` |
| Body text | Default (`0`) |
| Uppercase labels (10–11px) | `+0.08em` to `+0.12em` |
| CTA buttons in Theme 2 | `-0.01em` |

### Weight Rules — Theme 2
- `font-semibold` renders at `font-weight: 700` (boosted from 600)
- Headings use `letter-spacing: -0.02em` automatically
- Body text stays at `400` for readability on cream

---

## 6. Border Radius Scale

| Class | Theme 1 | Theme 2 |
|---|---|---|
| `rounded-sm` | 6px | **10px** |
| `rounded` / `rounded-md` | 8px | **12px** |
| `rounded-lg` | 12px | **16px** |
| `rounded-xl` | 16px | **20px** |
| `rounded-2xl` | 20px | **24px** |
| `rounded-full` | 9999px | 9999px |
| Primary CTA button | 6px | **100px (full pill)** |

> **Rule:** In Warm Studio, every surface is more rounded. Cards go from `rounded-sm` (6px) to 10px. Primary CTA buttons are always full pill (`100px`). Never use sharp corners on interactive elements.

---

## 7. Shadows & Elevation

### Theme 2 Card Shadow
```css
box-shadow: 0 1px 2px rgba(60,30,10,0.04),
            0 4px 16px rgba(60,30,10,0.07);
```
This uses warm amber-brown tones in the shadow (not neutral gray) so the elevation feels consistent with the cream canvas.

### Primary CTA Button Shadow
```css
/* Resting */
box-shadow: 0 2px 8px color-mix(in oklch, #DB3D5E 30%, transparent);

/* Hover (lifts 1px) */
box-shadow: 0 4px 16px color-mix(in oklch, #DB3D5E 40%, transparent);
transform: translateY(-1px);
```

### Nav Bar
```css
background: #FFFFFF;          /* solid white — contrasts against cream page */
border-bottom: 1px solid #E2D9D0;
```

### Input Focus Ring
```css
border-color: #DB3D5E;
box-shadow: 0 0 0 3px color-mix(in oklch, #DB3D5E 15%, transparent);
```

---

## 8. Component Specifications

### 8.1 Primary CTA Button
```css
/* Warm Studio */
background-color: #DB3D5E;
color: #FFFFFF;
border-radius: 100px;          /* full pill */
font-weight: 600;
font-size: 13–14px;
letter-spacing: -0.01em;
padding: 10px 20px;            /* py-2.5 px-5 */
min-height: 44px;              /* touch target */
box-shadow: 0 2px 8px rgba(219,61,94,0.30);
transition: all 0.15s ease;

/* Hover */
background-color: #C22E4F;
box-shadow: 0 4px 16px rgba(219,61,94,0.40);
transform: translateY(-1px);
```

### 8.2 Secondary / Outline Button
```css
background: transparent;
border: 1px solid #E8E0D8;
color: #1A130C;
border-radius: 10px;           /* rounded-sm in Theme 2 */
padding: 10px 20px;
font-weight: 600;
transition: background 0.15s;

/* Hover */
background: #EDE6DF;           /* bg-surface */
border-color: #D0C5BB;
```

### 8.3 Cards
```css
background: #FFFFFF;
border: 1px solid #E8E0D8;
border-radius: 10px;           /* rounded-sm → 10px in Theme 2 */
box-shadow: 0 1px 2px rgba(60,30,10,0.04),
            0 4px 16px rgba(60,30,10,0.07);
padding: 20–24px;
```
> Cards are always pure white. They lift visually from the `#F6F1EB` cream canvas through the warm shadow.

### 8.4 Inputs & Form Fields
```css
background: #FAF7F4;           /* slightly warm white */
border: 1px solid #D8CEC4;
border-radius: 10px;
color: #1A130C;
font-size: 14px;
padding: 10px 14px;
min-height: 44px;

/* Placeholder */
color: #9E8E84;

/* Focus */
background: #FFFFFF;
border-color: #DB3D5E;
box-shadow: 0 0 0 3px rgba(219,61,94,0.15);
outline: none;
```

### 8.5 Navigation Bar
```css
background: #FFFFFF;           /* always white — contrasts the cream page */
border-bottom: 1px solid #E2D9D0;
backdrop-filter: blur(16px);   /* optional — for translucent effect */

/* Nav link — default */
color: #9E8E84;
font-size: 13px;
font-weight: 500;
transition: color 0.15s, background 0.15s;

/* Nav link — hover */
color: #1A130C;
background: #F6F1EB;
border-radius: 8px;

/* Nav link — active/accent */
color: #DB3D5E;
border-color: rgba(219,61,94,0.28);
```

### 8.6 Badges & Pills
```css
/* Accent badge (solid) */
background: #DB3D5E;
color: #FFFFFF;
border-radius: 9999px;
font-size: 10px;
font-weight: 700;
padding: 2px 8px;

/* Accent tint badge */
background: color-mix(in oklch, #DB3D5E 10%, white);
color: #DB3D5E;
border: 1px solid color-mix(in oklch, #DB3D5E 28%, transparent);
border-radius: 9999px;

/* Success badge */
background: #DCFCE7;
color: #16A34A;
border-radius: 9999px;

/* Warning badge */
background: #FEF3C7;
color: #D97706;
border-radius: 9999px;
```

### 8.7 Tab / Segment Controls
```css
/* Tab bar container */
border-bottom: 1px solid #E8E0D8;
background: #FFFFFF;

/* Active tab */
border-bottom: 2px solid #DB3D5E;
color: #DB3D5E;
font-weight: 700;

/* Inactive tab */
color: #9E8E84;
border-bottom: 2px solid transparent;
transition: color 0.15s;

/* Inactive hover */
color: #1A130C;
```

### 8.8 Checkboxes & Feature Lists
```css
/* Feature check icon (NOT solid accent bg — too heavy) */
width: 16–20px;
height: 16–20px;
border-radius: 4–6px;
background: #FFFFFF;
border: 1px solid rgba(0,0,0,0.10);

/* Check mark inside */
color: #DB3D5E;   /* accent colour, not white */
stroke-width: 2.5;
```
> Never use a solid accent-coloured square as a feature check icon. The density of repeated accent-filled boxes overwhelms the warm palette. Use a white box with an accent check mark instead.

### 8.9 Section Backgrounds
| Section type | Background |
|---|---|
| Hero / top section | `linear-gradient(160deg, #FAF5EF 0%, #F6F1EB 60%, #F6F1EB 100%)` |
| Alternate section (soft) | `linear-gradient(180deg, #FAF5EF 0%, #F6F1EB 100%)` |
| Stats / surface section | `#EDE6DF` (warm stone) |
| White section | `#FFFFFF` (explicit) |
| Page canvas (body) | `#F6F1EB` |

### 8.10 Success Manager / Feature Gradient Cards
```css
/* Deep accent gradient card (e.g. CSM card) */
background: linear-gradient(160deg, #DB3D5E 0%, #C22E4F 100%);
color: #FFFFFF;

/* Contact text on gradient */
color: rgba(255,255,255,0.75);

/* Icon on gradient bg */
background: rgba(255,255,255,0.20);
border-radius: 50%;

/* CTA button on gradient — Email */
background: #FFFFFF;
color: #DB3D5E;
border-radius: 10px;

/* CTA button on gradient — WhatsApp */
background: #25D366;
color: #FFFFFF;
border-radius: 10px;
```

---

## 9. Bundle / Product Tier Colours

Used for card headers, CTA buttons, and highlight pills within product bundles:

| Tier | Colour | Hex |
|---|---|---|
| Starter (1–10 employees) | Sky blue | `#0284C7` |
| Growth (10–50 employees) | Violet | `#7C3AED` |
| Expansion (50+ employees) | Deep teal | `#0F766E` |

These colours are used directly as `bundle.color` in JSX inline styles. They are intentional, not theme-overridden — they work harmoniously on both white and cream backgrounds.

---

## 10. Scrollbar

```css
/* Custom warm scrollbar (Theme 2 only) */
::-webkit-scrollbar        { width: 5px; height: 5px; }
::-webkit-scrollbar-track  { background: #F0E9E1; }
::-webkit-scrollbar-thumb  { background: #C9BAB0; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #DB3D5E; }
```

---

## 11. Animation & Motion

| Property | Value |
|---|---|
| CTA hover lift | `transform: translateY(-1px)` |
| Transition duration | `150ms` micro, `250ms` panels/modals |
| Easing | `ease` (default), `cubic-bezier(0.16,1,0.3,1)` for panel entrances |
| Page/panel entrance | `opacity 0→1, translateY(8px)→0, scale(0.98)→1` |
| Theme switch | `background-color 0.25s ease, color 0.25s ease` on `body` |

---

## 12. Implementation: Full CSS Override Block

Copy this entire block into any product's stylesheet to get Warm Studio support. It targets Tailwind utility classes so no component rewrites are needed.

```css
/* ── Body ── */
body {
  font-family: var(--th-font);
  background-color: var(--th-page-bg);
  color: var(--th-body-color);
  transition: background-color 0.25s ease, color 0.25s ease;
}

/* ── Page canvas ── */
[data-theme="2"] .min-h-screen:not(.bg-white),
[data-theme="2"] .min-h-full:not(.bg-white) {
  background-color: var(--th-page-bg) !important;
}

/* ── Text warm shift ── */
[data-theme="2"] .text-black            { color: #1A130C !important; }
[data-theme="2"] .hover\:text-black:hover { color: #1A130C !important; }
[data-theme="2"] .text-\[#333\]         { color: #2C2016 !important; }
[data-theme="2"] .text-\[#555\]         { color: #6B5644 !important; }

/* ── Borders → warm stone ── */
[data-theme="2"] .border-black\/5,
[data-theme="2"] .border-black\/8,
[data-theme="2"] .border-black\/10,
[data-theme="2"] .border-black\/12,
[data-theme="2"] .border-black\/20  { border-color: var(--th-card-border) !important; }

/* ── All bordered elements get warm shadow ── */
[data-theme="2"] .border {
  border-color: var(--th-card-border) !important;
  box-shadow: var(--th-card-shadow) !important;
}

/* ── Surface (secondary backgrounds) ── */
[data-theme="2"] .bg-surface              { background-color: var(--color-surface) !important; }
[data-theme="2"] .hover\:bg-surface:hover { background-color: var(--color-surface-hover) !important; }

/* ── Inputs ── */
[data-theme="2"] input:not([type="checkbox"]):not([type="radio"]),
[data-theme="2"] textarea,
[data-theme="2"] select {
  background-color: var(--th-input-bg) !important;
  border-color: var(--th-input-border) !important;
  color: #1A130C !important;
}
[data-theme="2"] input::placeholder,
[data-theme="2"] textarea::placeholder { color: var(--color-muted) !important; }
[data-theme="2"] input:focus,
[data-theme="2"] textarea:focus,
[data-theme="2"] select:focus {
  background-color: #FFFFFF !important;
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-accent) 15%, transparent) !important;
  outline: none;
}

/* ── Primary CTA — pill shape ── */
[data-theme="2"] .bg-accent {
  border-radius: 100px !important;
  font-weight: 600 !important;
  letter-spacing: -0.01em !important;
  box-shadow: 0 2px 8px color-mix(in oklch, var(--color-accent) 30%, transparent) !important;
}
[data-theme="2"] .bg-accent:hover,
[data-theme="2"] .hover\:bg-accent-hover:hover {
  box-shadow: 0 4px 16px color-mix(in oklch, var(--color-accent) 40%, transparent) !important;
  transform: translateY(-1px);
}

/* ── bg-black CTAs → accent ── */
[data-theme="2"] a.bg-black,
[data-theme="2"] button.bg-black {
  background-color: var(--color-accent) !important;
  border-radius: 100px !important;
  box-shadow: 0 2px 8px color-mix(in oklch, var(--color-accent) 30%, transparent) !important;
}

/* ── Border radius scale ── */
[data-theme="2"] .rounded-sm  { border-radius: 10px !important; }
[data-theme="2"] .rounded,
[data-theme="2"] .rounded-md  { border-radius: 12px !important; }
[data-theme="2"] .rounded-lg  { border-radius: 16px !important; }
[data-theme="2"] .rounded-xl  { border-radius: 20px !important; }
[data-theme="2"] .rounded-2xl { border-radius: 24px !important; }

/* ── Typography ── */
[data-theme="2"] h1, [data-theme="2"] h2,
[data-theme="2"] h3, [data-theme="2"] h4 {
  font-family: var(--th-font);
  letter-spacing: -0.02em;
}
[data-theme="2"] .font-semibold { font-weight: 700 !important; }

/* ── Accent text & tints ── */
[data-theme="2"] .text-accent  { color: var(--color-accent) !important; }
[data-theme="2"] .hover\:text-accent-hover:hover { color: var(--color-accent-hover) !important; }
[data-theme="2"] .bg-accent\/5, [data-theme="2"] .bg-accent\/6,
[data-theme="2"] .bg-accent\/8, [data-theme="2"] .bg-accent\/10,
[data-theme="2"] .bg-accent\/12 {
  background-color: color-mix(in oklch, var(--color-accent) 10%, white) !important;
}
[data-theme="2"] .border-accent\/15, [data-theme="2"] .border-accent\/20,
[data-theme="2"] .border-accent\/25, [data-theme="2"] .border-accent\/30,
[data-theme="2"] .border-accent\/40 {
  border-color: color-mix(in oklch, var(--color-accent) 28%, transparent) !important;
}

/* ── Hover white text (group-hover) ── */
[data-theme="2"] .group:hover .group-hover\:text-white { color: #ffffff !important; }
[data-theme="2"] .hover\:text-white:hover              { color: #ffffff !important; }

/* ── Zinc / cool-gray → warm stone ── */
[data-theme="2"] .border-zinc-100,
[data-theme="2"] .border-zinc-200  { border-color: #E2D9D0 !important; }
[data-theme="2"] .text-zinc-400    { color: #9E8E84 !important; }
[data-theme="2"] .bg-zinc-50,
[data-theme="2"] .hover\:bg-zinc-50:hover { background-color: #F6F1EB !important; }

/* ── Blue-tinted states → warm rose tints ── */
[data-theme="2"] .bg-\[\#eff6ff\]  { background-color: color-mix(in oklch, var(--color-accent) 8%, white) !important; }
[data-theme="2"] .bg-blue-50        { background-color: color-mix(in oklch, var(--color-accent) 6%, white) !important; }
[data-theme="2"] .border-blue-100   { border-color: color-mix(in oklch, var(--color-accent) 20%, transparent) !important; }
[data-theme="2"] .text-blue-700     { color: var(--color-accent) !important; }
[data-theme="2"] .bg-\[\#f8faff\]   { background-color: var(--color-surface) !important; }
[data-theme="2"] .bg-\[\#f9fafb\],
[data-theme="2"] .bg-gray-50        { background-color: #FAF7F4 !important; }

/* ── Hover states ── */
[data-theme="2"] .hover\:bg-\[\#f8fbff\]:hover,
[data-theme="2"] .hover\:bg-\[\#f9fafb\]:hover { background-color: #F0EAE2 !important; }

/* ── Scrollbar ── */
[data-theme="2"] ::-webkit-scrollbar        { width: 5px; height: 5px; }
[data-theme="2"] ::-webkit-scrollbar-track  { background: #F0E9E1; }
[data-theme="2"] ::-webkit-scrollbar-thumb  { background: #C9BAB0; border-radius: 3px; }
[data-theme="2"] ::-webkit-scrollbar-thumb:hover { background: var(--color-accent); }
```

---

## 13. Writing Semantic Classes (avoid hardcoded hex)

When building new components, use these semantic utilities so they automatically adapt to the active theme:

| Instead of… | Use… |
|---|---|
| `bg-[#007AFF]` or `bg-[#DB3D5E]` | `bg-accent` |
| `hover:bg-[#0051D5]` | `hover:bg-accent-hover` |
| `text-[#007AFF]` | `text-accent` |
| `bg-[#f5f5f7]` | `bg-surface` |
| `text-[#86868b]` | `text-muted` |
| `border-[rgba(0,0,0,0.08)]` | `border-black/8` |
| Inline `style={{ color: '#007AFF' }}` | Inline `style={{ color: 'var(--color-accent)' }}` |
| Inline `style={{ background: '...' }}` | Add CSS class + override in globals |

> **Critical:** CSS cannot override inline `style={{}}` attributes. If a component sets a color via inline style, you must change the value to `'var(--color-accent)'` — a CSS class override will not work on inline styles.

---

## 14. Do's and Don'ts

### ✅ Do
- White cards (`#FFFFFF`) on cream page (`#F6F1EB`) — this contrast is the visual signature
- Full pill buttons (`border-radius: 100px`) for all primary CTAs
- Plus Jakarta Sans at 700 for headings and semibold labels
- Warm amber-tinted shadows: `rgba(60,30,10,0.07)` not neutral grays
- Large border radii: 10px minimum on all interactive surfaces
- Warm stone borders `#E8E0D8` instead of transparent black
- Rose-crimson `#DB3D5E` as the single accent — don't add more accent colours
- Keep neutral success/warning/error badges (green/amber/orange — not rose)
- `font-weight: 700` for semibold text, `700` for bold (boosted from default)

### ❌ Don't
- Don't use blue (`#007AFF`, `#2563EB`, `bg-blue-*`) anywhere in Theme 2
- Don't use flat/no-shadow cards — the shadow lifts cards off the cream page
- Don't use sharp corners (`border-radius < 8px`) on any interactive element
- Don't use solid-colour filled check icon boxes (e.g. `bg-accent` for feature checkmarks) — they create too much accent density; use white box + accent check mark
- Don't set colours via inline `style={{}}` if they need to switch with theme
- Don't use system grays (`#F5F5F7`, `zinc-*`, `gray-*`) — replace with warm stone equivalents
- Don't use cool-tinted section backgrounds (`#f8faff`, `#eff6ff`) — replace with `bg-surface` or warm cream
- Don't apply `rounded-sm` expecting it to be 4px — in Theme 2 it is 10px
- Don't mix both themes' design language on the same page

---

## 15. Google Font Setup

```html
<!-- Add to <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
```

```css
/* Or via @import */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
```

Weights used: `300` (light), `400` (regular), `500` (medium), `600` (semibold), `700` (bold), `800` (extrabold).

---

## 16. Quick Reference Card

```
PAGE BG      #F6F1EB  ████
CARD BG      #FFFFFF  ████
SURFACE      #EDE6DF  ████
ACCENT       #DB3D5E  ████
ACCENT HOVER #C22E4F  ████
BODY TEXT    #1A130C  ████
MUTED TEXT   #9E8E84  ████
BORDER       #E8E0D8  ████
INPUT BG     #FAF7F4  ████

FONT         Plus Jakarta Sans
HEADING W    700
BODY W       400
RADIUS SM    10px
RADIUS LG    16px
RADIUS BTN   100px (pill)
SHADOW       0 1px 2px rgba(60,30,10,.04), 0 4px 16px rgba(60,30,10,.07)
```
