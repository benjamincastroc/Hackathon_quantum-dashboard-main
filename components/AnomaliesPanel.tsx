"use client";

import { AlertTriangle, DollarSign, Calendar, Tag, ChevronRight, Sparkles } from "lucide-react";
import { formatCurrency, getSeverityStyles } from "@/lib/utils";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

const typeIcons: Record<string, string> = {
  Financial: "💰",
  Procurement: "📋",
  Execution: "🏗️",
  Compliance: "⚖️",
  Supplier: "🏢",
};

const typeColors: Record<string, string> = {
  Financial: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Procurement: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Execution: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Compliance: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  Supplier: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const severityLabels: Record<string, string> = {
  Critical: "Crítico",
  High: "Alto",
  Medium: "Medio",
  Low: "Bajo",
};

const typeLabels: Record<string, string> = {
  Financial: "Financiero",
  Procurement: "Adquisición",
  Execution: "Ejecución",
  Compliance: "Cumplimiento",
  Supplier: "Proveedor",
};

export default function AnomaliesPanel() {
  const inv = useInvestigationData();
  const anomalies = inv?.anomalies ?? [];

  return (
    <section className="glass rounded-xl border border-blue-500/10 flex flex-col">
      <div className="flex items-center justify-between p-5 border-b border-blue-500/10">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold text-white">Anomalías Detectadas</h2>
            {inv && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                {inv.projectName}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {inv ? `${anomalies.length} alertas activas que requieren revisión` : "Sin investigación activa"}
          </p>
        </div>
        {inv && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-orange-400">Detección en Vivo</span>
          </div>
        )}
      </div>

      {!inv || anomalies.length === 0 ? (
        <EmptyInvestigation message="Investiga un proyecto para detectar anomalías e irregularidades reales." />
      ) : (
        <>
          <div className="divide-y divide-white/[0.04] flex-1 overflow-y-auto max-h-[420px]">
            {anomalies.map((anomaly, i) => (
              <div
                key={anomaly.id}
                className="p-4 hover:bg-white/[0.025] transition-colors group animate-enter"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 w-1 h-full min-h-[48px] rounded-full flex-shrink-0 ${
                      anomaly.severity === "Critical"
                        ? "bg-red-500"
                        : anomaly.severity === "High"
                        ? "bg-orange-500"
                        : "bg-yellow-500"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-xs font-bold text-slate-200 leading-snug">{anomaly.title}</p>
                      <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSeverityStyles(anomaly.severity)}`}>
                        {severityLabels[anomaly.severity] ?? anomaly.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-snug mb-2 line-clamp-2">
                      {anomaly.description}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Tag className="w-3 h-3" />
                        {anomaly.project}
                      </span>

                      <span className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded border ${typeColors[anomaly.type]}`}>
                        <span>{typeIcons[anomaly.type]}</span>
                        {typeLabels[anomaly.type] ?? anomaly.type}
                      </span>

                      <span className="flex items-center gap-1 text-[10px] text-slate-600">
                        <Calendar className="w-3 h-3" />
                        {anomaly.date}
                      </span>

                      {anomaly.impact > 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-red-400 ml-auto">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(anomaly.impact)} en riesgo
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-slate-500 flex-shrink-0 mt-1 transition-colors" />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-blue-500/10">
            <button className="w-full text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center justify-center gap-1.5 py-1">
              Ver Todas las Anomalías
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
