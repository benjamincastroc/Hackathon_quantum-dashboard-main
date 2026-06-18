"use client";
import { Settings, Shield, Bell, Globe } from "lucide-react";
import { useState } from "react";
 
function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button onClick={() => setOn(!on)} className={`relative w-10 h-5 rounded-full transition-colors ${on ? "bg-blue-600" : "bg-slate-700"}`}>
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${on ? "left-5" : "left-0.5"}`} />
    </button>
  );
}
 
export default function SettingsPanel() {
  return (
    <div className="animate-enter space-y-4 max-w-2xl">
      <div className="flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Configuración</h1>
      </div>
      {[
        { icon: Bell, title: "Notificaciones", items: [
          { label: "Alertas por correo para eventos críticos", on: true },
          { label: "Notificaciones push para anomalías", on: true },
          { label: "Reporte semanal de resumen", on: false },
        ]},
        { icon: Shield, title: "Seguridad", items: [
          { label: "Autenticación de dos factores", on: true },
          { label: "Tiempo de sesión (30 min)", on: true },
          { label: "Registro de acceso a API", on: true },
        ]},
        { icon: Globe, title: "Datos y Privacidad", items: [
          { label: "Compartir datos anónimos para entrenamiento de IA", on: false },
          { label: "Registro de auditoría en blockchain", on: true },
          { label: "Monitoreo en tiempo real", on: true },
        ]},
      ].map((section) => (
        <div key={section.title} className="rounded-xl border border-white/8 bg-[#0d1117] overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8">
            <section.icon className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-semibold text-slate-200">{section.title}</p>
          </div>
          <div className="divide-y divide-white/5">
            {section.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3">
                <p className="text-sm text-slate-300">{item.label}</p>
                <Toggle defaultOn={item.on} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}