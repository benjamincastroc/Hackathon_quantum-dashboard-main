import KPICards from "@/components/KPICards";
import RiskAnalytics from "@/components/RiskAnalytics";
import ProjectsTable from "@/components/ProjectsTable";
import AnomaliesPanel from "@/components/AnomaliesPanel";
import BlockchainPanel from "@/components/BlockchainPanel";
import AutonomousAgent from "@/components/AutonomousAgent";
import AIChatAssistant from "@/components/AIChatAssistant";
import AgentTreasury from "@/components/AgentTreasury";
import SurvivalEngine from "@/components/SurvivalEngine";

export default function DashboardPage() {
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
}
