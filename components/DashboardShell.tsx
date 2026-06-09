"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#060711] overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="px-3 sm:px-5 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
            {children}

            <div className="py-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] text-slate-600">
              <p>GovAI v3.2 — Autonomous Anti-Corruption Platform</p>
              <div className="flex flex-wrap items-center gap-3">
                <span>Security: AES-256</span>
                <span>Blockchain: Verified</span>
                <span className="text-emerald-500">● All Systems Operational</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
