# AGENTS.md — Fairness in Credit Scoring (React Rewrite)

## Project Overview

This is a React rewrite of an educational web application teaching fairness in algorithmic credit scoring. The original was built with Observable Framework; this version is a fully client-side React SPA suitable for GitHub Pages hosting.

## Tech Stack

- **React 18** with **Vite** for bundling and dev server
- **React Router** with `HashRouter` (required for GitHub Pages — no server-side routing)
- **react-i18next** for internationalization (German + English)
- **@observablehq/plot** for data visualizations (dot plots)
- **canvas-confetti** for celebration effects on correct answers
- **PapaParse** for client-side CSV parsing
- Plain CSS for styling (no CSS-in-JS, no Tailwind)

## Development Environment

All development happens inside Docker containers. **Do not run npm/node commands on the host.**

- `docker compose up` starts the dev server with hot reload on port 5173
- `docker compose -f docker-compose.yml up --build` for production build test on port 8080
- Source code is volume-mounted for live editing

## Project Structure

```
react-rewrite/
├── public/data/          # CSV data files (loaded at runtime via fetch)
├── src/
│   ├── main.jsx          # Entry point
│   ├── App.jsx           # Router + layout setup
│   ├── i18n.js           # i18next configuration
│   ├── locales/          # Translation JSON files (de.json, en.json)
│   ├── components/       # Reusable UI components
│   ├── pages/            # One component per page/chapter
│   ├── utils/            # Pure functions (metrics, validation, data loading)
│   └── styles/           # CSS files
├── Dockerfile            # Production multi-stage build (node build + nginx)
├── Dockerfile.dev        # Development image with Vite dev server
├── docker-compose.yml    # Dev + prod service definitions
└── nginx.conf            # Production nginx config
```

## Key Conventions

### Internationalization (i18n)

- **Never duplicate components for different languages.** All text comes from translation JSON files via `useTranslation()`.
- Translation files live in `src/locales/de.json` and `src/locales/en.json`.
- URL structure: `/#/:lang/page-name` where `:lang` is `de` or `en`.
- CSV data uses German labels internally (`Zahlt zurück`, `Alt`, `Jung`). Display labels are translated via `translateData.js` based on the active locale.
- The `calculateMetrics.js` utility always operates on German keys — never translate data before computing metrics.

### Components

- **DotPlot**: Wrapper around `@observablehq/plot`. Uses `useRef` + `useEffect` to render Plot SVG into a container div. Accepts data, threshold, color scheme, and dimensions as props.
- **EditableTable**: Renders `contenteditable` cells with `data-correct` values. Validation is triggered externally via a ref or callback.
- **ValidateButton**: Validates sibling EditableTable, highlights correct/incorrect cells, fires confetti when all correct.
- **ConfusionMatrix**: Displays TP/FP/FN/TN in a styled 2x2 table.
- **MetricsTable**: Shows accuracy, positive rate, true positive rate, and profit.
- **ThresholdSlider**: Range input (0–100), calls `onChange` with new value.

### Styling

- Port styles from the original `custom.css`.
- Use class names, not inline styles, for reusable patterns.
- Keep the educational, clean look of the original.
- Validate buttons use a blue color scheme (`#3498db`).
- Editable cells have a light blue border (`#26a3e1`).

### Data Flow

- CSV files are in `public/data/` and fetched at runtime with `fetch()` + PapaParse.
- Data is loaded once per page via `useEffect` and stored in component state.
- Threshold changes trigger metric recalculation via `useMemo`.
- The fairness strategies page (Page 7) links two sliders: changing the radio option or Pinkville's threshold recomputes Greenfield's threshold.

### Code Style

- Functional components with hooks only (no class components).
- Named exports for components, default exports for pages.
- Keep utility functions pure — no DOM manipulation in `utils/`.
- Use `useCallback` and `useMemo` where computation is non-trivial.

## Pages (in order)

| # | Route          | Component              | Description                              |
|---|----------------|------------------------|------------------------------------------|
| 0 | `/`            | `Introduction.jsx`     | Welcome text, module overview            |
| 1 | `/loan-profit` | `LoanProfit.jsx`       | Credit math exercise with editable table |
| 2 | `/data-intro`  | `UnderstandingData.jsx`| Match datasets to dot plots              |
| 3 | `/dataset`     | `Dataset.jsx`          | Explore 400-person dataset with slider   |
| 4 | `/measures`    | `StatisticalMeasures.jsx` | Fixed threshold, confusion matrix     |
| 5 | `/threshold`   | `VariableThreshold.jsx`| Variable threshold with live metrics     |
| 6 | `/two-groups`  | `TwoPopulations.jsx`   | Reveal two population subgroups          |
| 7 | `/fair`        | `FairThresholds.jsx`   | Core fairness exploration with strategies|
| 8 | `/discussion`  | `Discussion.jsx`       | Wrap-up discussion prompts               |
