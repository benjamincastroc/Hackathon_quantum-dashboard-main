"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Vault, TrendingUp, DollarSign, Clock, Zap, BarChart3, Sparkles } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

const MONTHLY_COST   = 420;
const COST_PER_AUDIT = 0.18;
const RUNWAY_MONTHS  = 48;

const LAYERS = [
  { name: "Capa de Reserva",     percentage: 72, color: "#3b82f6", purpose: "Garantizar la supervivencia a largo plazo y la continuidad operativa" },
  { name: "Capa de Ingresos",    percentage: 23, color: "#10b981", purpose: "Sostener auditorías continuas y monitoreo autónomo" },
  { name: "Capa Experimental",   percentage: 5,  color: "#8b5cf6", purpose: "Investigación, innovación y mejora de detección de anomalías" },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: typeof LAYERS[0] }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl p-3 border border-blue-500/20 min-w-[180px]">
      <p className="text-xs font-bold mb-1" style={{ color: d.color }}>{d.name}</p>
      <p className="text-lg font-bold text-white">{d.percentage}%</p>
      <p className="text-[10px] text-slate-500 mt-1 leading-snug">{d.purpose}</p>
    </div>
  );
}

export default function AgentTreasury() {
  const inv = useInvestigationData();

  if (!inv) {
    return (
      <section className="glass rounded-xl border border-blue-500/10 p-5">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Vault className="w-4 h-4 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Tesorería del Agente y Sostenibilidad</h2>
            <p className="text-xs text-slate-500">Economía operativa autónoma</p>
          </div>
        </div>
        <EmptyInvestigation message="Investiga un proyecto para calcular el ROI y el impacto económico real de la auditoría." />
      </section>
    );
  }

  const totalImpact = inv.anomalies?.reduce((s, a) => s + (a.impact ?? 0), 0) ?? 0;
  const roi         = totalImpact > 0 ? Math.round(totalImpact / MONTHLY_COST) : 0;
  const totalReserves = Math.round(MONTHLY_COST * RUNWAY_MONTHS);
  const layersWithAmount = LAYERS.map((l) => ({
    ...l,
    amount: Math.round((totalReserves * l.percentage) / 100),
  }));

  const metrics = [
    {
      icon: <DollarSign className="w-3.5 h-3.5 text-blue-400" />,
      label: "Costo Operativo Mensual",
      value: `$${MONTHLY_COST}`,
      sub: "por mes",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />,
      label: "Costo por Auditoría",
      value: `$${COST_PER_AUDIT}`,
      sub: "por análisis",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
      label: "Fondos en Riesgo Detectados",
      value: totalImpact > 0 ? fmt(totalImpact) : "—",
      sub: inv.projectName.slice(0, 22),
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      icon: <Clock className="w-3.5 h-3.5 text-purple-400" />,
      label: "Autonomía",
      value: `${RUNWAY_MONTHS} mes`,
      sub: "al ritmo actual",
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <section className="glass rounded-xl border border-blue-500/10 p-5">
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <div className="p-2 rounded-lg bg-yellow-500/10">
          <Vault className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Tesorería del Agente y Sostenibilidad</h2>
          <p className="text-xs text-slate-500">Economía operativa autónoma — estructura de capital en 3 capas</p>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-auto">
          <Sparkles className="w-2.5 h-2.5" />
          {inv.projectName.slice(0, 30)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Donut chart */}
        <div className="flex flex-col items-center">
          <div className="relative h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={layersWithAmount}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="percentage"
                  stroke="none"
                >
                  {layersWithAmount.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-white">${(totalReserves / 1000).toFixed(0)}K</p>
              <p className="text-[10px] text-slate-500">Reservas Totales</p>
            </div>
          </div>

          <div className="space-y-2 w-full mt-2">
            {layersWithAmount.map((layer) => (
              <div key={layer.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: layer.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-300">{layer.name}</p>
                  <p className="text-[10px] text-slate-600 truncate">{layer.purpose}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{layer.percentage}%</p>
                  <p className="text-[10px] text-slate-500">${layer.amount.toLocaleString()}/mo</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Economía Operativa
          </p>

          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className={`p-3 rounded-lg border ${m.bg}`}>
                <div className="flex items-center gap-1.5 mb-1.5">{m.icon}</div>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">{m.label}</p>
                <p className="text-[10px] text-slate-600 truncate">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* ROI */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-emerald-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <p className="text-xs font-semibold text-slate-300">Retorno sobre la Inversión</p>
                </div>
                <p className="text-[11px] text-slate-500">
                  {roi > 0
                    ? `Cada $1 invertido retorna ~$${roi} en fraude detectado`
                    : "Calculado sobre fondos en riesgo detectados"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold gradient-text-blue">{roi > 0 ? `${roi}x` : "—"}</p>
                <p className={`text-[10px] font-semibold ${roi > 0 ? "text-emerald-400" : "text-slate-500"}`}>
                  {roi > 0 ? "ROI Positivo" : "Sin datos aún"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
