"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Activity } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

// Genera evolución de riesgo semanal determinista a partir del puntaje final
function buildRiskTimeline(riskScore: number) {
  const factors = [0.18, 0.24, 0.31, 0.39, 0.46, 0.53, 0.61, 0.70, 0.78, 0.86, 0.93, 1.0];
  return factors.map((f, i) => ({
    week: `Sem ${i + 1}`,
    riesgo: Math.round(riskScore * f),
  }));
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 shadow-2xl border border-blue-500/20">
      <p className="text-xs font-semibold text-slate-300 mb-1">{label}</p>
      <p className="text-xs font-bold text-orange-400">
        Riesgo: {payload[0].value}<span className="text-slate-500 font-normal">/100</span>
      </p>
    </div>
  );
}

function riskColor(score: number) {
  if (score >= 70) return "#ef4444";
  if (score >= 50) return "#f97316";
  if (score >= 30) return "#eab308";
  return "#10b981";
}

export default function RiskAnalytics() {
  const inv = useInvestigationData();
  if (!inv?.project) {
    return (
      <section className="glass rounded-xl border border-blue-500/10 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Evolución del Riesgo</h2>
        </div>
        <EmptyInvestigation message="Investiga un proyecto para ver la evolución del riesgo de corrupción." />
      </section>
    );
  }

  const riskScore = inv.project.risk;
  const color = riskColor(riskScore);
  const chartData = buildRiskTimeline(riskScore);

  return (
    <section className="glass rounded-xl border border-blue-500/10 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Evolución del Riesgo de Corrupción</h2>
          </div>
          <p className="text-xs text-slate-500">
            {inv.projectName} — proyección de riesgo a 12 semanas
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <TrendingUp className="w-3.5 h-3.5" style={{ color }} />
          <span className="text-xs font-semibold" style={{ color }}>
            Riesgo actual: {riskScore}/100
          </span>
        </div>
      </div>

      {/* Anomaly severity summary */}
      {inv.anomalies?.length > 0 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          {(["Critical","High","Medium","Low"] as const).map((sev) => {
            const count = inv.anomalies.filter((a) => a.severity === sev).length;
            if (!count) return null;
            const cfg = {
              Critical: { label: "Crítico", cls: "text-red-400 bg-red-500/10 border-red-500/20" },
              High:     { label: "Alto",    cls: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
              Medium:   { label: "Medio",   cls: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" },
              Low:      { label: "Bajo",    cls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
            }[sev];
            return (
              <span key={sev} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
                {count} {cfg.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="grad-risk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="riesgo"
              stroke={color}
              strokeWidth={2.5}
              fill="url(#grad-risk)"
              dot={false}
              activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Anomalies breakdown */}
      {inv.anomalies?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Factores de Riesgo Detectados
          </p>
          <div className="space-y-2">
            {inv.anomalies.slice(0, 4).map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  a.severity === "Critical" ? "bg-red-500" :
                  a.severity === "High" ? "bg-orange-500" : "bg-yellow-500"
                }`} />
                <span className="text-[11px] text-slate-400 truncate flex-1">{a.title}</span>
                <span className="text-[10px] text-slate-600 flex-shrink-0">{a.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
