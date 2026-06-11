"use client";

import {
  Brain,
  LogOut,
  Network,
  Cpu,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";
import { survivalData } from "@/lib/data";

interface StatusBadgeProps {
  status: "Healthy" | "Warning" | "Critical" | "Available" | "Operational" | "Ready" | "Normal" | "Positive";
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isPositive = ["Healthy", "Available", "Operational", "Ready", "Normal", "Positive"].includes(status);
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
        isPositive
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
          : "text-red-400 bg-red-500/10 border-red-500/25"
      }`}
    >
      {isPositive ? (
        <CheckCircle2 className="w-2.5 h-2.5" />
      ) : (
        <AlertCircle className="w-2.5 h-2.5" />
      )}
      {status}
    </span>
  );
}

function MetricRow({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] text-slate-500">{label}</span>
      <div className="text-right">
        <span className="text-[11px] font-semibold text-slate-300">{value}</span>
        {sub && <span className="text-[10px] text-slate-600 ml-1">{sub}</span>}
      </div>
    </div>
  );
}

const rules = [
  {
    icon: <Brain className="w-4 h-4 text-blue-400" />,
    label: "Regla de Confianza",
    desc: "Detectar cuándo los supuestos clave se vuelven no fiables",
    color: "from-blue-500/10 to-blue-500/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/15",
    content: (
      <>
        <MetricRow label="Confianza en Datos" value={`${survivalData.confidence.dataConfidence}%`} />
        <MetricRow label="Fiabilidad de Evidencia" value={`${survivalData.confidence.evidenceReliability}%`} />
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-slate-600 mb-1">
            <span>Nivel de Confianza</span>
            <span>{survivalData.confidence.dataConfidence}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: `${survivalData.confidence.dataConfidence}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <StatusBadge status={survivalData.confidence.status} />
        </div>
      </>
    ),
  },
  {
    icon: <LogOut className="w-4 h-4 text-purple-400" />,
    label: "Regla de Salida",
    desc: "Medir capacidad de detener, revertir y recuperar de forma segura",
    color: "from-purple-500/10 to-purple-500/5",
    border: "border-purple-500/20",
    iconBg: "bg-purple-500/15",
    content: (
      <>
        <MetricRow label="Listo para Revertir" value={survivalData.exitability.rollbackReadiness} />
        <MetricRow label="Estado de Recuperación" value={survivalData.exitability.recoveryStatus} />
        <MetricRow label="Modo Emergencia" value={survivalData.exitability.emergencyMode} />
        <div className="mt-2 flex justify-end gap-1.5 flex-wrap">
          <StatusBadge status={survivalData.exitability.rollbackReadiness} />
          <StatusBadge status={survivalData.exitability.emergencyMode} />
        </div>
      </>
    ),
  },
  {
    icon: <Network className="w-4 h-4 text-cyan-400" />,
    label: "Salud de Dependencias",
    desc: "Monitorear todas las integraciones externas críticas",
    color: "from-cyan-500/10 to-cyan-500/5",
    border: "border-cyan-500/20",
    iconBg: "bg-cyan-500/15",
    content: (
      <>
        {survivalData.dependencies.map((dep) => (
          <div key={dep.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  dep.status === "Healthy" ? "bg-emerald-400" : "bg-red-400 animate-pulse"
                }`}
              />
              <span className="text-[11px] text-slate-400">{dep.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-600">{dep.latency}</span>
              <StatusBadge status={dep.status} />
            </div>
          </div>
        ))}
      </>
    ),
  },
  {
    icon: <Cpu className="w-4 h-4 text-orange-400" />,
    label: "Regla de Ejecución",
    desc: "Monitorear capacidad de procesamiento y rendimiento del sistema",
    color: "from-orange-500/10 to-orange-500/5",
    border: "border-orange-500/20",
    iconBg: "bg-orange-500/15",
    content: (
      <>
        <MetricRow label="Latencia" value={`${survivalData.execution.latency}ms`} />
        <MetricRow label="Procesamiento" value={survivalData.execution.processingCapacity} />
        <div className="mt-2">
          <div className="flex justify-between text-[10px] text-slate-600 mb-1">
            <span>Carga del Sistema</span>
            <span>{survivalData.execution.systemLoad}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-yellow-400"
              style={{ width: `${survivalData.execution.systemLoad}%` }}
            />
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <StatusBadge status={survivalData.execution.processingCapacity} />
        </div>
      </>
    ),
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-emerald-400" />,
    label: "Regla de Economía",
    desc: "Asegurar que la operación genera valor público neto positivo",
    color: "from-emerald-500/10 to-emerald-500/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/15",
    content: (
      <>
        <MetricRow label="Costo Mensual" value={`$${survivalData.economics.operatingCost}`} />
        <MetricRow label="Valor Fraude Prevenido" value={`$${(survivalData.economics.fraudPreventionValue / 1000).toFixed(0)}K`} />
        <div className="flex items-center justify-between mt-1 py-1.5">
          <span className="text-[11px] text-slate-500">ROI (Retorno)</span>
          <span className="text-base font-bold text-emerald-400">{survivalData.economics.roi}x</span>
        </div>
        <div className="flex justify-end">
          <StatusBadge status={survivalData.economics.status} />
        </div>
      </>
    ),
  },
];

export default function SurvivalEngine() {
  return (
    <section className="glass rounded-xl border border-blue-500/10 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Motor de Supervivencia Autónomo</h2>
            <p className="text-xs text-slate-500">Sistema de inteligencia de 5 reglas — resiliencia operacional</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-400">Todas las Reglas Activas</span>
        </div>
      </div>

      {/* Rules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {rules.map((rule, i) => (
          <div
            key={rule.label}
            className={`rounded-xl p-4 bg-gradient-to-b ${rule.color} border ${rule.border} animate-enter`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Rule header */}
            <div className={`w-8 h-8 rounded-lg ${rule.iconBg} flex items-center justify-center mb-3`}>
              {rule.icon}
            </div>
            <p className="text-xs font-bold text-white mb-0.5">{rule.label}</p>
            <p className="text-[10px] text-slate-500 leading-snug mb-3">{rule.desc}</p>

            {/* Metrics */}
            <div className="text-[11px] space-y-0">{rule.content}</div>
          </div>
        ))}
      </div>

      {/* Survival principles footer */}
      <div className="mt-5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Principios Operativos
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {[
            "Supervivencia antes que optimización",
            "Continuidad antes que producción",
            "Separar capas de capital",
            "Monitorear confianza siempre",
            "Activar modo seguro ante riesgo",
          ].map((principle, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-blue-500 text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
              <span className="text-[10px] text-slate-500 leading-snug">{principle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
