"use client";
import { CreditCard, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
 
const payments = [
  { id: "PAY-2041", vendor: "BuildCorp SA", amount: "$840,000", date: "Jun 07, 2024", status: "Completed", type: "out" },
  { id: "PAY-2040", vendor: "TechSystems Ltd", amount: "$215,000", date: "Jun 06, 2024", status: "Pending", type: "out" },
  { id: "PAY-2039", vendor: "MedSupply Inc", amount: "$92,400", date: "Jun 05, 2024", status: "Flagged", type: "out" },
  { id: "PAY-2038", vendor: "TransLogic Co", amount: "$1,200,000", date: "Jun 04, 2024", status: "Completed", type: "out" },
  { id: "PAY-2037", vendor: "EduPrint SA", amount: "$34,000", date: "Jun 03, 2024", status: "Completed", type: "out" },
  { id: "PAY-2036", vendor: "GreenBuild Ltd", amount: "$560,000", date: "Jun 02, 2024", status: "Pending", type: "out" },
];
 
const statusStyles: Record<string, string> = {
  Completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Pending: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Flagged: "text-red-400 bg-red-500/10 border-red-500/20 animate-pulse",
};
 
export default function PaymentsPanel() {
  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-400" />
        <h1 className="text-lg font-bold text-white">Payments</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Disbursed", value: "$38.4M", icon: ArrowUpRight, color: "text-blue-400" },
          { label: "Pending", value: "$1.76M", icon: Clock, color: "text-yellow-400" },
          { label: "Flagged", value: "$92.4K", icon: ArrowDownRight, color: "text-red-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/8 bg-[#0d1117] p-4">
            <stat.icon className={`w-4 h-4 ${stat.color} mb-2`} />
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/8 bg-[#0d1117] overflow-hidden">
        <div className="px-4 py-3 border-b border-white/8">
          <p className="text-xs font-semibold text-slate-300">Recent Transactions</p>
        </div>
        <div className="divide-y divide-white/5">
          {payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between px-4 py-3 hover:bg-white/3 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-200">{p.vendor}</p>
                  <p className="text-[11px] text-slate-500">{p.id} · {p.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-semibold text-white">{p.amount}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyles[p.status]}`}>{p.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}