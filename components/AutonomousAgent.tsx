"use client";

import { Bot, Zap, CheckCircle2, Activity, Clock, Shield } from "lucide-react";
import { agentModules } from "@/lib/data";

export default function AutonomousAgent() {
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
              <p className="text-[10px] text-slate-500">Monitoreo continuo — activo 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="ping-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-bold text-emerald-400">ACTIVE</span>
          </div>
        </div>

        {/* Key metrics row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-slate-500" />
            </div>
            <p className="text-xs font-bold text-white">hace 2 min</p>
            <p className="text-[10px] text-slate-500">Último Análisis</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-3 h-3 text-cyan-400" />
            </div>
            <p className="text-xs font-bold text-cyan-400">92%</p>
            <p className="text-[10px] text-slate-500">Confianza</p>
          </div>
          <div className="bg-white/5 rounded-lg p-2.5 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Shield className="w-3 h-3 text-emerald-400" />
            </div>
            <p className="text-xs font-bold text-emerald-400">Saludable</p>
            <p className="text-[10px] text-slate-500">Salud del Sistema</p>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="p-5 flex-1">
        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Módulos Activos
        </p>
        <div className="space-y-2.5">
          {agentModules.map((module, i) => (
            <div
              key={module.name}
              className="flex items-center gap-3 animate-enter"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-300 truncate">{module.name}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold ml-2">{module.health}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                    style={{ width: `${module.health}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] font-medium text-emerald-500 flex-shrink-0 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {module.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs text-slate-400">Auditorías completadas hoy</span>
          </div>
          <span className="text-sm font-bold text-blue-400">2,666</span>
        </div>
      </div>
    </section>
  );
}
