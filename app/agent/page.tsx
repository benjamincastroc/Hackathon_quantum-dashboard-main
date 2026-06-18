import AutonomousAgent from "@/components/AutonomousAgent";
import AIChatAssistant from "@/components/AIChatAssistant";
import AgentTreasury from "@/components/AgentTreasury";
import InvestigatorAgent from "@/components/InvestigatorAgent";

export default function AgentPage() {
  return (
    <>
      <div className="animate-enter">
        <h1 className="text-lg sm:text-xl font-bold text-white">Agente Autónomo</h1>
        <p className="text-xs text-slate-500 mt-0.5">Investigación autónoma con IA y monitoreo en tiempo real</p>
      </div>

      {/* Investigator Agent — full width, hero position */}
      <InvestigatorAgent />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <AutonomousAgent />
        <AIChatAssistant />
      </div>
      <AgentTreasury />
    </>
  );
}
