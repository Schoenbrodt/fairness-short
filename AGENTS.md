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
- `src/utils/calculateMetrics.js` — pure metrics. Keep it free of React and i18n.
- `src/utils/format.js` — locale-aware percentages and euro amounts via `Intl.NumberFormat`.
  Use it instead of appending `%` or `€` in JSX.
- `src/lang.js` / `src/i18n.js` — the URL is the source of truth for the language. Do not
  hardcode `lng`; keep `<html lang>` and `document.title` in sync.
- `public/data/distribution.csv` — the only dataset. Keep the CSV schema stable.

## Data and text conventions

- The CSV currently uses the historical German column names (`age`, `type`) and values
  (`Alt`, `Jung`, `Zahlt zurück`). The pages map `Alt` to Pinkville and `Jung` to Greenfield.
  A later refactor should rename the schema to `group` / `outcome`.
- Metrics always operate on the canonical German keys; only the display labels are translated.
- All visible text belongs in `src/locales/de.json` and `src/locales/en.json`. Keep both files
  in sync.
- The 300 €/700 € profit rule is part of the teaching content; do not change it without
  checking the copy.
- The About page contains the licence, authors and the legal notice/privacy text. Before a
  public deployment, check that the imprint details are still correct for the target domain.

## Testing

There is no test suite yet. When adding one, put pure tests next to the utilities
(`node --test` is enough) and cover at least: 400 rows, 200 per group, 100/100 outcomes per
group, the four metrics, the profit formula, and `findThresholdForMetric`.
