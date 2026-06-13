# NotPetya — 2-minute documentary video

`notpetya-documentary.mp4` — 1920×1080, 24 fps, H.264 + AAC, ~1:57.
Built for a COMEX-level crisis debrief, from the events in `../data.jsx`,
in the Wavestone design system (`../design-system/`).

> **Variante** : `renault-leaks-documentaire.mp4` (~1:58, voix française
> fr-FR-HenriNeural) — même pipeline appliqué au scénario fictif « Renault
> Leaks » de `../testr.html` (compromission fournisseur → fuites en cascade
> RH/commerce/ingénierie/produit → attribution & chantage 72 h).
> Sources dans `build-renault/`.

## Structure (3 acts + takeaways)

| Time | Scene | Message |
|------|-------|---------|
| 0:00 | Cold open — 27.06.2017 | Hook: 17 minutes to lose everything |
| 0:15 | Act I — The weapon | NSA exploit → stolen → patched → dumped → WannaCry ignored |
| 0:30 | Act II — Day 0, Kyiv | One trusted supplier (M.E.Doc); 10% of Ukraine wiped in 1h |
| 0:49 | Act II — Global contagion | Maersk, Merck, FedEx, Saint-Gobain, Mondelēz — collateral damage |
| 1:07 | The recovery | The Ghana domain controller; rebuilt in 10 days |
| 1:20 | Act III — The fallout | Wiper not ransomware; $10B+; GRU attribution; "act of war" insurance saga |
| 1:39 | Board takeaways | Not the target ≠ safe · supplier = way in · resilience on one offline server |

## Production pipeline (all generated, no stock assets)

Everything in `build/` is reproducible:

1. `script.md` — narration script (7 scenes, ~250 words)
2. `make_vo.py` — neural voiceover (edge-tts, en-US-AndrewNeural), one MP3 per scene
3. `make_timing.py` — measures VO durations → `timing.json` (scene timeline, 116.7s)
4. `prep_land.js` — world coastline geometry (world-atlas 110m, same source as the timeline app)
5. `scene.html` — deterministic animation (`window.seek(t)`), Wavestone tokens, local fonts
6. `render.js` — Playwright renders 2,801 PNG frames at 1080p24
7. `make_music.py` — synthesized underscore (numpy/scipy): D-minor drones, ticking
   tension, detonation pulse, B♭-major "Ghana" lift, resolving finale
8. VO + music mixed with sidechain ducking (ffmpeg), then `encode.sh` → final MP4

To regenerate from scratch:
```sh
cd build
python3 make_vo.py && python3 make_timing.py && node prep_land.js
node render.js          # ~8 min
python3 make_music.py   # ~1 min
# vo assembly + mix commands: see git history or re-run encode.sh after mixing
./encode.sh
```
