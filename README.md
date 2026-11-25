# Fairness in der Kreditvergabe — Kurzfassung

Standalone short version of the fairness activity: the two population groups and the fair
decision thresholds. It is based on the larger `fairness-main` app, but keeps only the two
interactive parts needed for a public, self-guided session.

## Development

Node 22 or newer. The dev server runs on **5174** so it can coexist with the CAMMP app on 5173.

```bash
npm ci
npm run dev       # http://localhost:5174/
npm run build     # dist/
npm run preview   # http://localhost:4174/
```

## Routes

| Route | Content |
| --- | --- |
| `/#/de` / `/#/en` | Landing: credit scoring and the 300 €/700 € rule |
| `/#/de/groups` / `/#/en/groups` | Two population groups |
| `/#/de/thresholds` / `/#/en/thresholds` | Fair decision thresholds |
| `/#/de/about` / `/#/en/about` | Article, authors, licence, funding |

The language comes from the URL. It is remembered in `localStorage` under `fairness.lang`.
`<html lang>` and the document title follow the active language.

## Structure

```
src/
├── components/     # DotPlot, ConfusionMatrix, MetricsTable, sliders, task boxes, layout
├── locales/        # de.json, en.json
├── pages/          # Introduction, TwoPopulations, FairThresholds, About
├── utils/          # CSV loading, display labels, metrics
├── styles/         # small global overrides
├── App.jsx         # routes
├── i18n.js         # i18next setup
├── lang.js         # URL/storage language helpers
└── theme.js        # MUI theme
public/
├── data/distribution.csv
└── article-thumbnail.png
```

`public/data/distribution.csv` is loaded at runtime. There is no backend and no tracking.

## Deployment

The included GitHub Pages workflow builds `dist/` and publishes it. `vite.config.js` uses
`base: './'` and the app uses `HashRouter`, so it also works from a subpath. For a custom
domain on Netlify/Cloudflare Pages, connect the repository with build command
`npm run build` and publish directory `dist`.
