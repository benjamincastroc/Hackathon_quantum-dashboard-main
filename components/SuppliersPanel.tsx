"use client";
import { Building2, TrendingUp, TrendingDown, Sparkles } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

export default function SuppliersPanel() {
  const inv = useInvestigationData();
  const suppliers = inv?.suppliers ?? [];

  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Building2 className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Proveedores</h1>
        {inv && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            {inv.projectName}
          </span>
        )}
        {inv && (
          <span className="ml-auto text-xs text-slate-500">{suppliers.length} proveedores detectados</span>
        )}
      </div>

      {!inv || suppliers.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#0d1117]">
          <EmptyInvestigation message="Investiga un proyecto para ver los proveedores y empresas involucradas." />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {suppliers.map((s) => (
            <div key={s.name} className="rounded-xl border border-white/8 bg-[#0d1117] p-4 hover:border-blue-500/20 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-white">{s.name}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  {s.trend === "up"
                    ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Puntuación de Cumplimiento</span>
                  <span className={`font-semibold ${s.score >= 80 ? "text-emerald-400" : s.score >= 65 ? "text-yellow-400" : "text-red-400"}`}>
                    {s.score}%
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${s.score >= 80 ? "bg-emerald-500" : s.score >= 65 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${s.score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>{s.contracts} contratos</span>
                  <span className="text-blue-400 font-medium">{s.totalValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
