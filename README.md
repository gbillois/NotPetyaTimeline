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
  "theme":  { "bg": "#0d0b08", "fg": "#e6dcc8", "accent": "#dc3c28" },
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

`theme` and `layout` are first-class config sections. Today they drive page
colors, per-phase colors, and which blocks render (map/globe, chronology list,
severity meter, artifacts, playback). The structure is intentionally open so
new style knobs (fonts, density, alternate layouts) can be added without
touching event data.
