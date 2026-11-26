# Fairness in der Personalauswahl — Kurzfassung

Standalone short version of the fairness activity, adapted to automated hiring: two applicant
groups and fair hiring thresholds. It is based on the larger `fairness-main` app, but keeps only
the two interactive parts needed for a public, self-guided session.

The underlying study examines fairness in credit scoring; this short version adapts the idea to
hiring. It deliberately omits a monetary value: the quality brake is the number of unsuitable
hires.

## Development

Node 22 or newer. The dev server runs on **5174** so it can coexist with the CAMMP app on 5173.

```bash
npm ci
npm run dev       # http://localhost:5174/
npm test          # node --test (dataset, metrics, threshold search, icon array, formatting)
npm run build     # dist/
npm run preview   # http://localhost:4174/
```

## Routes

| Route | Content |
| --- | --- |
| `/#/de` / `/#/en` | Landing: automated hiring and the fairness question |
| `/#/de/groups` / `/#/en/groups` | Two applicant groups |
| `/#/de/thresholds` / `/#/en/thresholds` | Fair hiring thresholds |
| `/#/de/about` / `/#/en/about` | Article, authors, licence, funding |

The language comes from the URL. It is remembered in `localStorage` under `fairness.lang`.
`<html lang>` and the document title follow the active language.

## The quality brake

There is no four-fifths / 4/5 check in this short version. Each group card shows the **number of
unsuitable invitations** (`fp`, „Fehleinladungen“), i.e. applications above the threshold whose
ground truth is “unsuitable”. Those counts are the quality brake: without them, inviting everyone
would look perfectly fair — a 100 % invitation rate for both groups is not a good outcome.

## Icon array

Below the two group cards, each application is drawn as a small figure (20 × 10 grid per group).
Figures are grouped into the four confusion-matrix blocks TP, FP, FN, TN and the score plays no
role. Class is encoded without hue: filled = invited, outline = not invited; dark = suitable,
light or grey = unsuitable (so it works in greyscale and for colour-vision deficiencies). A
legend below each array lists the four counts. The arrays update live with the sliders.

## Notes and printing

Each task on the groups and thresholds pages has a short notes field. Notes are stored locally
under `fairness.notes.*`; nothing is sent to a server. The task section has **Drucken / PDF**
(uses the browser print dialog) and **Notizen löschen** (removes all notes on this device). In
print mode the header, navigation and note inputs are hidden and the notes are printed with the
current charts and metrics.

## Structure

```
src/
├── components/     # DotPlot, IconArray, ConfusionMatrix, Notes, sliders, task boxes, layout
├── locales/        # de.json, en.json
├── pages/          # Introduction, TwoPopulations, FairThresholds, About
├── utils/          # CSV loading, display labels, metrics, classification, threshold search, formatting
├── styles/         # global overrides and print styles
├── App.jsx         # routes
├── i18n.js         # i18next setup
├── lang.js         # URL/storage language helpers
└── theme.js        # MUI theme
public/
├── data/distribution.csv
└── article-thumbnail.png
```

`public/data/distribution.csv` is loaded at runtime. Its schema is canonical:
`score,group,outcome` with `group ∈ {pinkville, greenfield}` and
`outcome ∈ {suitable, unsuitable}`. The language choice and notes are the only things stored, and
only in `localStorage`. There is no backend, no tracking and no external font or analytics
request.

## Deployment

The included GitHub Pages workflow builds `dist/` and publishes it. `vite.config.js` uses
`base: './'` and the app uses `HashRouter`, so it also works from a subpath. For a custom
domain on Netlify/Cloudflare Pages, connect the repository with build command
`npm run build` and publish directory `dist`.
