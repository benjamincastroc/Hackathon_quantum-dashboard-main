"use client";
import { Bell, AlertTriangle, Info, XCircle } from "lucide-react";
 
const alerts = [
  { id: 1, title: "Anomalous payment detected", desc: "MedSupply Inc — $92,400 exceeds contract ceiling by 18%", time: "2 min ago", severity: "critical", read: false },
  { id: 2, title: "Supplier compliance drop", desc: "MedSupply Inc score fell from 78% to 62% in last 30 days", time: "14 min ago", severity: "high", read: false },
  { id: 3, title: "New contract pending review", desc: "TechSystems Ltd — IT Systems Upgrade $1.8M awaiting approval", time: "1 hr ago", severity: "medium", read: false },
  { id: 4, title: "Blockchain verification complete", desc: "BatchTX-2091 — 14 transactions successfully verified", time: "3 hr ago", severity: "info", read: true },
  { id: 5, title: "Audit report ready", desc: "Q1 2024 Infrastructure audit report is available for download", time: "5 hr ago", severity: "info", read: true },
];
 
const severityConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  critical: { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: <XCircle className="w-4 h-4 text-red-400" /> },
  high:     { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
  medium:   { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: <AlertTriangle className="w-4 h-4 text-yellow-400" /> },
  info:     { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: <Info className="w-4 h-4 text-blue-400" /> },
};
 
export default function AlertsPanel() {
  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-red-400" />
        <h1 className="text-lg font-bold text-white">Alerts</h1>
        <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">3 unread</span>
      </div>
      <div className="space-y-3">
        {alerts.map((a) => {
          const cfg = severityConfig[a.severity];
          return (
            <div key={a.id} className={`rounded-xl border p-4 transition-all hover:scale-[1.01] cursor-pointer ${cfg.bg} ${a.read ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${cfg.color}`}>{a.title}</p>
                    {!a.read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{a.desc}</p>
                  <p className="text-[11px] text-slate-600 mt-1.5">{a.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}