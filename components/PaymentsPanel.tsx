"use client";
import { CreditCard, ArrowUpRight, ArrowDownRight, Clock, Sparkles } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

const statusStyles: Record<string, string> = {
  Completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Flagged: "text-red-400 bg-red-500/10 border-red-500/20 animate-pulse",
};
const statusLabels: Record<string, string> = {
  Completed: "Completado",
  Pending: "Pendiente",
  Flagged: "Marcado",
};

export default function PaymentsPanel() {
  const inv = useInvestigationData();
  const payments = inv?.payments ?? [];

  const flaggedCount = payments.filter((p) => p.status === "Flagged").length;
  const pendingCount = payments.filter((p) => p.status === "Pending").length;

  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <CreditCard className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Pagos</h1>
        {inv && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
            <Sparkles className="w-2.5 h-2.5" />
            {inv.projectName}
          </span>
        )}
      </div>

      {!inv || payments.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#0d1117]">
          <EmptyInvestigation message="Investiga un proyecto para ver las transacciones y pagos detectados." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total Transacciones", value: String(payments.length), icon: ArrowUpRight, color: "text-blue-400" },
              { label: "Pendientes", value: String(pendingCount), icon: Clock, color: "text-yellow-400" },
              { label: "Marcados", value: String(flaggedCount), icon: ArrowDownRight, color: "text-red-400" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/8 bg-[#0d1117] p-4">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-white/8 bg-[#0d1117] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/8">
              <p className="text-xs font-semibold text-slate-300">Transacciones Detectadas</p>
            </div>
            <div className="divide-y divide-white/5">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-200">{p.vendor}</p>
                      <p className="text-[11px] text-slate-500">{p.id} · {p.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-white">{p.amount}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[p.status]}`}>
                      {statusLabels[p.status] ?? p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
