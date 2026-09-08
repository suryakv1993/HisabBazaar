# HisabBazaar

A modern financial utility platform for Indian e-commerce sellers. Calculate your real profit on Flipkart, Amazon, Meesho, Shopify and D2C channels — accounting for marketplace commissions, fees, shipping, payment gateway charges, and Indian GST (inclusive/exclusive).

## Features

- **Profit Calculator** — per-product break-even, profit margin, ROI, and bank settlement (payout) after every marketplace fee and 18% GST on services.
- **GST Calculator** — GST inclusive/exclusive conversion across 0%, 5%, 12%, 18% and 28% slabs.
- **Marketplace Fee & Payout Matrix** — close-up view of commissions, closing fees, shipping and settlement for major marketplaces, with a custom-profile option.
- **Product Catalog** — save products with margin tracking and edit/delete management.
- **Reports & Export** — business insights, branded shareable reports, JSON/CSV export for backup.
- **Calculation History** — full local history of past estimates.
- **On-device data** — everything is stored in your browser's local storage; no account required.
- **Premium / Pro** — in-app upgrade flow (Go Pro).
- **Routing** — hash-based routes with deep-linking, back/forward support, and a responsive footer with legal pages (About, Privacy, Terms, Contact).

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [lucide-react](https://lucide.dev/) icons
- Chart rendering via lightweight SVG micro-charts

## Getting Started

**Prerequisites:** Node.js 20+

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app runs entirely in the browser with local storage — no API key or backend required.

## Scripts

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Start the Vite development server  |
| `npm run build`       | Build the production bundle (dist) |
| `npm run preview`     | Preview the production build       |
| `npm run typecheck`   | Run TypeScript type checking       |

## Project Structure

```
src/
  components/    Reusable UI (Header, Footer, BottomNav, charts, modals, ...)
  context/       AppContext (routing, settings, data persistence)
  screens/       Feature screens (calculators, catalog, reports, settings, legal)
  utils/         Domain logic & calculations
  types.ts       Shared TypeScript types
```

## Data & Privacy

All product, settings and history data is stored locally in your browser using local storage. No personal or business data is uploaded to any server. Use **Settings → Data Management** to export a JSON backup or reset the app.

See the in-app **Privacy Policy** and **Terms of Service** pages for full details.

## License

© HisabBazaar. All rights reserved.
