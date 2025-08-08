# Air Quality NYC — Interactive Explorer (React + Vite)

An interactive web app to explore New York City air quality metrics over time. Users can select an indicator (e.g., NO2, O3, PM2.5), geographic type (e.g., Citywide, Borough), and place to visualize trends and see the latest values. Built with React, Vite, and Recharts.

## Features

-   Interactive controls
    -   Indicator, Geo Type, and Place selectors
    -   Icons in labels and a dropdown caret on selects to signal interactivity
-   Time series visualization
    -   Responsive Recharts line chart
    -   Brush for quick zooming across the time range
    -   Automatically resets to full range when changing selections
-   Latest data table
    -   Shows the most recent rows for the selected series
-   Theming and styling
    -   Smooth non-repeating background gradient tuned for dark theme
    -   Custom scrollbar (Firefox + WebKit)
    -   Responsive layout with container-based width control

## Quick start

Prerequisites:

-   Node.js >= 18
-   npm >= 8

Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

Open the app (Vite default):

-   http://localhost:5173

Build for production:

```
npm run build
```

Preview the production build locally:

```
npm run preview
```

## Data

-   Source: NYC Open Data (packaged locally for the demo)
-   File: `AirQualityNYC.json` (at the project root)
-   The app expects records that include fields similar to:
    -   `name`: indicator name (e.g., "Ozone (O3)")
    -   `geo_type_name`: geography type (e.g., "Citywide", "Borough")
    -   `geo_place_name`: place name
    -   `data_value`: numeric value to plot
    -   `measure`: measurement label
    -   `measure_info`: measurement unit
    -   `ts`: timestamp in epoch milliseconds (used on the X-axis)
    -   `time_period`: human-readable label for the tooltip

The `useAirQuality` hook (in `src/hooks/useAirQuality`) parses the dataset and prepares the unique lists of indicators, geo types, and places. You can replace `AirQualityNYC.json` with your own dataset as long as the required fields are present.

## Project structure (key files)

-   `src/App.jsx` — main application shell and layout
-   `src/App.css` — global styles (background gradient, scrollbar, layout, controls)
-   `src/components/Hero.jsx` — header/summary section
-   `src/components/Controls.jsx` — indicator/geo type/place selectors (with icons)
-   `src/components/TimeSeriesChart.jsx` — Recharts time series visualization
-   `src/components/LatestTable.jsx` — latest data table
-   `src/components/AboutCard.jsx` — additional context and notes
-   `src/hooks/useAirQuality.js` — data loading and transformation

## How it works

1. Data is loaded and memoized with `useAirQuality`.
2. The app derives the available places for the selected indicator + geo type.
3. A filtered, time-sorted array is passed to the chart and table.
4. The chart uses Recharts with an X-axis keyed on `ts` (timestamps) and a Y-axis on `data_value`.
5. When the user changes selections, the chart remounts and the Brush is reset to show the full range of data.

## Customization

You can adapt the app quickly by tweaking these spots:

-   Chart sizing
    -   Height: `src/components/TimeSeriesChart.jsx` ResponsiveContainer `height={...}` and `.chart-wrapper` in `src/App.css`
    -   Width: the chart fills the width of its container. If you add a `max-width` to `.container`, that will cap the chart width. Remove or raise it to allow a wider chart.
-   Indicator colors
    -   `src/App.jsx` contains a palette mapping indicator names to colors. Update to your preference.
-   Dropdown caret and label icons
    -   The select caret icon is handled in `src/App.css` via the `select` rule (background-image).
    -   Label icons are inline SVGs in `src/components/Controls.jsx`. You can swap these for your preferred icons.
-   Background
    -   The body background uses a smooth, multi-stop radial gradient to avoid hard edges: see `src/App.css`.
-   Custom scrollbar
    -   Implemented in `src/App.css` for Firefox and WebKit browsers.

## Scripts

-   `dev`: start Vite dev server
-   `build`: production build
-   `preview`: preview production build

See `package.json` for the full list of scripts.

## Deployment

This is a static site after build, so you can deploy the `dist/` folder to any static host:

-   Netlify
-   Vercel
-   GitHub Pages
-   S3/CloudFront, etc.

For GitHub Pages, you may need to set a `base` in `vite.config.js` if deploying under a subpath.

## Accessibility notes

-   Form labels are associated with inputs using `htmlFor`.
-   Decorative label icons use `aria-hidden="true"`.
-   Colors are chosen for contrast in a dark theme; adjust to meet your contrast targets if you change the palette.

## Credits

-   Data NYC Open Data (https://data.cityofnewyork.us/Environment/Air-Quality/c3uy-2p5r/about_data)
-   Built with:
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [Recharts](https://recharts.org/en-US/)

## License

Add a license for your project (e.g., MIT) if you plan to share or open-source this code.
