# Wavestone Design System — Portable Reference

> Single-file, self-contained reference for the **Wavestone** visual identity,
> distilled from the *Universal Registration Document 2024/25*.
> Drop this file into any project (docs, a `CLAUDE.md`, a design wiki, an AI
> assistant's context) to keep every product on-brand. All token values are
> inline, so this file works on its own — no CSS/JSON required.

**Companion files** (in the `design-system/` folder of this repo):
`wavestone-tokens.css` · `wavestone-tokens.json` (W3C) · `wavestone-components.css` · `styleguide.html`

---

## 1. Brand at a glance

| | |
|---|---|
| **Primary** | Indigo `#451DC7` |
| **Accent** | Green `#04F06A` (neon — large/dark) · `#088A42` (text on white) |
| **Secondary** | Teal `#228D95` |
| **Ink (text)** | `#16121F` near-black, faint indigo cast |
| **Display type** | Geometric sans — **Poppins** / Montserrat (placeholder for the licensed Wavestone face) |
| **Body type** | **Inter** |
| **Signature motifs** | Indigo→deep-indigo gradient; thin white + green "wave" arcs; big green stat numbers on indigo |

**Voice of the visuals:** confident, European, independent, modern-corporate. Lots
of white space, generous rounded corners, one bold accent (green) used sparingly.

---

## 2. Color tokens

### Indigo — primary
| Token | Hex | Use |
|---|---|---|
| `indigo-50`  | `#F1EEFB` | subtle background, primary-subtle |
| `indigo-100` | `#D1CAF2` | light tint |
| `indigo-200` | `#BDAFEB` | light tint |
| `indigo-300` | `#A18FE3` | |
| `indigo-400` | `#866CDB` | |
| `indigo-500` | `#5A2BE0` | focus ring, bright variant |
| `indigo-600` | `#451DC7` | **◆ primary brand** |
| `indigo-700` | `#36169B` | primary hover |
| `indigo-800` | `#2D1380` | inverse surface / gradient deep |
| `indigo-900` | `#1E0D57` | |
| `indigo-950` | `#150939` | |

### Green — accent
| Token | Hex | Use |
|---|---|---|
| `green-50`  | `#E1FDED` | accent-subtle |
| `green-100` | `#C8FBDC` | |
| `green-200` | `#A6FACA` | |
| `green-300` | `#5CF59E` | accent on dark |
| `green-400` | `#04F06A` | **◆ accent (neon)** — large text / on indigo |
| `green-500` | `#06D964` | |
| `green-600` | `#06B854` | |
| `green-700` | `#088A42` | **accessible green text on white** |
| `green-800` | `#066632` | |

### Teal — secondary
| Token | Hex |
|---|---|
| `teal-300` | `#6EC3C9` |
| `teal-400` | `#3E9BA3` |
| `teal-500` | `#228D95` ◆ |
| `teal-600` | `#1E7A82` |
| `teal-700` | `#18636A` |

### Ink — neutrals (slightly indigo-tinted greys)
| Token | Hex | Use |
|---|---|---|
| `ink-0`   | `#FFFFFF` | surface / bg |
| `ink-50`  | `#F5F4F9` | subtle bg |
| `ink-100` | `#E6E4EE` | border / divider |
| `ink-200` | `#CFCCDC` | strong border |
| `ink-300` | `#A8A4B8` | |
| `ink-400` | `#817C95` | subtle text |
| `ink-500` | `#6B6580` | muted text |
| `ink-600` | `#514C63` | |
| `ink-700` | `#3A3550` | |
| `ink-800` | `#242036` | |
| `ink-900` | `#16121F` | **body text** |

### Status
`success #088A42` · `warning #C8861A` · `danger #D8412F` · `info #228D95`

### Semantic roles (use these in app code)
| Role | Value |
|---|---|
| bg / surface | `#FFFFFF` |
| bg-subtle | `#F5F4F9` |
| bg-inverse | `#2D1380` |
| text | `#16121F` |
| text-muted | `#6B6580` |
| heading | `#451DC7` |
| primary | `#451DC7` (hover `#36169B`) |
| primary-contrast | `#FFFFFF` |
| accent | `#04F06A` (text-on-white `#088A42`) |
| secondary | `#228D95` |
| border | `#E6E4EE` |
| focus-ring | `#5A2BE0` |

### Gradients
- **Brand:** `radial-gradient(120% 120% at 25% 15%, #5226E0 0%, #451DC7 38%, #2D1380 100%)`
- **Accent:** `linear-gradient(90deg, #04F06A 0%, #5CF59E 100%)`

---

## 3. Typography

```
Display : 'Poppins', 'Montserrat', system-ui, sans-serif   (weights 400–800)
Body    : 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
Mono    : 'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace
```
> Replace the display/body stacks with the **licensed Wavestone typeface** in production.

### Type scale (root = 16px)
| Token | Size | Typical use |
|---|---|---|
| `xs`   | 12px | eyebrow, captions, badges |
| `sm`   | 14px | small / secondary |
| `base` | 16px | body |
| `lg`   | 18px | lead paragraph |
| `xl`   | 20px | h3 |
| `2xl`  | 24px | pull quote |
| `3xl`  | 30px | h2 |
| `4xl`  | 36px | h1 |
| `5xl`  | 48px | hero |
| `6xl`  | 60px | display |
| `7xl`  | 72px | stat numbers |

**Weights:** regular 400 · medium 500 · semibold 600 · bold 700 · extrabold 800
**Line height:** none 1 · tight 1.15 · snug 1.3 · normal 1.5 · relaxed 1.65
**Letter spacing:** tighter −0.03em · tight −0.015em · normal 0 · wide 0.04em · eyebrow 0.14em (uppercase labels)

**Conventions**
- Headings → display font, bold/extrabold, tight tracking, color = heading indigo (or white on brand surface).
- Eyebrow → uppercase, bold, `xs`, `0.14em` tracking, with a 2px green underline.
- Stat numbers → display font, `7xl`, green on indigo.

---

## 4. Spacing (4px grid)

`0` · `1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=20 · `6`=24 · `8`=32 · `10`=40 · `12`=48 · `16`=64 · `20`=80 · `24`=96 · `32`=128 (px)

## 5. Radius
`sm` 4 · `md` 8 · `lg` 12 · `xl` 16 · `2xl` 24 · `3xl` 32 · `pill` 999 · `full` 50% (px) — buttons use **pill**, cards use **xl**.

## 6. Border width
`default` 1px · `thick` 2px (accent underlines) · `heavy` 4px

## 7. Elevation (shadows)
| Token | Value |
|---|---|
| `xs` | `0 1px 2px rgba(22,18,31,.06)` |
| `sm` | `0 1px 3px rgba(22,18,31,.08), 0 1px 2px rgba(22,18,31,.06)` |
| `md` | `0 4px 12px rgba(22,18,31,.10)` |
| `lg` | `0 12px 28px rgba(22,18,31,.12)` |
| `xl` | `0 24px 48px rgba(22,18,31,.16)` |
| `brand` | `0 14px 30px rgba(69,29,199,.30)` (indigo glow) |
| `focus` | `0 0 0 3px rgba(90,43,224,.35)` |

## 8. Motion
Durations: fast 120ms · base 200ms · slow 320ms
Easings: standard `cubic-bezier(.2,0,0,1)` · in `(.4,0,1,1)` · out `(0,0,.2,1)` · emphasized `(.2,0,0,1.2)`

## 9. Layout
Containers: sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1440 (px)
Z-index: dropdown 1000 · sticky 1100 · overlay 1200 · modal 1300 · toast 1400

---

## 10. Components (patterns)

**Button** — pill, semibold, `12px 24px` padding.
- Primary: bg `#451DC7`, text white; hover bg `#36169B` + brand shadow.
- Accent: bg `#04F06A`, text `#1E0D57`.
- Outline: transparent, 1px `#451DC7` border, indigo text.
- Ghost: transparent, hover bg `#E6E4EE`.

**Badge / tag** — uppercase, bold, `xs`, radius `sm`, padding `4px 12px`.
Variants: primary (indigo/white), accent (green/indigo-900), teal, subtle (indigo-50/indigo).

**Card** — surface white, 1px `#E6E4EE` border, radius `xl`, padding `24px`, shadow `sm`; interactive hover → shadow `lg` + translateY(−2px).

**Pull quote** — display font, bold, `2xl`, indigo, centered, max ~38ch, small muted citation.

**Stat block** — green `7xl` number + semibold label, on the indigo brand surface.

**Inputs** — radius `md`, 1px `#CFCCDC` border, padding `12px 16px`; focus → border `#5A2BE0` + focus ring.

**Brand surface** — apply the brand gradient; text becomes white, muted = `rgba(255,255,255,.72)`, and the **green accent leads** for primary actions/highlights.

---

## 11. Quick start

**With the companion CSS:**
```html
<link rel="stylesheet" href="wavestone-tokens.css">
<link rel="stylesheet" href="wavestone-components.css"> <!-- optional -->
```
```html
<div class="ws-root">
  <span class="ws-eyebrow">Insight</span>
  <h1 class="ws-h1">A complex and ever-changing world</h1>
  <button class="ws-btn ws-btn--primary">Get started</button>
</div>
```

**Without it — minimal copy-paste tokens:**
```css
:root{
  --primary:#451DC7; --primary-hover:#36169B; --accent:#04F06A; --accent-text:#088A42;
  --secondary:#228D95; --text:#16121F; --muted:#6B6580; --bg:#FFFFFF; --bg-subtle:#F5F4F9;
  --border:#E6E4EE; --radius:12px; --radius-pill:999px;
  --font-display:'Poppins',Montserrat,system-ui,sans-serif; --font-body:'Inter',system-ui,sans-serif;
  --gradient-brand:radial-gradient(120% 120% at 25% 15%,#5226E0,#451DC7 38%,#2D1380);
}
```

---

## 12. Do / Don't

✅ Use **one** accent (green) per view; let indigo + white carry the layout.
✅ Pair big green numbers with the indigo brand surface.
✅ Keep generous white space and the 4px spacing rhythm.
✅ Use `#088A42` (not `#04F06A`) for green **text on white** — contrast.

❌ Don't put neon green `#04F06A` as small body text on white.
❌ Don't mix teal and green as competing accents in the same block.
❌ Don't square off buttons — they're pills.
❌ Don't ship the placeholder fonts if the licensed Wavestone face is available.

---

*Derived from the Wavestone Universal Registration Document 2024/25. Color values
sampled from the source PDF; fonts are close free substitutes pending the
licensed brand typeface.*
