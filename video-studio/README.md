# Video Debriefer — générateur de vidéos documentaires de crise

Le pendant vidéo de **Crisis Debriefer** : un studio HTML qui transforme une
timeline de crise (ou n'importe quel récit) en vidéo documentaire 1080p de
~2 minutes — voix off neurale, musique originale synthétisée, scènes animées
(cartes, statistiques, leçons), même niveau de finition que la vidéo
`video/notpetya-documentary.mp4`.

**Philosophie : le moins d'IA possible.** L'IA (Claude ou OpenAI, votre clé)
n'est utilisée que pour rédiger le *brouillon* de scénario — et même cette
étape est optionnelle (gabarit déterministe). Toute la production (voix,
images, musique, montage) est 100 % locale et déterministe.

## Démarrage

```sh
cd video-studio/pipeline
python3 server.py            # → http://localhost:8765/studio
```

Pré-requis (une fois) : `brew install ffmpeg node`, `pip3 install edge-tts numpy scipy`.
Playwright s'installe tout seul au premier build.

## Les 3 étapes du studio

1. **Scénario** — collez votre matière première (timeline Crisis Debriefer,
   `TIMELINE_EVENTS`, notes, compte-rendu). Réglez durée cible, langue, ton,
   public, style graphique, voix. Puis :
   - **Générer (IA)** : votre clé Claude/OpenAI (stockée uniquement dans le
     navigateur) produit un scénario complet au schéma ci-dessous ; ou
   - **Gabarit sans IA** : la structure est dérivée mécaniquement de la
     timeline, vous rédigez les voix off vous-même.
2. **Adaptation** — éditez chaque scène (voix off, textes à l'écran, photos
   intégrées), réordonnez, ajoutez/supprimez ; l'**aperçu live** rejoue la
   vidéo image par image (scrubber + lecture) avec le *même moteur* que le
   rendu final. Le JSON complet reste éditable pour les réglages fins
   (cues `at`, caméras, moods musicaux, `theme.overrides`…).
3. **Production** — un clic si le serveur local tourne (progression en
   direct, MP4 téléchargeable), ou export du JSON + `python3 pipeline/build.py
   mon-projet.json`.

## Schéma d'un projet

```jsonc
{
  "meta":   { "title", "slug", "lang" },          // lang: fr en es de it pt
  "theme":  { "preset": "wavestone" | "cyber-dark",
              "overrides": { "accent": "#…", … } }, // optionnel, cf. THEMES dans engine/scene.html
  "audio":  { "voice": "fr-FR-DeniseNeural",      // optionnel (auto selon langue)
              "rate": "+6%", "musicLevel": -8.5, "voGain": 7 },
  "target": { "duration": 120 },                  // auto-ajustement du débit si dépassé
  "pacing": { "lead": 0.8, "gap": 0.55, "tail": 1.6, "fps": 24 },
  "scenes": [ /* voir types ci-dessous */ ]
}
```

### Types de scènes

| Type | Usage | Champs propres |
|------|-------|----------------|
| `cold-open` | accroche (date, citation, titre glitché) | `dateLine, kicker, title, titleSize?, titleAt?, subtitle` |
| `chain` | chronologie à jalons (3-5 nœuds) | `heading, nodes:[{date,title,sub,at?}]` |
| `map-focus` | carte régionale + statistique + liste | `camera:{center:[lon,lat],scale}, epicenter, impactAt?, dotAnchors, stat:{value,suffix?}, statAt?, statLabel, bullets` |
| `map-spread` | carte monde + arcs + estampilles | `origin, stamps:[{name,fig,coords,at?}], bottom:{text,strong}` |
| `map-trace` | piste d'enquête (points verts reliés) | `trail:[{coords,label,dx?,dy?,at?}], big, bigAt?, sub, strip, footer` |
| `stat-grid` | grille 2×2 de faits/chiffres | `facts:[{tag,big,sub,at?,counter?:{to,suffix}}]` |
| `lessons` | leçons numérotées + chute (fond brand) | `lessons:[{text,at?}], finalLine1, finalLine2, finalAt?` |
| `image` | photo plein écran (Ken Burns) + légende | `src` (dataURL via le studio), `caption, kenburns?` |
| `endcard` | carton de fin (sans VO) | `title, subtitle, brand, minDuration` |

Champs communs : `id`, `type`, `vo` (texte de voix off), `eyebrow`,
`mood` (musique : `dark, tension, impact, grim, hope, cold, resolve` —
défaut intelligent par type). Les cues `at` sont en secondes depuis le début
de la VO de la scène ; absentes, elles sont réparties uniformément.
`coords` = `[longitude, latitude]`.

## Arborescence

```
video-studio/
├── studio.html         ← le frontal (servir via server.py, ou ouvrir en file://)
├── engine/scene.html   ← moteur de rendu déterministe (aperçu ET rendu final)
├── pipeline/
│   ├── server.py       ← serveur local (production en un clic depuis le studio)
│   ├── build.py        ← pipeline complet : VO → timing → frames → musique → mix → MP4
│   ├── render.js       ← capture Playwright 1080p24
│   └── make_music.py   ← musique paramétrique par moods (ré mineur, synthèse pure)
├── examples/           ← notpetya.json (EN) · helios-leaks.json (FR, fictif)
└── out/                ← MP4 finaux + dossiers de travail
```

## Qualité / réglages

- **Durée** : `target.duration` ; le pipeline ré-accélère la voix (max +4 %)
  si ça dépasse, et affiche l'écart dans le studio.
- **Style** : 2 presets + `theme.overrides` pour toute couleur/police du
  moteur ; la mise en page est dans le CSS de `engine/scene.html`.
- **Ton / langue** : passés à l'IA ; la voix se choisit dans `audio.voice`
  (toutes les voix edge-tts sont utilisables).
- **Musique** : volume via `audio.musicLevel` (dB), arc dramatique via les
  `mood` de chaque scène.
- **Photos** : scènes `image` — uploadées dans le studio, embarquées en
  dataURL dans le projet (autonome).
