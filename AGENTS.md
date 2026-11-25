# AGENTS.md — Fairness in Credit Scoring (short version)

## Project overview

This is the standalone, public short version of the fairness learning activity. It keeps only
the two interactive chapters of the larger app:

1. **Two population groups** — the score distributions of Pinkville and Greenfield.
2. **Fair decision thresholds** — two sliders, three linking strategies, confusion matrices,
   metrics and total profit.

The app is German and English, runs entirely in the browser, and stores only the language
choice and the learner's notes in `localStorage`. Do not reintroduce the other chapters, the
sidebar, the event log or a backend.

## Stack

- React 18 + Vite 6
- React Router 6 with `HashRouter` (static hosting friendly)
- react-i18next (German + English)
- MUI 6
- Observable Plot for the dot plots
- PapaParse for the CSV

## Commands

```bash
npm ci
npm run dev       # http://localhost:5174/
npm run build
npm run preview   # http://localhost:4174/
```

The dev server deliberately uses **5174**; the CAMMP workshops app uses 5173. Do not run
`npm`/`node` in Docker for this project — native Node is expected.

## Structure

- `src/App.jsx` — routes: `/:lang`, `/:lang/groups`, `/:lang/thresholds`, `/:lang/about`.
- `src/components/Layout.jsx` — header, three-step navigation, prev/next, footer.
- `src/components/StepNav.jsx` — the three steps. Keep the app linear.
- `src/components/Notes.jsx` — `Notes` (localStorage-backed field) and `NotesActions`
  (print / clear). The print stylesheet is in `src/styles/custom.css`; keep `.no-print`,
  `.notes-input` and `.notes-print` in sync.
- `src/pages/` — one page per route.
- `src/components/DotPlot.jsx` — Observable Plot wrapper. It owns the `ResizeObserver`; do not
  move it back into a callback ref (React 18 ignores ref cleanup).
- `src/utils/calculateMetrics.js` — pure metrics. It takes the canonical `group` key and
  returns `tp`, `fp`, `fn`, `tn`, `total`, `accuracy`, `positiveRate`, `truePositiveRate` and
  `profit` (300 € per TP, −700 € per FP). Keep it free of React and i18n.
- `findThresholdForMetric` in the same module — searches thresholds in `[min, max]`
  (default `[10, 100]`) and returns `{ threshold, exact, value }`. Ties go to the threshold
  closest to `reference`, then to the higher threshold.
- `src/utils/format.js` — locale-aware percentages and euro amounts via `Intl.NumberFormat`.
  Use it instead of appending `%` or `€` in JSX.
- `src/lang.js` / `src/i18n.js` — the URL is the source of truth for the language. Do not
  hardcode `lng`; keep `<html lang>` and `document.title` in sync.
- `public/data/distribution.csv` — the only dataset. Keep the CSV schema stable.

## Data and text conventions

- The CSV schema is `score,group,outcome`:
  - `group`: `pinkville` or `greenfield`
  - `outcome`: `repays` or `defaults`
- Do not put German labels back into the CSV or into `calculateMetrics`; the labels live in
  `src/utils/translateData.js` for the charts.
- All visible UI text belongs in `src/locales/de.json` and `src/locales/en.json`. Keep both
  files in sync.
- The 300 €/700 € profit rule is part of the teaching content; do not change it without
  checking the copy.
- The About page contains the licence, authors and the legal notice/privacy text. Before a
  public deployment, check that the imprint details are still correct for the target domain.

## Testing

`npm test` runs `node --test src/utils/*.test.js`. The suite covers the dataset shape (400 rows,
200 per group, 100/100 outcomes), the confusion matrix at threshold 70, the profit rule, empty
groups, threshold search (exact/approximate, tie-breaks, range), and locale formatting. Add a
test for any change to `calculateMetrics`, `findThresholdForMetric`, `translateData` or `format`.

## Notes and sharing

The Notes fields are local-only. If you add a backend or analytics later, update the privacy
text on the About page at the same time.
