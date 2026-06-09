"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, RefreshCw, Shield, Menu, X } from "lucide-react";
import { navItems } from "@/components/Sidebar";

interface TopBarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
}

export default function TopBar({ sidebarOpen, onMenuToggle }: TopBarProps) {
  const pathname = usePathname();
  const sectionLabel =
    navItems.find((n) => (n.href === "/" ? pathname === "/" : pathname?.startsWith(n.href)))?.label ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-blue-500/10 bg-[#060711]/90 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-slate-200"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-xs text-slate-500 hidden sm:block">/</span>
          <span className="text-xs font-semibold text-white">{sectionLabel}</span>
          <span className="text-[10px] text-slate-600 ml-1 hidden md:block">
            Last updated: 2 min ago
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-500 hover:border-white/20 transition-colors cursor-pointer w-44">
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Search platform...</span>
          <kbd className="ml-auto text-[10px] bg-white/10 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>
        <button className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
          <Search className="w-4 h-4" />
        </button>
        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
          <RefreshCw className="w-4 h-4" />
        </button>
        <button className="relative p-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-500 hover:text-slate-300">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#060711]" />
        </button>
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <span className="relative flex h-1.5 w-1.5">
            <span className="ping-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold text-emerald-400">LIVE</span>
        </div>
      </div>
    </header>
  );
}
