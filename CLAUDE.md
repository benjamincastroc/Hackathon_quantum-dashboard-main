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

## Architecture — Single-Page Section Switching

The app is a **single Next.js page** (`app/page.tsx`) that renders sections based on `activeSection` state. There is no Next.js routing between sections — navigation is handled client-side via `SectionContent` switch and the `Sidebar` component.

```
User clicks nav item → Sidebar calls onSectionChange(section) → page.tsx re-renders SectionContent
```

**`navItems`** is exported from `components/Sidebar.tsx` and consumed by `page.tsx` for the TopBar breadcrumb.

## File Structure
```
app/
├── globals.css        # Global styles, scrollbar, animations
├── globals.css.d.ts   # CSS module type declaration
├── layout.tsx         # Root layout — fonts, metadata, dark class
└── page.tsx           # Main dashboard (SectionContent switch + TopBar)

components/
├── Sidebar.tsx         # Left nav — exports navItems[], handles collapse & mobile
├── KPICards.tsx        # Top 6 metric cards with trends
├── RiskAnalytics.tsx   # Interactive risk evolution area chart
├── ProjectsTable.tsx   # Government projects with progress bars
├── AnomaliesPanel.tsx  # Detected corruption anomalies list
├── BlockchainPanel.tsx # Immutable blockchain audit trail (lazy-loaded, ssr:false)
├── AutonomousAgent.tsx # AI agent modules & live status
├── AIChatAssistant.tsx # ChatGPT-style audit assistant
├── AgentTreasury.tsx   # Economic sustainability model
├── SurvivalEngine.tsx  # 5-rule survival intelligence grid
├── ContractsPanel.tsx  # Government contracts table (ID, vendor, value, risk)
├── SuppliersPanel.tsx  # Supplier compliance scores — card grid
├── PaymentsPanel.tsx   # Payment transactions + disbursement stats
├── AlertsPanel.tsx     # System alerts with severity (critical/high/medium/info)
└── SettingsPanel.tsx   # Notifications, Security, Data & Privacy toggles

lib/
├── data.ts   # All mock data (projects, anomalies, blockchain, chat)
└── utils.ts  # cn(), formatCurrency(), getRiskColor()

global.d.ts        # Global TypeScript declarations
```

## Navigation Sections (navItems in Sidebar.tsx)
| Section key    | Label            | Badge        | Component(s) rendered            |
|----------------|------------------|--------------|----------------------------------|
| `dashboard`    | Dashboard        | —            | KPI, Risk, Projects, Anomalies, Blockchain, Agent, Chat, Survival, Treasury |
| `projects`     | Projects         | `124`        | KPI + ProjectsTable              |
| `contracts`    | Contracts        | —            | ContractsPanel                   |
| `suppliers`    | Suppliers        | —            | SuppliersPanel                   |
| `payments`     | Payments         | —            | PaymentsPanel                    |
| `risk`         | Risk Analysis    | —            | RiskAnalytics + Anomalies + Survival |
| `blockchain`   | Blockchain       | —            | BlockchainPanel + AgentTreasury  |
| `reports`      | Audit Reports    | —            | RiskAnalytics + Projects + Anomalies |
| `agent`        | Autonomous Agent | —            | AutonomousAgent + Chat + Treasury |
| `alerts`       | Alerts           | `3` (red)    | AlertsPanel                      |
| `settings`     | Settings         | —            | SettingsPanel                    |

## Adding a New Section
1. Create `components/MyPanel.tsx`
2. Add entry to `navItems` array in `components/Sidebar.tsx` (icon, label, section key)
3. Add `case "mysection": return <MyPanel />;` inside `SectionContent` in `app/page.tsx`
4. Import the component at the top of `app/page.tsx`

## Design System
| Token        | Value                          | Usage               |
|-------------|-------------------------------|---------------------|
| Background  | `#060711`                      | Page background     |
| Surface     | `#0a0c18`                      | Sidebar             |
| Card        | `#0d1117` + `border-white/8`   | Panel cards         |
| Glass card  | `rgba(16,18,32,0.8)` + `backdrop-blur` | Floating cards |
| Border      | `rgba(59,130,246,0.12)`        | Card borders        |
| Primary     | `#3b82f6`                      | Blue — main accent  |
| Cyan        | `#06b6d4`                      | Secondary accent    |
| Emerald     | `#10b981`                      | Success / healthy   |
| Orange      | `#f97316`                      | Warning / review    |
| Red         | `#ef4444`                      | Critical / danger   |
| Yellow      | `#eab308`                      | Medium risk         |
| Text        | `#f1f5f9`                      | Primary text        |
| Muted       | `#64748b`                      | Secondary text      |

## Adding New Mock Data
All mock data lives in `lib/data.ts`. New panels can define their own inline data arrays (see `ContractsPanel.tsx`, `PaymentsPanel.tsx`) or import from `lib/data.ts`.

## Notes
- `BlockchainPanel` is dynamically imported with `ssr: false` to avoid hydration issues.
- `Sidebar.tsx` exports both the default component and `navItems` (named export).
- The `src/` directory contains a legacy React/Vite structure — it is **not** the active app. The active app is entirely under `app/`, `components/`, and `lib/`.
- ESLint is configured via `.eslintrc.json`.
