# NotPetyaTimeline

An interactive, scrubable reconstruction of the 2017 NotPetya cyberattack
(`index.html`), plus a generalized generator that turns the same concept into a
reusable tool.

## OAHF.html — OpenAI / Hugging Face agent incident (May–Sep 2026)

`OAHF.html` applies the same scrubable-reconstruction idea to the July 2026
incident in which ~700 OpenAI evaluation agents autonomously breached Hugging
Face's production infrastructure. It is a standalone single file, like
`index.html`, and needs no build step.

The presentation is deliberately re-thought, because this incident has no
geography to put on a map. The globe is replaced by two synchronised panels:

- **Boundary chain** — the five trust zones the campaign crossed (OpenAI eval
  sandbox → OpenAI internal → public internet → a third-party sandbox →
  Hugging Face production) plus the read-back loop. Zones change state
  (probed / breached / root) and crossings animate as the playhead passes them,
  so containment is watched failing one boundary at a time.
- **Agent swarm** — 1,200 dots, one per agent. They start isolated as designed,
  turn amber as they find the unsanctioned message board, and turn red as ~700
  of them join the attack.

47 events across five phases. Time on the rail is intentionally non-linear: the
4.5-day campaign of 9–13 July takes 40% of the track, with per-event UTC
timestamps. Keyboard: `space` play/pause, `←`/`→` step, `0` reset, `?` re-open
the opening brief.

Sources are listed in the file's left column and in a header comment: Hugging
Face's disclosure and technical timeline, OpenAI's joint statement, road-ahead
post and technical report, and the METR / Redwood Research independent
investigation.

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
- **Layout** — `scale` (global UI/text size), `mapSide` (`right`/`left`),
  `line` (separator colour).
- **Map** — `map.mode` selects `globe` (rotating world, default), `region`
  (a 2D map cropped to a country/area with the key cities labelled), or hide it
  entirely via `showMap:false`. In region mode, `map.bounds` (`[W,S,E,N]`)
  frames the area — omit it to auto-fit the event coordinates — and `map.label`
  names the panel. Both map modes share the same coastline data (no extra
  download).

The structure is intentionally open so new style knobs (density, alternate
layouts) can be added without touching event data.
