"use client";
import { FileText, CheckCircle2, Clock, AlertTriangle, Sparkles } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

const riskColor = {
  low: "text-emerald-400 bg-emerald-500/10",
  medium: "text-yellow-400 bg-yellow-500/10",
  high: "text-red-400 bg-red-500/10",
};
const riskLabels: Record<string, string> = { low: "Bajo", medium: "Medio", high: "Alto" };
const statusIcon = {
  Active: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
  Review: <Clock className="w-3.5 h-3.5 text-yellow-400" />,
  Flagged: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
};
const statusLabels: Record<string, string> = { Active: "Activo", Review: "Revisión", Flagged: "Marcado" };

export default function ContractsPanel() {
  const inv = useInvestigationData();
  const contracts = inv?.contracts ?? [];

  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <FileText className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Contratos</h1>
        {inv && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            {inv.projectName}
          </span>
        )}
        {inv && (
          <span className="ml-auto text-xs text-slate-500">{contracts.length} contratos detectados</span>
        )}
      </div>

      {!inv || contracts.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#0d1117]">
          <EmptyInvestigation message="Investiga un proyecto para ver los contratos reales detectados por el agente." />
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 bg-[#0d1117] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8 text-left">
                <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Título</th>
                <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider hidden md:table-cell">Proveedor</th>
                <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Monto</th>
                <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, i) => (
                <tr key={c.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/1"}`}>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{c.id}</td>
                  <td className="px-4 py-3 text-xs text-slate-200 font-medium">{c.title}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">{c.vendor}</td>
                  <td className="px-4 py-3 text-xs text-blue-400 font-semibold">{c.value}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {statusIcon[c.status as keyof typeof statusIcon]}
                      <span className="text-xs text-slate-300">{statusLabels[c.status] ?? c.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${riskColor[c.risk as keyof typeof riskColor]}`}>
                      {riskLabels[c.risk] ?? c.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
