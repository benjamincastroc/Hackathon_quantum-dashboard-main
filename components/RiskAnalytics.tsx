"use client";

import { useState } from "react";
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
import { weeklyRiskData } from "@/lib/data";
import { cn } from "@/lib/utils";

const filters = ["Todos los Proyectos", "Infraestructura", "Salud", "Educación", "Transporte"] as const;
type Filter = (typeof filters)[number];

const filterKeyMap: Record<Filter, string> = {
  "Todos los Proyectos": "all",
  Infraestructura: "infrastructure",
  Salud: "health",
  Educación: "education",
  Transporte: "transportation",
};

const colorMap: Record<string, string> = {
  all: "#3b82f6",
  infrastructure: "#8b5cf6",
  health: "#ef4444",
  education: "#10b981",
  transportation: "#f97316",
};

const labelMap: Record<string, string> = {
  all: "Todos los Proyectos",
  infrastructure: "Infraestructura",
  health: "Salud",
  education: "Educación",
  transportation: "Transporte",
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-xl p-3 shadow-2xl border border-blue-500/20 min-w-[160px]">
      <p className="text-xs font-semibold text-slate-300 mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="text-xs text-slate-400">{labelMap[p.name] ?? p.name}</span>
          <span
            className="text-xs font-bold"
            style={{ color: p.color }}
          >
            {p.value}
            <span className="text-slate-500 font-normal">/100</span>
          </span>
        </div>
      ))}
    </div>
  );
}

export default function RiskAnalytics() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Todos los Proyectos");
  const activeKey = filterKeyMap[activeFilter];
  const color = colorMap[activeKey];

  return (
    <section className="glass rounded-xl border border-blue-500/10 p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white">Evolución del Riesgo en Proyectos Gubernamentales</h2>
          </div>
          <p className="text-xs text-slate-500">Puntuaciones de riesgo de corrupción semanales — ventana de 12 semanas</p>
        </div>

        {/* Average badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400">Riesgo Prom: 71/100</span>
          </div>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
              activeFilter === f
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyRiskData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              {Object.entries(colorMap).map(([key, col]) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={col} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={col} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(148,163,184,0.06)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            {activeFilter === "Todos los Proyectos" ? (
              /* Mostrar todas las líneas cuando se selecciona "Todos los Proyectos" */
              <>
                {Object.entries(colorMap)
                  .filter(([k]) => k !== "all")
                  .map(([key, col]) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={col}
                      strokeWidth={1.5}
                      fill={`url(#grad-${key})`}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0 }}
                      strokeOpacity={0.7}
                    />
                  ))}
              </>
            ) : (
              <Area
                type="monotone"
                dataKey={activeKey}
                stroke={color}
                strokeWidth={2.5}
                fill={`url(#grad-${activeKey})`}
                dot={false}
                activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend row */}
      {activeFilter === "Todos los Proyectos" && (
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {Object.entries(colorMap)
            .filter(([k]) => k !== "all")
            .map(([key, col]) => (
              <div key={key} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />
                <span className="text-[11px] text-slate-500 capitalize">{labelMap[key]}</span>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}
