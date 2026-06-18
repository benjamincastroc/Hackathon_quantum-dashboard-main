"use client";
import { Bell, AlertTriangle, Info, XCircle, Sparkles } from "lucide-react";
import { useInvestigationData } from "@/hooks/useInvestigationData";
import EmptyInvestigation from "@/components/EmptyInvestigation";

const severityConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  critical: { color: "text-red-400",    bg: "bg-red-500/10 border-red-500/20",       icon: <XCircle className="w-4 h-4 text-red-400" /> },
  high:     { color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20", icon: <AlertTriangle className="w-4 h-4 text-orange-400" /> },
  medium:   { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", icon: <AlertTriangle className="w-4 h-4 text-yellow-400" /> },
  info:     { color: "text-blue-400",   bg: "bg-blue-500/10 border-blue-500/20",     icon: <Info className="w-4 h-4 text-blue-400" /> },
};

const severityMap: Record<string, string> = {
  Critical: "critical",
  High: "high",
  Medium: "medium",
  Low: "info",
};

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "hoy";
  if (days === 1) return "hace 1 día";
  return `hace ${days} días`;
}

export default function AlertsPanel() {
  const inv = useInvestigationData();

  const alerts = inv?.anomalies?.map((a, i) => ({
    id: i + 1,
    title: a.title,
    desc: a.description,
    time: timeAgo(a.date),
    severity: severityMap[a.severity] ?? "info",
    read: false,
  })) ?? [];

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="animate-enter space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Bell className="w-5 h-5 text-red-400" />
        <h1 className="text-lg font-bold text-white">Alertas</h1>
        {inv && unreadCount > 0 && (
          <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
            {unreadCount} sin leer
          </span>
        )}
        {inv && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-auto">
            <Sparkles className="w-2.5 h-2.5" />
            {inv.projectName}
          </span>
        )}
      </div>

      {!inv || alerts.length === 0 ? (
        <div className="rounded-xl border border-white/8 bg-[#0d1117]">
          <EmptyInvestigation message="Las alertas se generan automáticamente desde las anomalías detectadas en cada investigación." />
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => {
            const cfg = severityConfig[a.severity];
            return (
              <div
                key={a.id}
                className={`rounded-xl border p-4 transition-all hover:scale-[1.01] cursor-pointer ${cfg.bg} ${a.read ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-semibold ${cfg.color}`}>{a.title}</p>
                      {!a.read && <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{a.desc}</p>
                    <p className="text-[11px] text-slate-600 mt-1.5">{a.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
