# Principal Action Dashboard (SCAN Summary Layer)

This is the Phase 1 implementation of the Principal Action Dashboard.

## 🚀 How to Run
Simply open `index.html` in your web browser. No server or build step required for this phase.

## 📂 Structure
- **`index.html`**: The main dashboard structure.
- **`css/style.css`**: Styling, including the "AI Hover" effects and responsive layout.
- **`js/scan_data.js`**: Contains the Mock Data (Phase 1) with 24 KPIs.
- **`js/app.js`**: Logic for rendering cards, calculating global health, and handling interactions.

## 🌟 Features Implemented
- **4 Key Sections**: Enrollments, FTES, Financials, School Performance.
- **24-Card Limit**: Strict 6 cards per section.
- **Visuals**: Clean, "Premium" aesthetics (Inter font, glassmorphism hovers).
- **War Room Integration**: Red status cards show a "WAR ROOM SUPPORT" tag.
- **AI Insight Layer**: Hover over any card to see "The Reason" and "Action Needed".
- **Global Health**: Top-right summary calculated from the red/green ratio.

## 🔜 Phase 2 Preparation
The code is modular. To upgrade to Phase 2:
1. Replace `js/scan_data.js` with an API call to your backend.
2. Update `js/app.js` to fetch data asynchronously (`async/await fetch()`).
3. Connect the "Action Needed" text to a real LLM generation endpoint.
