# AGENTS.md — Fairness in Hiring (short version)

## Project overview

This is the standalone, public short version of the fairness learning activity, adapted to
automated hiring. It keeps only the two interactive chapters of the larger app:

1. **Two applicant groups** — the suitability-score distributions of female (`greenfield`) and
   male (`pinkville`) applicants. The UI labels them “Weiblich” / “Männlich” (English “Female” /
   “Male”); the town names are gone. Men are the favoured group: their scores are higher on
   average, reflecting biased past hiring decisions.
2. **Fair hiring thresholds** — two sliders, three linking strategies, invitation rate, hit rate,
   accuracy and unsuitable invitations on each slider card. Below the cards a
   `ToggleButtonGroup` switches between the icon array (default) and the dot plots; the metrics
   live on the slider cards, so they are visible in both views. The confusion matrices remain
   optional details in an accordion.

The underlying teaching activity is about credit scoring; this app uses a hiring story. The
threshold decides who is **invited to an interview**, not who is hired. The short version
deliberately has no monetary value. The quality brake is the number of unsuitable invitations
(`fp`, „Fehleinladungen“), shown on each group card.

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
  `FairThresholds.jsx` keeps the sliders and the per-group metrics in the top card row and only
  toggles the panel below (`view` state: `icons` default, `dots`). Switching the view must not
  unmount the sliders or the metrics, and the choice is deliberately not persisted
  (`localStorage` holds only the language and the notes). The toggle carries `no-print`, so a
  printout shows the active view.
- `src/components/DotPlot.jsx` — Observable Plot wrapper. It owns the `ResizeObserver`; do not
  move it back into a callback ref (React 18 ignores ref cleanup).
- `src/palette.js` — the only place where class colours live: `GROUP_COLORS`, `UNSUITABLE_COLOR`,
  `NOT_INVITED_OPACITY`. The rule is **hue = suitability, fill/opacity = invitation**: suitable
  applicants keep their group colour, unsuitable applicants are the same grey in both groups.
  Keep this module free of React and i18n, and use it instead of inline hex values.
- `src/components/IconArray.jsx` — one SVG with a `<symbol>` reused 200 times per group, so no
  `ResizeObserver` is needed; the fixed `viewBox` scales with the container. The grid has 20
  columns on desktop and 12 below the `sm` breakpoint, so phones get bigger figures. Figures are
  grouped into the four confusion-matrix blocks TP, FP, FN, TN and the score plays no role. Hue
  encodes
  suitability (group colour = suitable, grey = unsuitable), fill encodes the invitation (filled =
  invited, outline = not invited): TP filled group colour, FN group-colour outline, FP filled
  grey, TN grey outline. The fill/outline difference never depends on hue; grey (`#9e9e9e`) is
  clearly lighter than lilac and about 12 % lighter than green, so hue alone would not separate
  green from grey in a greyscale print — the legend carries the counts. Do not reintroduce a
  red/green/amber class palette. Counts are printed as a legend below.
- `src/utils/classify.js` — pure `classify`, `countClasses`, `sortByClass` for the icon array.
  Keep it free of React and i18n; `countClasses` must stay equal to the confusion matrix.
- `src/utils/calculateMetrics.js` — pure metrics. It takes the canonical `group` key and
  returns `tp`, `fp`, `fn`, `tn`, `total`, `accuracy`, `positiveRate` and `truePositiveRate`.
  Keep it free of React and i18n.
- `findThresholdForMetric` in the same module — searches thresholds in `[min, max]`
  (default `[10, 100]`) and returns `{ threshold, exact, metricValue }`. Ties go to the threshold
  closest to `reference`, then to the higher threshold.
- `src/utils/format.js` — locale-aware percentages via `Intl.NumberFormat`. Use it instead of
  appending `%` in JSX.
- There is no four-fifths / 4/5 check. It was removed from the short version; do not bring it
  back, and do not present a traffic light as a fairness verdict. The quality brake is the
  per-group `fp` count.
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
  teaching copy and the 5-minute design. The quality brake is `fp` / „Fehleinladungen“
  (invited although unsuitable). Use “Einladung zum Vorstellungsgespräch”, not “Stellenangebot”:
  the threshold produces interview invitations, and suitability is only settled later.
- The About page contains the licence, authors, the adaptation note and the legal
  notice/privacy text. Before a public deployment, check that the imprint details are still
  correct for the target domain.

## Testing

`npm test` runs `node --test src/utils/*.test.js`. The suite covers the dataset shape (400 rows,
200 per group, 100/100 outcomes), the confusion matrix at threshold 70, the group totals, empty groups, threshold search
(exact/approximate, tie-breaks, range), icon-array classification and ordering, and locale
formatting. Add a test for any change to `calculateMetrics`, `findThresholdForMetric`,
`translateData`, `classify` or `format`.

## Mobile

The layout is checked at 320, 390, 768 and 1440 px. Headings use `clamp()` sizes plus
`overflowWrap`/`hyphens` so long German words are not clipped; any grid child that contains a
table needs `minWidth: 0`, otherwise the table's min-content width pushes the page sideways. The
confusion matrix then scrolls inside its own `TableContainer`, and the icon array drops to 12
columns below `sm`.

## Notes and sharing

The Notes fields are local-only. If you add a backend or analytics later, update the privacy
text on the About page at the same time.
