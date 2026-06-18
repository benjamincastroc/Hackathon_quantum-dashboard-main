# GovWatch AI — GovAnti-Corruption Solutions AI

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue.svg)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)

GovWatch AI is a premium anti-corruption monitoring dashboard for governments, auditors, and transparency organizations. It combines intelligent risk analytics, blockchain auditing, anomaly detection, and autonomous auditing agents in a sleek, responsive interface.

---

## 🚀 Project Overview

This repository contains a Next.js 14 app built with React, TypeScript, Tailwind CSS, Recharts, and `lucide-react` icons.

Key capabilities include:

- AI-powered audit assistant and autonomous agent modules
- Interactive corruption risk analytics and anomaly insights
- Blockchain verification panel for immutable project trails
- KPI dashboards and project monitoring at a glance
- Responsive dark mode UI with glassmorphism styling

---

## 🏗️ Tech Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **lucide-react**

---

## ⚙️ Dev Commands

```bash
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### 3. Build for production

```bash
npm run build
```

### 4. Run production build locally

```bash
npm run start
```

---

## 📁 Project Structure

```text
app/
├── globals.css        # Global styles and theme setup
├── layout.tsx         # Root layout and custom fonts
└── page.tsx           # Main dashboard page

components/
├── AgentTreasury.tsx  # Economic sustainability model
├── AIChatAssistant.tsx # Audit assistant chat module
├── AnomaliesPanel.tsx # Corruption anomaly list
├── AutonomousAgent.tsx # Autonomous AI agent dashboard
├── BlockchainPanel.tsx # Immutable blockchain audit view
├── KPICards.tsx       # Metric card grid
├── ProjectsTable.tsx  # Government project monitoring table
├── RiskAnalytics.tsx  # Risk evolution chart
├── Sidebar.tsx        # App navigation
└── SurvivalEngine.tsx # Survival intelligence grid

lib/
├── data.ts            # Mock data for charts and panels
└── utils.ts           # Helpers and formatting utilities
```

---

## 📌 Notes

- The app uses **Next.js App Router** and is configured for static generation where possible.
- ESLint is configured and currently passing after recent fixes.
- The `.next` build output is ignored and not tracked in Git.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to your fork (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
