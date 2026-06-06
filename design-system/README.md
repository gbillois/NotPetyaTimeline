# Wavestone Design System

A portable, framework-agnostic design system distilled from the **Wavestone
Universal Registration Document 2024/25**. Drop it into any project — web app,
landing page, slide deck, internal tool — and get a consistent Wavestone look.

## What's in here

| File | Purpose |
|------|---------|
| `wavestone-tokens.css` | All design tokens as CSS custom properties (`--ws-*`). **Start here.** |
| `wavestone-tokens.json` | Same tokens in the **W3C Design Tokens** format — for Tokens Studio (Figma), Style Dictionary, etc. |
| `wavestone-components.css` | Optional ready-made component classes (`.ws-btn`, `.ws-card`, `.ws-badge`…) built on the tokens. |
| `styleguide.html` | Living style guide — open in a browser to see every token and component. |

## Quick start (any web project)

```html
<link rel="stylesheet" href="wavestone-tokens.css">
<link rel="stylesheet" href="wavestone-components.css"> <!-- optional -->
```

```css
.my-thing {
  color: var(--ws-color-text);
  background: var(--ws-color-primary);
  border-radius: var(--ws-radius-lg);
  padding: var(--ws-space-4) var(--ws-space-6);
  box-shadow: var(--ws-shadow-md);
}
```

Or use the components directly:

```html
<div class="ws-root">
  <span class="ws-eyebrow">Insight</span>
  <h1 class="ws-h1">A complex and ever-changing world</h1>
  <button class="ws-btn ws-btn--primary">Get started</button>
  <button class="ws-btn ws-btn--accent">Learn more</button>
</div>
```

### Signature indigo surface

Add `ws-on-brand` to any block to flip onto the brand gradient (white text,
green accent leads) — like the cover and "Key figures" pages of the report:

```html
<section class="ws-on-brand">
  <span class="ws-stat">6,076</span>
  <span class="ws-stat__label">employees worldwide</span>
</section>
```

## Brand foundations (extracted from the PDF)

- **Primary — Indigo** `#451DC7` (gradient deep `#2D1380`, light tints `#BDAFEB`, `#D1CAF2`)
- **Accent — Green** `#04F06A` (use the neon on dark/large; `#088A42` for green text on white)
- **Secondary — Teal** `#228D95`
- **Neutrals — Ink** slightly indigo-tinted greys, `#16121F` → `#F5F4F9`
- **Display type** geometric (Poppins / Montserrat placeholder for the licensed Wavestone face)
- **Body type** Inter
- **Signature motifs** the indigo→deep-indigo gradient and thin white + green "wave" arcs

> **Fonts:** this kit ships with the closest free substitutes (Poppins, Inter)
> via Google Fonts. Replace them with the licensed Wavestone typeface in
> production by editing the `--ws-font-display` / `--ws-font-body` tokens.

## Using the W3C tokens

`wavestone-tokens.json` follows the [Design Tokens Community Group format](https://design-tokens.github.io/community-group/format/).

- **Figma:** import via the *Tokens Studio for Figma* plugin.
- **Style Dictionary:** point your config `source` at this file to generate
  iOS / Android / JS / SCSS outputs.

## Conventions

- Prefer the **semantic** tokens (`--ws-color-primary`, `--ws-color-text`…) in
  app code; treat the raw scales (`--ws-indigo-600`) as primitives.
- All sizes are on a 4px spacing grid; type scale is in `rem` (root = 16px).
- Everything is namespaced `ws-` / `--ws-` to avoid collisions.
