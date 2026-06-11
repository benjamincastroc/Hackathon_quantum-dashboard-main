"use client";

import { Link2, CheckCircle2, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { blockchainRecords } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const statusConfig = {
  Verified: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  Flagged: {
    icon: <AlertCircle className="w-3.5 h-3.5" />,
    style: "text-red-400 bg-red-500/10 border-red-500/25",
    dot: "bg-red-400 animate-pulse",
  },
  Pending: {
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25",
    dot: "bg-yellow-400",
  },
};

export default function BlockchainPanel() {
  return (
    <section className="glass rounded-xl border border-blue-500/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-blue-500/10">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Registro de Auditoría Blockchain</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Registros inmutables — libro contable a prueba de manipulaciones</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[11px] font-semibold text-cyan-400">Cadena Activa</span>
        </div>
      </div>

      {/* Records */}
      <div className="divide-y divide-white/[0.04] flex-1 overflow-y-auto max-h-[420px]">
        {blockchainRecords.map((record, i) => {
          const sc = statusConfig[record.status];
          return (
            <div
              key={record.id}
              className="p-4 hover:bg-white/[0.025] transition-colors group animate-enter"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Hash row */}
              <div className="flex items-center justify-between mb-2">
                <code className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {record.shortHash}
                </code>
                <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sc.style}`}>
                  {sc.icon}
                  {record.status}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                <div>
                  <span className="text-[10px] text-slate-600 uppercase tracking-wide">Proyecto</span>
                  <p className="text-[11px] font-medium text-slate-300 truncate">{record.project}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase tracking-wide">Acción</span>
                  <p className="text-[11px] font-medium text-slate-300">{record.action}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase tracking-wide">Monto</span>
                  <p className={`text-[11px] font-bold ${record.amount > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                    {record.amount > 0 ? formatCurrency(record.amount) : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-600 uppercase tracking-wide">Bloque #</span>
                  <p className="text-[11px] font-mono text-slate-400">{record.blockNumber.toLocaleString()}</p>
                </div>
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600 font-mono">{record.timestamp}</span>
                {record.status === "Verified" && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="font-semibold">Verificado en Blockchain</span>
                  </div>
                )}
                {record.status === "Flagged" && (
                  <div className="flex items-center gap-1 text-[10px] text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    <span className="font-semibold">Fraude Sospechado</span>
                  </div>
                )}
                <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chain stats footer */}
      <div className="p-4 border-t border-blue-500/10">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-sm font-bold text-white">1,247</p>
            <p className="text-[10px] text-slate-500">Total Registros</p>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-400">98.7%</p>
            <p className="text-[10px] text-slate-500">Verificados</p>
          </div>
          <div>
            <p className="text-sm font-bold text-cyan-400">18.4M</p>
            <p className="text-[10px] text-slate-500">Último Bloque</p>
          </div>
        </div>
      </div>
    </section>
  );
}
