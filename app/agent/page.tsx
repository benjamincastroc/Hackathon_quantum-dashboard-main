import AutonomousAgent from "@/components/AutonomousAgent";
import AIChatAssistant from "@/components/AIChatAssistant";
import AgentTreasury from "@/components/AgentTreasury";

export default function AgentPage() {
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
}
