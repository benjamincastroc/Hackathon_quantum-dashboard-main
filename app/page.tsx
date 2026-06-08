"use client";
 
import { useState } from "react";
import { Bell, Search, RefreshCw, Shield, Menu, X } from "lucide-react";
import Sidebar, { navItems } from "@/components/Sidebar";
import KPICards from "@/components/KPICards";
import RiskAnalytics from "@/components/RiskAnalytics";
import ProjectsTable from "@/components/ProjectsTable";
import AnomaliesPanel from "@/components/AnomaliesPanel";
import BlockchainPanel from "@/components/BlockchainPanel";
import AutonomousAgent from "@/components/AutonomousAgent";
import AIChatAssistant from "@/components/AIChatAssistant";
import AgentTreasury from "@/components/AgentTreasury";
import SurvivalEngine from "@/components/SurvivalEngine";
import ContractsPanel from "@/components/ContractsPanel";
import SuppliersPanel from "@/components/SuppliersPanel";
import PaymentsPanel from "@/components/PaymentsPanel";
import AlertsPanel from "@/components/AlertsPanel";
import SettingsPanel from "@/components/SettingsPanel";
 
interface TopBarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
  activeSection: string;
}
 
function TopBar({ sidebarOpen, onMenuToggle, activeSection }: TopBarProps) {
  const sectionLabel = navItems.find((n) => n.section === activeSection)?.label ?? "Dashboard";
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-blue-500/10 bg-[#060711]/90 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-200"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-500 hidden sm:block">/</span>
          <span className="text-xs font-semibold text-white">{sectionLabel}</span>
          <span className="text-[10px] text-slate-600 ml-1 hidden md:block">
            Last updated: 2 min ago
          </span>
        </div>
      </div>
 
      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-500 hover:border-white/20 transition-colors cursor-pointer w-44">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Search platform...</span>
          <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>
        <button className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="relative p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#060711]" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="ping-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-400">LIVE</span>
        </div>
      </div>
    </header>
  );
}
 
// ── Section renderer ─────────────────────────────────────────────────────────
function SectionContent({ section }: { section: string }) {
  switch (section) {
    case "dashboard":
      return (
        <>
          <div className="animate-enter">
            <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
              GovAnti-Corruption Solutions
              <span className="gradient-text-blue ml-2">AI</span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Autonomous monitoring — 124 projects · $38.4M audited · Q1 2024
            </p>
          </div>
          <KPICards />
          <RiskAnalytics />
          <ProjectsTable />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <AnomaliesPanel />
            <BlockchainPanel />
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <AutonomousAgent />
            <AIChatAssistant />
          </div>
          <SurvivalEngine />
          <AgentTreasury />
        </>
      );
    case "projects":
      return (
        <>
          <div className="animate-enter">
            <h1 className="text-lg sm:text-xl font-bold text-white">Projects</h1>
            <p className="text-xs text-slate-500 mt-0.5">124 active projects under monitoring</p>
          </div>
          <KPICards />
          <ProjectsTable />
        </>
      );
    case "contracts":
      return <ContractsPanel />;
    case "suppliers":
      return <SuppliersPanel />;
    case "payments":
      return <PaymentsPanel />;
    case "risk":
      return (
        <>
          <div className="animate-enter">
            <h1 className="text-lg sm:text-xl font-bold text-white">Risk Analysis</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI-powered risk scoring and anomaly detection</p>
          </div>
          <RiskAnalytics />
          <AnomaliesPanel />
          <SurvivalEngine />
        </>
      );
    case "blockchain":
      return (
        <>
          <div className="animate-enter">
            <h1 className="text-lg sm:text-xl font-bold text-white">Blockchain Ledger</h1>
            <p className="text-xs text-slate-500 mt-0.5">Immutable audit trail and transaction verification</p>
          </div>
          <BlockchainPanel />
          <AgentTreasury />
        </>
      );
    case "reports":
      return (
        <>
          <div className="animate-enter">
            <h1 className="text-lg sm:text-xl font-bold text-white">Audit Reports</h1>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive audit documentation and findings</p>
          </div>
          <RiskAnalytics />
          <ProjectsTable />
          <AnomaliesPanel />
        </>
      );
    case "agent":
      return (
        <>
          <div className="animate-enter">
            <h1 className="text-lg sm:text-xl font-bold text-white">Autonomous Agent</h1>
            <p className="text-xs text-slate-500 mt-0.5">AI agent monitoring and decision log</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <AutonomousAgent />
            <AIChatAssistant />
          </div>
          <AgentTreasury />
        </>
      );
    case "alerts":
      return <AlertsPanel />;
    case "settings":
      return <SettingsPanel />;
    default:
      return null;
  }
}
 
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
 
  return (
    <div className="flex h-screen bg-[#060711] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
 
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
 
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          activeSection={activeSection}
        />
 
        <main className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-5 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
            <SectionContent section={activeSection} />
 
            <div className="py-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-slate-600">
              <p>GovAI v3.2 — Autonomous Anti-Corruption Platform</p>
              <div className="flex flex-wrap items-center gap-3">
                <span>Security: AES-256</span>
                <span>Blockchain: Verified</span>
                <span className="text-emerald-500">● All Systems Operational</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}