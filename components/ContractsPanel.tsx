"use client";
import { FileText, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
 
const contracts = [
  { id: "CON-001", title: "Infrastructure Maintenance 2024", vendor: "BuildCorp SA", value: "$4.2M", status: "Active", risk: "low" },
  { id: "CON-002", title: "IT Systems Upgrade", vendor: "TechSystems Ltd", value: "$1.8M", status: "Review", risk: "medium" },
  { id: "CON-003", title: "Public Health Supplies", vendor: "MedSupply Inc", value: "$920K", status: "Flagged", risk: "high" },
  { id: "CON-004", title: "Urban Transportation", vendor: "TransLogic Co", value: "$6.1M", status: "Active", risk: "low" },
  { id: "CON-005", title: "Educational Materials Q2", vendor: "EduPrint SA", value: "$340K", status: "Active", risk: "low" },
];
 
const riskColor = { low: "text-emerald-400 bg-emerald-500/10", medium: "text-yellow-400 bg-yellow-500/10", high: "text-red-400 bg-red-500/10" };
const statusIcon = { Active: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, Review: <Clock className="w-3.5 h-3.5 text-yellow-400" />, Flagged: <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> };
 
export default function ContractsPanel() {
  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Contracts</h1>
        <span className="ml-auto text-xs text-slate-500">5 active contracts</span>
      </div>
      <div className="rounded-xl border border-white/8 bg-[#0d1117] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 text-left">
              <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider hidden md:table-cell">Vendor</th>
              <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Risk</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c, i) => (
              <tr key={c.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "" : "bg-white/1"}`}>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">{c.id}</td>
                <td className="px-4 py-3 text-xs text-slate-200 font-medium">{c.title}</td>
                <td className="px-4 py-3 text-xs text-slate-400 hidden md:table-cell">{c.vendor}</td>
                <td className="px-4 py-3 text-xs text-blue-400 font-semibold">{c.value}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {statusIcon[c.status as keyof typeof statusIcon]}
                    <span className="text-xs text-slate-300">{c.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${riskColor[c.risk as keyof typeof riskColor]}`}>{c.risk}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}