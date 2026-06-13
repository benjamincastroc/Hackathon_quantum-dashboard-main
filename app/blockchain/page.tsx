import BlockchainPanel from "@/components/BlockchainPanel";
import AgentTreasury from "@/components/AgentTreasury";

export default function BlockchainPage() {
  return (
    <>
      <div className="animate-enter">
        <h1 className="text-lg sm:text-xl font-bold text-white">Blockchain</h1>
        <p className="text-xs text-slate-500 mt-0.5">Documentos sellados en Syscoin NEVM — registro inmutable de auditoría</p>
      </div>
      <BlockchainPanel />
      <AgentTreasury />
    </>
  );
}
