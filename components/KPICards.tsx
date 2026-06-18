"use client";

import {
  FolderOpen,
  DollarSign,
  ShieldAlert,
  Bell,
  TrendingUp,
  Cpu,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";

function fmt(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function KPICards() {
  const inv = useInvestigationData();

  const totalImpact = inv?.anomalies?.reduce((s, a) => s + (a.impact ?? 0), 0) ?? 0;
  const criticalCount = inv?.anomalies?.filter((a) => a.severity === "Critical").length ?? 0;

  const kpis = [
    {
      title: "Presupuesto Auditado",
      value: inv ? fmt(inv.project?.budget ?? 0) : "—",
      subtext: inv ? inv.projectName.slice(0, 28) : "Sin investigación activa",
      icon: <FolderOpen className="w-5 h-5" />,
      valueColor: "text-blue-300",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      cardBorder: "border-blue-500/25",
      cardBg: "bg-blue-950/40",
      topBarColor: "bg-blue-500",
    },
    {
      title: "Fondos en Riesgo",
      value: inv && totalImpact > 0 ? fmt(totalImpact) : "—",
      subtext: inv ? "impacto acumulado de anomalías" : "Sin investigación activa",
      icon: <DollarSign className="w-5 h-5" />,
      valueColor: "text-emerald-300",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      cardBorder: "border-emerald-500/25",
      cardBg: "bg-emerald-950/40",
      topBarColor: "bg-emerald-500",
    },
    {
      title: "Anomalías Detectadas",
      value: inv ? String(inv.anomalies?.length ?? 0) : "—",
      growth: inv && (inv.anomalies?.length ?? 0) > 0 ? `${inv.anomalies.length} hallazgos` : undefined,
      growthPositive: false,
      subtext: inv ? "irregularidades encontradas" : "Sin investigación activa",
      icon: <ShieldAlert className="w-5 h-5" />,
      valueColor: "text-orange-300",
      iconBg: "bg-orange-500/20",
      iconColor: "text-orange-400",
      cardBorder: "border-orange-500/25",
      cardBg: "bg-orange-950/40",
      topBarColor: "bg-orange-500",
    },
    {
      title: "Alertas Críticas",
      value: inv ? String(criticalCount) : "—",
      subtext: inv ? "requieren acción inmediata" : "Sin investigación activa",
      icon: <Bell className="w-5 h-5" />,
      valueColor: criticalCount > 0 ? "text-red-300" : "text-slate-400",
      iconBg: "bg-red-500/20",
      iconColor: "text-red-400",
      cardBorder: criticalCount > 0 ? "border-red-500/30" : "border-white/8",
      cardBg: "bg-red-950/40",
      topBarColor: criticalCount > 0 ? "bg-red-500" : "bg-slate-700",
    },
    {
      title: "Contratos Analizados",
      value: inv ? String(inv.contracts?.length ?? 0) : "—",
      subtext: inv ? "contratos identificados" : "Sin investigación activa",
      icon: <TrendingUp className="w-5 h-5" />,
      valueColor: "text-emerald-300",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      cardBorder: "border-emerald-500/25",
      cardBg: "bg-emerald-950/40",
      topBarColor: "bg-emerald-400",
    },
    {
      title: "Nivel de Riesgo",
      value: inv ? `${inv.project?.risk ?? 0}/100` : "—",
      subtext: inv ? `estado: ${inv.project?.status ?? "—"}` : "Sin investigación activa",
      icon: <Cpu className="w-5 h-5" />,
      valueColor:
        !inv ? "text-slate-500"
        : (inv.project?.risk ?? 0) >= 70 ? "text-red-300"
        : (inv.project?.risk ?? 0) >= 50 ? "text-orange-300"
        : "text-cyan-300",
      iconBg: "bg-cyan-500/20",
      iconColor: "text-cyan-400",
      cardBorder: "border-cyan-500/25",
      cardBg: "bg-cyan-950/40",
      topBarColor: "bg-cyan-500",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.title}
            className={`relative rounded-xl overflow-hidden border ${kpi.cardBorder} ${kpi.cardBg} hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`h-0.5 w-full ${kpi.topBarColor} opacity-70`} />

            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${kpi.iconBg} ${kpi.iconColor}`}>
                  {kpi.icon}
                </div>
                {kpi.growth && (
                  <span
                    className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      kpi.growthPositive
                        ? "text-emerald-300 bg-emerald-500/15 border border-emerald-500/20"
                        : "text-orange-300 bg-orange-500/15 border border-orange-500/20"
                    }`}
                  >
                    {kpi.growthPositive ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {kpi.growth}
                  </span>
                )}
              </div>

              <p className={`text-2xl font-extrabold ${kpi.valueColor} leading-none mb-1.5`}>
                {kpi.value}
              </p>

              <p className="text-xs font-semibold text-slate-300 leading-snug mb-0.5">
                {kpi.title}
              </p>

              {kpi.subtext && (
                <p className="text-[10px] text-slate-500 truncate">{kpi.subtext}</p>
              )}
            </div>

            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl ring-1 ring-inset ${kpi.cardBorder}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
