# NotPetyaTimeline

An interactive, scrubable reconstruction of the 2017 NotPetya cyberattack
(`index.html`), plus a generalized generator that turns the same concept into a
reusable tool.

## CrisisDebrifier.html — timeline generator

`CrisisDebrifier.html` generalizes the timeline into a standalone authoring tool.
Open it in a browser and:

- **Load a config file** (`.json`) describing the crisis, or click **Exemple
  NotPetya** to start from the built-in dataset.
- **Edit live** — tweak the title/colors/visible blocks, or edit the raw JSON;
  the preview updates instantly.
- **Download a self-contained timeline** (`.html`) — a single file you can host
  or share, identical to the live preview.

### Input format

A single JSON object:

```jsonc
{
  "meta":   { "title": "…", "subtitle": "…", "badge": "…", "lang": "en" },
  "theme":  {
    "bg": "#0d0b08", "fg": "#e6dcc8", "ink": "#f6f1e4",
    "accent": "#dc3c28", "panel": "#0a0907",
    "fontTitle": "Fraunces", "fontBody": "Inter", "fontMono": "JetBrains Mono"
  },
  "layout": { "showMap": true, "showEventList": true, "showSeverity": true,
              "showArtifacts": true, "showPlayback": true },
  "phases": [ { "id": "prelude", "label": "…", "range": "…",
               "start": 0.0, "end": 0.4, "color": "#d4a03c" } ],
  "events": [ {
    "id": "e01", "phase": "prelude", "dateLabel": "April 14, 2017",
    "t": 0.19, "title": "…", "location": "…", "coords": [50.1, 14.4],
    "severity": 3, "kind": "leak", "headline": "…", "body": "…",
    "artifacts": ["…"], "casualties": "…", "damageUSD": "…"
  } ]
}
```

Only `events` is strictly required. The tool fills the rest in:

- **Position** — uses each event's `t` (0→1). If `t` is missing it is derived
  from an ISO `date` field, otherwise events are spaced evenly.
- **Phases** — if omitted, they are derived from the distinct `phase` values.
- **Theme / layout** — sensible dark-dossier defaults; every key is optional.

### Styling & blocks (built to extend)

`theme` and `layout` are first-class config sections, all editable live from the
left panel:

- **Colours** — `bg` (background), `fg` (body text), `ink` (titles/headings),
  `accent`, `panel` (header/strip), plus a colour per phase.
- **Fonts** — `fontTitle`, `fontBody`, `fontMono`. Any Google Font name works;
  the generated file loads it automatically (the curated dropdowns cover common
  choices, and the JSON editor accepts arbitrary families).
- **Blocks** — `showMap`, `showEventList`, `showSeverity`, `showArtifacts`,
  `showPlayback` toggle which parts of the timeline render.

The structure is intentionally open so new style knobs (density, alternate
layouts) can be added without touching event data.
