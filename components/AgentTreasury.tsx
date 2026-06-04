"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Vault, TrendingUp, DollarSign, Clock, Zap, BarChart3 } from "lucide-react";
import { treasuryLayers, treasuryMetrics } from "@/lib/data";

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: typeof treasuryLayers[0] }>;
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="glass-strong rounded-xl p-3 border border-blue-500/20 min-w-[180px]">
      <p className="text-xs font-bold text-white mb-1" style={{ color: d.color }}>{d.name}</p>
      <p className="text-lg font-bold text-white">{d.percentage}%</p>
      <p className="text-[11px] text-slate-400">${d.amount.toLocaleString()} / month</p>
      <p className="text-[10px] text-slate-500 mt-1 leading-snug">{d.purpose}</p>
    </div>
  );
}

export default function AgentTreasury() {
  return (
    <section className="glass rounded-xl border border-blue-500/10 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-lg bg-yellow-500/10">
          <Vault className="w-4 h-4 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Agent Treasury &amp; Sustainability</h2>
          <p className="text-xs text-slate-500">Autonomous operating economics — 3-layer capital structure</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Donut chart */}
        <div className="flex flex-col items-center">
          <div className="relative h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treasuryLayers}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="percentage"
                  stroke="none"
                >
                  {treasuryLayers.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold text-white">$42K</p>
              <p className="text-[10px] text-slate-500">Total Reserves</p>
            </div>
          </div>

          {/* Layer legend */}
          <div className="space-y-2 w-full mt-2">
            {treasuryLayers.map((layer) => (
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

        {/* Metrics grid */}
        <div className="space-y-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
            Operating Economics
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {[
              {
                icon: <DollarSign className="w-3.5 h-3.5 text-blue-400" />,
                label: "Monthly Operating Cost",
                value: `$${treasuryMetrics.monthlyOperatingCost}`,
                sub: "per month",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                icon: <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />,
                label: "Cost per Audit",
                value: `$${treasuryMetrics.costPerAudit}`,
                sub: "per analysis",
                color: "text-cyan-400",
                bg: "bg-cyan-500/10 border-cyan-500/20",
              },
              {
                icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />,
                label: "Est. Public Savings",
                value: `$${(treasuryMetrics.estimatedPublicSavings / 1000).toFixed(0)}K`,
                sub: "Q1 2024",
                color: "text-emerald-400",
                bg: "bg-emerald-500/10 border-emerald-500/20",
              },
              {
                icon: <Clock className="w-3.5 h-3.5 text-purple-400" />,
                label: "Runway",
                value: `${treasuryMetrics.runway} mo`,
                sub: "at current burn",
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
              },
            ].map((m) => (
              <div key={m.label} className={`p-3 rounded-lg border ${m.bg}`}>
                <div className="flex items-center gap-1.5 mb-1.5">{m.icon}</div>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">{m.label}</p>
                <p className="text-[10px] text-slate-600">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* ROI highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-emerald-500/10 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <p className="text-xs font-semibold text-slate-300">Return on Investment</p>
                </div>
                <p className="text-[11px] text-slate-500">
                  Every $1 invested returns ~$200 in prevented fraud
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold gradient-text-blue">{treasuryMetrics.roi}x</p>
                <p className="text-[10px] text-emerald-400 font-semibold">Positive ROI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
