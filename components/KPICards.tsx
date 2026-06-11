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

interface KPI {
  title: string;
  value: string;
  growth?: string;
  growthPositive?: boolean;
  subtext?: string;
  icon: React.ReactNode;
  valueColor: string;
  iconBg: string;
  iconColor: string;
  cardBorder: string;
  cardBg: string;
  topBarColor: string;
}

const kpis: KPI[] = [
  {
    title: "Proyectos Monitoreados",
    value: "124",
    growth: "+14.2%",
    growthPositive: true,
    subtext: "vs trimestre anterior",
    icon: <FolderOpen className="w-5 h-5" />,
    valueColor: "text-blue-300",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
    cardBorder: "border-blue-500/25",
    cardBg: "bg-blue-950/40",
    topBarColor: "bg-blue-500",
  },
  {
    title: "Fondos Públicos Auditados",
    value: "$38.4M",
    growth: "+21%",
    growthPositive: true,
    subtext: "total monitoreado",
    icon: <DollarSign className="w-5 h-5" />,
    valueColor: "text-emerald-300",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    cardBorder: "border-emerald-500/25",
    cardBg: "bg-emerald-950/40",
    topBarColor: "bg-emerald-500",
  },
  {
    title: "Riesgos de Corrupción",
    value: "17",
    growth: "+8%",
    growthPositive: false,
    subtext: "investigaciones activas",
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
    value: "3",
    subtext: "acción inmediata requerida",
    icon: <Bell className="w-5 h-5" />,
    valueColor: "text-red-300",
    iconBg: "bg-red-500/20",
    iconColor: "text-red-400",
    cardBorder: "border-red-500/30",
    cardBg: "bg-red-950/40",
    topBarColor: "bg-red-500",
  },
  {
    title: "Fraude Prevenido",
    value: "$4.8M",
    growth: "+32%",
    growthPositive: true,
    subtext: "ahorro T1 2024",
    icon: <TrendingUp className="w-5 h-5" />,
    valueColor: "text-emerald-300",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    cardBorder: "border-emerald-500/25",
    cardBg: "bg-emerald-950/40",
    topBarColor: "bg-emerald-400",
  },
  {
    title: "Confianza del Agente",
    value: "92%",
    growth: "+2.1%",
    growthPositive: true,
    subtext: "precisión de detección",
    icon: <Cpu className="w-5 h-5" />,
    valueColor: "text-cyan-300",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    cardBorder: "border-cyan-500/25",
    cardBg: "bg-cyan-950/40",
    topBarColor: "bg-cyan-500",
  },
];

export default function KPICards() {
  return (
    <section>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.title}
            className={`relative rounded-xl overflow-hidden border ${kpi.cardBorder} ${kpi.cardBg} hover:-translate-y-1 transition-all duration-300 cursor-pointer group`}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            {/* Top accent bar */}
            <div className={`h-0.5 w-full ${kpi.topBarColor} opacity-70`} />

            <div className="p-4">
              {/* Icon row */}
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

              {/* Value */}
              <p className={`text-2xl font-extrabold ${kpi.valueColor} leading-none mb-1.5`}>
                {kpi.value}
              </p>

              {/* Title */}
              <p className="text-xs font-semibold text-slate-300 leading-snug mb-0.5">
                {kpi.title}
              </p>

              {/* Subtext */}
              {kpi.subtext && (
                <p className="text-[10px] text-slate-500">{kpi.subtext}</p>
              )}
            </div>

            {/* Hover glow */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl ring-1 ring-inset ${kpi.cardBorder}`} />
          </div>
        ))}
      </div>
    </section>
  );
}
