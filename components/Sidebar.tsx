"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Building2,
  CreditCard,
  ShieldAlert,
  Link2,
  ClipboardList,
  Bot,
  Bell,
  Settings,
  ChevronRight,
  Shield,
  Zap,
  Crown,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { icon: LayoutDashboard, label: "Tablero",             href: "/" },
  { icon: FolderOpen,      label: "Proyectos",            href: "/projects",   badge: "124" },
  { icon: FileText,        label: "Contratos",            href: "/contracts" },
  { icon: Building2,       label: "Proveedores",          href: "/suppliers" },
  { icon: CreditCard,      label: "Pagos",                href: "/payments" },
  { icon: ShieldAlert,     label: "Análisis de Riesgo",   href: "/risk" },
  { icon: Link2,           label: "Blockchain",           href: "/blockchain" },
  { icon: ClipboardList,   label: "Informes de Auditoría",href: "/reports" },
  { icon: Bot,             label: "Agente Autónomo",      href: "/agent" },
  { icon: Bell,            label: "Alertas",              href: "/alerts",   badge: "3", badgeDanger: true },
  { icon: Settings,        label: "Configuración",        href: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const showLabels = !collapsed;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#0a0c18] border-r border-blue-500/10 transition-all duration-300 z-50",
        "fixed inset-y-0 left-0",
        "lg:relative lg:translate-x-0 lg:flex-shrink-0",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        collapsed ? "lg:w-[64px] w-[260px]" : "w-[260px]"
      )}
    >
      {/* ── Logo ─────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-500/10">
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center glow-blue">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0c18]" />
        </div>

        {showLabels && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-white leading-none tracking-tight">GovWatch AI</p>
            <p className="text-[10px] text-blue-400/80 leading-tight mt-0.5 truncate">
              Plataforma Anti-Corrupción
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "hidden lg:flex text-slate-500 hover:text-slate-300 transition-colors",
            collapsed && "mx-auto"
          )}
          aria-label="Toggle sidebar"
        >
          <ChevronRight
            className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")}
          />
        </button>
      </div>

      {/* ── Agent status pill ────────────────────────────── */}
      {showLabels && (
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-blue-500/8 border border-blue-500/15 flex items-center gap-2">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="ping-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">Agente Activo</span>
          <span className="ml-auto text-[10px] text-slate-500">92% conf.</span>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group",
                isActive
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 flex-shrink-0 transition-colors",
                  isActive
                    ? "text-blue-400"
                    : "text-slate-500 group-hover:text-slate-300"
                )}
              />
              {showLabels && (
                <>
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                        item.badgeDanger
                          ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                          : "bg-slate-700 text-slate-400"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom section ───────────────────────────────── */}
      <div className="border-t border-blue-500/10 p-2 space-y-1">
        {showLabels && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/15 mb-2">
            <Crown className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-yellow-400">Plan Profesional</p>
              <p className="text-[10px] text-slate-500">Monitoreo ilimitado</p>
            </div>
            <Zap className="w-3 h-3 text-yellow-400 ml-auto flex-shrink-0" />
          </div>
        )}

        {showLabels && (
          <div className="px-3 py-1">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
              Organización
            </p>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Contraloría Nacional</p>
          </div>
        )}

        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          {showLabels && (
            <>
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-slate-300 truncate">Benjamin Castro Campos</p>
                <p className="text-[10px] text-slate-500 truncate">Auditor Jefe</p>
              </div>
              <LogOut className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto flex-shrink-0" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
