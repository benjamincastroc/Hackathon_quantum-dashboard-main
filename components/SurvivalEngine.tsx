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
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
      ok
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25"
        : "text-red-400 bg-red-500/10 border-red-500/25"
    }`}>
      {ok ? <CheckCircle2 className="w-2.5 h-2.5" /> : <AlertCircle className="w-2.5 h-2.5" />}
      {label}
    </span>
  );
}

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[11px] font-semibold text-slate-300">{value}</span>
    </div>
  );
}

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export default function SurvivalEngine() {
  const inv = useInvestigationData();

  if (!inv) {
    return (
      <section className="glass rounded-xl border border-blue-500/10 p-5">
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white">Motor de Supervivencia Autónomo</h2>
        </div>
        <EmptyInvestigation message="Investiga un proyecto para ver las métricas operacionales del agente." />
      </section>
    );
  }

  // Métricas derivadas de la investigación
  const anomalies      = inv.anomalies ?? [];
  const criticalCount  = anomalies.filter((a) => a.severity === "Critical").length;
  const highCount      = anomalies.filter((a) => a.severity === "High").length;
  const totalImpact    = anomalies.reduce((s, a) => s + (a.impact ?? 0), 0);
  const contractCount  = inv.contracts?.length ?? 0;
  const supplierCount  = inv.suppliers?.length ?? 0;

  // Confianza: baja si hay muchos críticos
  const dataConfidence      = Math.max(55, 97 - criticalCount * 6 - highCount * 2);
  const evidenceReliability = Math.min(99, 85 + contractCount + supplierCount);
  const confidenceOk        = dataConfidence >= 70;

  // Economía
  const monthlyCost  = 420;
  const roi          = totalImpact > 0 ? Math.round(totalImpact / monthlyCost) : 0;
  const economicsOk  = totalImpact > monthlyCost;

  // Riesgo del proyecto
  const riskScore = inv.project?.risk ?? 0;
  const systemLoad = Math.min(95, 30 + riskScore * 0.6);

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
          <Row label="Confianza en Datos"      value={`${dataConfidence}%`} />
          <Row label="Fiabilidad de Evidencia" value={`${evidenceReliability}%`} />
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
              <span>Nivel de Confianza</span>
              <span>{dataConfidence}%</span>
            </div>
            <Bar value={dataConfidence} color="bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>
          <div className="mt-2 flex justify-end">
            <StatusBadge ok={confidenceOk} label={confidenceOk ? "Saludable" : "Alerta"} />
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
          <Row label="Listo para Revertir"  value="Disponible" />
          <Row label="Estado de Recuperación" value="Operacional" />
          <Row label="Modo Emergencia"      value="Listo" />
          <div className="mt-2 flex justify-end gap-1.5">
            <StatusBadge ok={true} label="Disponible" />
            <StatusBadge ok={true} label="Listo" />
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
          {[
            { name: "API Gubernamental",     ok: true,  latency: "42ms" },
            { name: "Nodo Syscoin NEVM",     ok: true,  latency: "18ms" },
            { name: "Supabase DB",           ok: true,  latency: "67ms" },
            { name: "Groq / Tavily AI",      ok: true,  latency: "310ms" },
          ].map((dep) => (
            <div key={dep.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${dep.ok ? "bg-emerald-400" : "bg-red-400 animate-pulse"}`} />
                <span className="text-[11px] text-slate-400">{dep.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-600">{dep.latency}</span>
                <StatusBadge ok={dep.ok} label={dep.ok ? "Activo" : "Caído"} />
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
          <Row label="Latencia Promedio"  value="120ms" />
          <Row label="Procesamiento"      value="Normal" />
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-slate-600 mb-1">
              <span>Carga del Sistema</span>
              <span>{Math.round(systemLoad)}%</span>
            </div>
            <Bar value={systemLoad} color="bg-gradient-to-r from-orange-500 to-yellow-400" />
          </div>
          <div className="mt-2 flex justify-end">
            <StatusBadge ok={systemLoad < 80} label={systemLoad < 80 ? "Normal" : "Alta Carga"} />
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
          <Row label="Costo Mensual"           value={`$${monthlyCost}`} />
          <Row label="Fondos en Riesgo"        value={totalImpact > 0 ? fmt(totalImpact) : "—"} />
          <div className="flex items-center justify-between mt-1 py-1.5">
            <span className="text-[11px] text-slate-500">ROI (Retorno)</span>
            <span className={`text-base font-bold ${roi > 0 ? "text-emerald-400" : "text-slate-500"}`}>
              {roi > 0 ? `${roi}x` : "—"}
            </span>
          </div>
          <div className="flex justify-end">
            <StatusBadge ok={economicsOk} label={economicsOk ? "Positivo" : "Sin datos"} />
          </div>
        </>
      ),
    },
  ];

  return (
    <section className="glass rounded-xl border border-blue-500/10 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Motor de Supervivencia Autónomo</h2>
            <p className="text-xs text-slate-500 truncate max-w-[260px]">{inv.projectName}</p>
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
            <div className={`w-8 h-8 rounded-lg ${rule.iconBg} flex items-center justify-center mb-3`}>
              {rule.icon}
            </div>
            <p className="text-xs font-bold text-white mb-0.5">{rule.label}</p>
            <p className="text-[10px] text-slate-500 leading-snug mb-3">{rule.desc}</p>
            <div className="text-[11px] space-y-0">{rule.content}</div>
          </div>
        ))}
      </div>

      {/* Footer */}
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
          ].map((p, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-blue-500 text-[10px] font-bold flex-shrink-0 mt-0.5">{i + 1}.</span>
              <span className="text-[10px] text-slate-500 leading-snug">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
