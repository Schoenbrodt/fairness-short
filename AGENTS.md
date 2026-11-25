# AGENTS.md — Fairness in Hiring (short version)

## Project overview

This is the standalone, public short version of the fairness learning activity, adapted to
automated hiring. It keeps only the two interactive chapters of the larger app:

1. **Two applicant groups** — the suitability-score distributions of Pinkville and Greenfield.
2. **Fair hiring thresholds** — two sliders, three linking strategies, offer rate, hit rate,
   unsuitable hires and a 4/5 check. Accuracy and the confusion matrices are optional details.

The underlying teaching activity is about credit scoring; this app uses a hiring story. The
short version deliberately has no monetary value. The quality brake is the number of unsuitable
hires (`fp`), shown on each group card.

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
  returns `tp`, `fp`, `fn`, `tn`, `total`, `accuracy`, `positiveRate` and `truePositiveRate`.
  Keep it free of React and i18n.
- `findThresholdForMetric` in the same module — searches thresholds in `[min, max]`
  (default `[10, 100]`) and returns `{ threshold, exact, metricValue }`. Ties go to the threshold
  closest to `reference`, then to the higher threshold.
- `src/utils/fairnessCheck.js` — pure 4/5 logic: `fairnessCheck(rateA, rateB)` returns
  `{ level, ratio }` (`green` ≥ 0.8, `yellow` ≥ 0.6, otherwise `red`; both rates 0 → `none`),
  and `hitRateGap` returns the absolute difference. Keep it free of React and i18n.
- `src/utils/format.js` — locale-aware percentages via `Intl.NumberFormat`. Use it instead of
  appending `%` in JSX.
- `src/components/FairnessCheck.jsx` — renders the 4/5 card, the traffic-light chip, the
  hit-rate difference, the total number of unsuitable hires and the caveat. Do not present the traffic light as a universal fairness
  verdict; it only checks offer rates.
- `src/lang.js` / `src/i18n.js` — the URL is the source of truth for the language. Do not
  hardcode `lng`; keep `<html lang>` and `document.title` in sync.
- `public/data/distribution.csv` — the only dataset. Keep the CSV schema stable.

## Data and text conventions

- The CSV schema is `score,group,outcome`:
  - `group`: `pinkville` or `greenfield`
  - `outcome`: `suitable` or `unsuitable`
- Do not put German labels back into the CSV or into `calculateMetrics`; the labels live in
  `src/utils/translateData.js` for the charts.
- All visible UI text belongs in `src/locales/de.json` and `src/locales/en.json`. Keep both
  files in sync.
- The short UI has no monetary value. Do not reintroduce a euro metric without updating the
  teaching copy and the 5-minute design. The quality brake is `fp` / „Fehlbesetzungen“.
- The About page contains the licence, authors, the adaptation note and the legal
  notice/privacy text. Before a public deployment, check that the imprint details are still
  correct for the target domain.

## Testing

`npm test` runs `node --test src/utils/*.test.js`. The suite covers the dataset shape (400 rows,
200 per group, 100/100 outcomes), the confusion matrix at threshold 70, the group totals, empty groups, threshold search
(exact/approximate, tie-breaks, range), the 4/5 bands including 0/0, and locale formatting. Add a test for any change to `calculateMetrics`, `findThresholdForMetric`, `translateData`,
`fairnessCheck` or `format`.

## Notes and sharing

The Notes fields are local-only. If you add a backend or analytics later, update the privacy
text on the About page at the same time.
