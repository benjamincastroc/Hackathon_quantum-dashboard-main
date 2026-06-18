"use client";

import { Bot, Zap, CheckCircle2, Activity, Clock, Shield, AlertTriangle } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs  = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1)  return "ahora mismo";
  if (mins < 60) return `hace ${mins} min`;
  if (hrs  < 24) return `hace ${hrs} h`;
  return `hace ${days} días`;
}

export default function AutonomousAgent() {
  const inv = useInvestigationData();

  if (!inv) {
    return (
      <section className="glass rounded-xl border border-blue-500/10 flex flex-col">
        <div className="p-5 border-b border-blue-500/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center glow-blue">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Agente de Auditoría Autónomo</h2>
              <p className="text-[10px] text-slate-500">Sin investigación activa</p>
            </div>
          </div>
        </div>
        <EmptyInvestigation message="Inicia una investigación para ver el estado y métricas del agente." />
      </section>
    );
  }

  const criticalCount   = inv.anomalies?.filter((a) => a.severity === "Critical").length ?? 0;
  const highCount       = inv.anomalies?.filter((a) => a.severity === "High").length ?? 0;
  const contractsCount  = inv.contracts?.length ?? 0;
  const suppliersCount  = inv.suppliers?.length ?? 0;
  const anomaliesCount  = inv.anomalies?.length ?? 0;

  // Confianza: baja si hay muchas anomalías críticas
  const confidence = Math.max(60, 97 - criticalCount * 5 - highCount * 2);

  // Salud del sistema según riesgo del proyecto
  const health =
    inv.project.risk >= 70 ? "Crítico" :
    inv.project.risk >= 50 ? "Alerta" :
    "Saludable";
  const healthColor =
    inv.project.risk >= 70 ? "text-red-400" :
    inv.project.risk >= 50 ? "text-orange-400" :
    "text-emerald-400";

  const modules = [
    { name: "Análisis de Contratos",       active: contractsCount > 0,  count: `${contractsCount} detectados` },
    { name: "Inteligencia de Proveedores", active: suppliersCount > 0,  count: `${suppliersCount} identificados` },
    { name: "Detección de Anomalías",      active: anomaliesCount > 0,  count: `${anomaliesCount} encontradas` },
    { name: "Validación Blockchain",       active: true,                count: "SHA-256 activo" },
    { name: "Motor de Riesgo",             active: true,                count: `${inv.project.risk}/100` },
    { name: "Extracción de Evidencias",    active: true,                count: "Tavily + PDF" },
  ];

  return (
    <section className="glass rounded-xl border border-blue-500/10 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-blue-500/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center glow-blue">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#10121f]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Agente de Auditoría Autónomo</h2>
              <p className="text-[10px] text-slate-500 truncate max-w-[180px]">{inv.projectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="ping-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-emerald-400">ACTIVO</span>
          </div>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <Clock className="w-3 h-3 text-slate-500 mx-auto mb-1" />
            <p className="text-xs font-bold text-white">{timeAgo(inv.investigatedAt)}</p>
            <p className="text-[10px] text-slate-500">Último Análisis</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <Zap className="w-3 h-3 text-cyan-400 mx-auto mb-1" />
            <p className="text-xs font-bold text-cyan-400">{confidence}%</p>
            <p className="text-[10px] text-slate-500">Confianza</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <Shield className={`w-3 h-3 mx-auto mb-1 ${healthColor}`} />
            <p className={`text-xs font-bold ${healthColor}`}>{health}</p>
            <p className="text-[10px] text-slate-500">Estado</p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="p-5 flex-1">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Módulos Activos
        </p>
        <div className="space-y-2.5">
          {modules.map((module, i) => (
            <div
              key={module.name}
              className="flex items-center gap-3 animate-enter"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {module.active
                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                : <AlertTriangle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300 truncate">{module.name}</span>
                  <span className="text-[10px] text-slate-500 ml-2 flex-shrink-0">{module.count}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${module.active ? "bg-gradient-to-r from-emerald-600 to-emerald-400" : "bg-slate-700"}`}
                    style={{ width: module.active ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-400">Hallazgos de la investigación</span>
          </div>
          <span className="text-sm font-bold text-blue-400">{anomaliesCount} anomalías</span>
        </div>
      </div>
    </section>
  );
}
