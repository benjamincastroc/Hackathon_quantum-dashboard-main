"use client";
import { Building2, TrendingUp, TrendingDown } from "lucide-react";
 
const suppliers = [
  { name: "BuildCorp SA", category: "Infraestructura", contracts: 8, totalValue: "$12.4M", score: 94, trend: "up" },
  { name: "TechSystems Ltd", category: "TI y Tecnología", contracts: 5, totalValue: "$7.2M", score: 87, trend: "up" },
  { name: "MedSupply Inc", category: "Salud", contracts: 3, totalValue: "$3.1M", score: 62, trend: "down" },
  { name: "TransLogic Co", category: "Transporte", contracts: 6, totalValue: "$9.8M", score: 91, trend: "up" },
  { name: "EduPrint SA", category: "Educación", contracts: 4, totalValue: "$1.9M", score: 78, trend: "down" },
  { name: "GreenBuild Ltd", category: "Medio Ambiente", contracts: 2, totalValue: "$2.3M", score: 85, trend: "up" },
];
 
export default function SuppliersPanel() {
  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Proveedores</h1>
        <span className="ml-auto text-xs text-slate-500">{suppliers.length} proveedores registrados</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.name} className="rounded-xl border border-white/8 bg-[#0d1117] p-4 hover:border-blue-500/20 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{s.name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{s.category}</p>
              </div>
              <div className="flex items-center gap-1">
                {s.trend === "up"
                  ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  : <TrendingDown className="w-3.5 h-3.5 text-red-400" />}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Puntuación de Cumplimiento</span>
                <span className={`font-semibold ${s.score >= 80 ? "text-emerald-400" : s.score >= 65 ? "text-yellow-400" : "text-red-400"}`}>{s.score}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${s.score >= 80 ? "bg-emerald-500" : s.score >= 65 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${s.score}%` }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>{s.contracts} contratos</span>
                <span className="text-blue-400 font-medium">{s.totalValue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}