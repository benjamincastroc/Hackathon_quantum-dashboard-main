# GovWatch AI — GovAnti-Corruption Solutions AI

## Overview
Premium enterprise SaaS platform for government anti-corruption monitoring. Combines autonomous AI agents, blockchain verification, continuous auditing, risk detection, and public project monitoring.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18 + TypeScript
- **Styling**: Tailwind CSS — dark theme, glassmorphism
- **Charts**: Recharts (AreaChart, PieChart, BarChart)
- **Icons**: lucide-react

## Dev Commands
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## File Structure
```
app/
├── globals.css        # Global styles, scrollbar, animations
├── layout.tsx         # Root layout — fonts, metadata, dark class
└── page.tsx           # Main dashboard page (client component)

components/
├── Sidebar.tsx         # Left navigation with icons & user section
├── KPICards.tsx        # Top 6 metric cards with trends
├── RiskAnalytics.tsx   # Interactive risk evolution area chart
├── ProjectsTable.tsx   # Government projects with progress bars
├── AnomaliesPanel.tsx  # Detected corruption anomalies list
├── BlockchainPanel.tsx # Immutable blockchain audit trail
├── AutonomousAgent.tsx # AI agent modules & live status
├── AIChatAssistant.tsx # ChatGPT-style audit assistant
├── AgentTreasury.tsx   # Economic sustainability model
└── SurvivalEngine.tsx  # 5-rule survival intelligence grid

lib/
├── data.ts   # All mock data (projects, anomalies, blockchain, chat)
└── utils.ts  # cn(), formatCurrency(), getRiskColor()
```

## Design System
| Token        | Value     | Usage                        |
|-------------|-----------|------------------------------|
| Background  | `#060711` | Page background              |
| Surface     | `#0d0f1a` | Sidebar, cards               |
| Card        | `rgba(16,18,32,0.8)` + `backdrop-blur` | Glass cards |
| Border      | `rgba(59,130,246,0.12)` | Card borders    |
| Primary     | `#3b82f6` | Blue — main accent           |
| Cyan        | `#06b6d4` | Secondary accent             |
| Emerald     | `#10b981` | Success / healthy            |
| Orange      | `#f97316` | Warning / review             |
| Red         | `#ef4444` | Critical / danger            |
| Text        | `#f1f5f9` | Primary text                 |
| Muted       | `#64748b` | Secondary text               |

## Adding New Pages
1. Create `app/<page>/page.tsx`
2. Add nav item to `components/Sidebar.tsx` `navItems` array with icon + label + href

## Adding New Chart Data
All mock data lives in `lib/data.ts`. Update arrays there — components import directly.
