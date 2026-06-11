"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, ExternalLink, Search } from "lucide-react";
import { projects } from "@/lib/data";
import {
  formatCurrency,
  getRiskBadge,
  getStatusStyles,
  getStatusDot,
} from "@/lib/utils";
import type { Project, ProjectStatus } from "@/lib/data";

type SortKey = keyof Pick<Project, "name" | "budget" | "executed" | "progress" | "risk">;

export default function ProjectsTable() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("risk");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "All">("All");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = projects
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.agency.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return mul * a.name.localeCompare(b.name);
      return mul * ((a[sortKey] as number) - (b[sortKey] as number));
    });

  const statusOptions: (ProjectStatus | "All")[] = ["All", "Healthy", "Review", "Warning", "Critical"];
  const statusLabels: Record<string, string> = {
    All: "Todos",
    Healthy: "Saludable",
    Review: "Revisión",
    Warning: "Advertencia",
    Critical: "Crítico",
  };

  return (
    <section className="glass rounded-xl border border-blue-500/10">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-blue-500/10 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white">Monitoreo de Proyectos</h2>
            <p className="text-xs text-slate-500 mt-0.5">{filtered.length} proyectos mostrados</p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white/5 border border-white/10 rounded-lg text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/40 w-32 sm:w-44"
            />
          </div>
        </div>
        {/* Status filters — scrollable row on small screens */}
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "text-slate-500 hover:text-slate-300 border border-transparent"
              }`}
            >
              {statusLabels[s] ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {[
                { label: "Proyecto", key: "name" as SortKey },
                { label: "Entidad", key: null },
                { label: "Presupuesto", key: "budget" as SortKey },
                { label: "Ejecutado %", key: "executed" as SortKey },
                { label: "Físico %", key: "progress" as SortKey },
                { label: "Riesgo", key: "risk" as SortKey },
                { label: "Estado", key: null },
                { label: "", key: null },
              ].map((col) => (
                <th
                  key={col.label}
                  className="text-left px-4 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {col.key ? (
                    <button
                      onClick={() => handleSort(col.key!)}
                      className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === "desc" ? (
                          <ChevronDown className="w-3 h-3 text-blue-400" />
                        ) : (
                          <ChevronUp className="w-3 h-3 text-blue-400" />
                        )
                      ) : (
                        <ChevronDown className="w-3 h-3 opacity-30" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((project, i) => (
              <tr
                key={project.id}
                className="border-b border-white/[0.04] hover:bg-white/[0.025] transition-colors group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Project */}
                <td className="px-4 py-3.5">
                  <div>
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                      {project.name}
                    </p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{project.location}</p>
                  </div>
                </td>

                {/* Agency */}
                <td className="px-4 py-3.5">
                  <p className="text-xs text-slate-400 max-w-[160px] truncate">{project.agency}</p>
                </td>

                {/* Budget */}
                <td className="px-4 py-3.5">
                  <p className="text-xs font-semibold text-slate-300">{formatCurrency(project.budget)}</p>
                </td>

                {/* Executed */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-16">
                      <div
                        className={`h-full rounded-full transition-all ${
                          project.executed >= 90
                            ? "bg-red-500"
                            : project.executed >= 70
                            ? "bg-orange-500"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${project.executed}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{project.executed}%</span>
                  </div>
                </td>

                {/* Physical Progress */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden w-16">
                      <div
                        className="h-full rounded-full bg-cyan-500 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 w-8 text-right">{project.progress}%</span>
                  </div>
                </td>

                {/* Risk Score */}
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getRiskBadge(project.risk)}`}>
                    {project.risk}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusStyles(project.status)}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(project.status)}`} />
                    {statusLabels[project.status] ?? project.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/10">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
