"use client";

import { useEffect, useState } from "react";
import { Link2, CheckCircle2, Clock, ExternalLink, Fingerprint } from "lucide-react";
import EmptyInvestigation from "@/components/EmptyInvestigation";

interface BlockchainRecord {
  id: number;
  txHash: string;
  shortHash: string;
  project: string;
  title: string;
  sha256: string | null;
  blockNumber: number;
  status: "Verified" | "Pending";
  timestamp: string;
}

const statusConfig = {
  Verified: {
    label: "Verificado",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    style: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
  },
  Pending: {
    label: "Pendiente",
    icon: <Clock className="w-3.5 h-3.5" />,
    style: "text-yellow-400 bg-yellow-500/10 border-yellow-500/25",
  },
};

export default function BlockchainPanel() {
  const [records, setRecords] = useState<BlockchainRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blockchain/records", { cache: "no-store" })
      .then((r) => r.json())
      .then(({ records }) => setRecords(records ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const verifiedCount = records.filter((r) => r.status === "Verified").length;
  const verifiedPct   = records.length > 0 ? Math.round((verifiedCount / records.length) * 100) : 0;
  const lastBlock     = records.find((r) => r.blockNumber > 0)?.blockNumber;

  return (
    <section className="glass rounded-xl border border-blue-500/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-blue-500/10">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Registro de Auditoría Blockchain</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Documentos sellados en Syscoin NEVM — huellas SHA-256 inmutables
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span className="text-[11px] font-semibold text-cyan-400">Syscoin NEVM</span>
        </div>
      </div>

      {/* Records */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4 animate-spin" />
            Cargando registros...
          </div>
        </div>
      ) : records.length === 0 ? (
        <EmptyInvestigation message="Aún no hay documentos sellados en blockchain. Investiga un proyecto y sella los documentos desde el Agente Investigador." />
      ) : (
        <div className="divide-y divide-white/[0.04] flex-1 overflow-y-auto max-h-[420px]">
          {records.map((record, i) => {
            const sc = statusConfig[record.status];
            return (
              <div
                key={record.id}
                className="p-4 hover:bg-white/[0.025] transition-colors group animate-enter"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Tx hash row */}
                <div className="flex items-center justify-between mb-2">
                  <code className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {record.shortHash}
                  </code>
                  <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${sc.style}`}>
                    {sc.icon}
                    {sc.label}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-2">
                  <div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wide">Proyecto</span>
                    <p className="text-[11px] font-medium text-slate-300 truncate">{record.project}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 uppercase tracking-wide">Documento</span>
                    <p className="text-[11px] font-medium text-slate-300 truncate">{record.title}</p>
                  </div>
                  {record.sha256 && (
                    <div className="col-span-2">
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide">SHA-256</span>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{record.sha256.slice(0, 40)}…</p>
                    </div>
                  )}
                  {record.blockNumber > 0 && (
                    <div>
                      <span className="text-[10px] text-slate-600 uppercase tracking-wide">Bloque #</span>
                      <p className="text-[11px] font-mono text-slate-400">{record.blockNumber.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 font-mono">{record.timestamp}</span>
                  <div className="flex items-center gap-2">
                    {record.status === "Verified" && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                        <Fingerprint className="w-3 h-3" />
                        <span className="font-semibold">Sellado en Syscoin</span>
                      </div>
                    )}
                    <a
                      href={`https://explorer.syscoin.org/tx/${record.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats footer */}
      {records.length > 0 && (
        <div className="p-4 border-t border-blue-500/10">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-sm font-bold text-white">{records.length}</p>
              <p className="text-[10px] text-slate-500">Documentos Sellados</p>
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">{verifiedPct}%</p>
              <p className="text-[10px] text-slate-500">Verificados</p>
            </div>
            <div>
              <p className="text-sm font-bold text-cyan-400">
                {lastBlock ? lastBlock.toLocaleString() : "—"}
              </p>
              <p className="text-[10px] text-slate-500">Último Bloque</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
