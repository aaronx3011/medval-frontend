# MedVal Dashboard

A medical inventory & sales dashboard built with React, TypeScript, Tailwind CSS, Framer Motion, and MUI X Charts.

## Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — page & component animations
- **MUI X Charts** — LineChart, BarChart
- **Vite** — fast dev server & bundler
- **DM Sans** + **Sora** — Google Fonts

## Project Structure

```
src/
├── components/
│   ├── Icons.tsx            # All SVG icons + MedVal logo
│   ├── Sidebar.tsx          # Animated left navigation
│   ├── Topbar.tsx           # Search bar + bell + user
│   ├── Dashboard.tsx        # Main layout grid
│   ├── KpiRow.tsx           # 4 KPI summary cards
│   ├── DailyGoalsChart.tsx  # Line chart: meta mensual vs diarias
│   ├── TopClientsChart.tsx  # Bar chart: top 8 clients
│   ├── NotificationsPanel.tsx # Alerts table with badges
│   └── MonthlySalesChart.tsx  # Grouped bar: 2020/2021/2022
├── data/
│   └── mockData.ts          # All mock data constants
├── types/
│   └── index.ts             # Shared TypeScript interfaces
├── App.tsx                  # Root layout + nav state
├── main.tsx                 # React DOM entry point
└── index.css                # Tailwind directives + base styles
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Customization

- **Data**: Edit `src/data/mockData.ts` to swap in real API data or adjust mock values.
- **Colors**: Defined in `tailwind.config.ts` under `theme.extend.colors`. Primary brand colors:
  - Orange: `#e96c2a`
  - Navy: `#1a2a5e`
- **Animations**: Each component uses `framer-motion` variants. Adjust `delay`, `duration`, and spring config in individual component files.
- **Charts**: All charts are MUI X Charts (`@mui/x-charts`). See [MUI X Charts docs](https://mui.com/x/react-charts/) for advanced configuration.
