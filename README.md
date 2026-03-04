# Principal Action Dashboard (SCAN Summary Layer)

This is the SCAN-aligned Principal Dashboard with KPI drill-downs and regional/central views. It is a static HTML/CSS/JS site designed for GitHub Pages deployment and local viewing.

## How to Run
Open `index.html` in a browser. No server or build step required.

## Structure
- `index.html`: SCAN landing page with four KPI buckets and frequency filters.
- `drilldown-kpi.html`: Detailed KPI drill-down (all KPI cards link here).
- `regional-view.html`: Aggregated regional view with heatmap and tooltips.
- `central-view.html`: Aggregated central view with comparisons and tooltips.
- `principal-datastory.html`: Principal data story (updated to new KPIs).
- `principal-email-alert.html`: Principal alert email (updated to new KPIs).
- `Leaders-dashboard.html`: Portfolio overview (original style retained).
- `Leaders-datastory.html`: Portfolio briefing (original style retained).
- `Leaders-email-alert.html`: Leadership alert email (original style retained).
- `styles.css`: Shared styling (original School-Dashboard aesthetic).
- `js/scan_data.js`: Synthetic KPI data (20 KPIs).
- `js/app.js`: Rendering logic for cards, filters, and hover typing.

## Features Implemented
- Four SCAN buckets: Marketing Efficiency, School Proposition, School Performance, Talent/Capability.
- Weekly/Monthly/Annual/All frequency filter with badges on each KPI card.
- KPI cards with status, trend, explanation, and animated hover (Why + Action).
- Compliance highlighting for CBC Compliance and Safeguarding.
- Drill-down page with D3 charts (trend, period comparison, driver impact, segment breakdown, benchmark vs target).
- Regional and central views with tooltips for "Why" and "Proof".
- Responsive layout for tablet and mobile.

## Notes
- All values are synthetic and for demonstration only.
- The visual language and layout follow the original School-Dashboard aesthetic.
