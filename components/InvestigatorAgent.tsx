"use client";

import { useState } from "react";
import {
  Search,
  Bot,
  AlertTriangle,
  ExternalLink,
  Loader2,
  ChevronRight,
  FileSearch,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";

interface Step {
  type: "search" | "thinking";
  content: string;
}

interface Source {
  title: string;
  url: string;
}

interface Result {
  report: string;
  steps: Step[];
  sources: Source[];
}

function ReportContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="text-xs text-slate-300 leading-relaxed space-y-1">
      {lines.map((line, i) => {
        if (line.startsWith("## ")) {
          return (
            <h3 key={i} className="text-sm font-bold text-white mt-4 mb-1 first:mt-0">
              {line.replace("## ", "")}
            </h3>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h4 key={i} className="text-xs font-semibold text-slate-200 mt-2">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <p key={i} className="flex items-start gap-1.5">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: line
                    .replace(/^[-*] /, "")
                    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>"),
                }}
              />
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return (
          <p
            key={i}
            dangerouslySetInnerHTML={{
              __html: line.replace(
                /\*\*(.*?)\*\*/g,
                "<strong class='text-white font-semibold'>$1</strong>"
              ),
            }}
          />
        );
      })}
    </div>
  );
}

const EXAMPLE_PROJECTS = [
  "Gasoducto Sur Peruano",
  "Hospital Regional Junín",
  "Metro de Lima Línea 2",
  "Odebrecht contratos Perú",
];

export default function InvestigatorAgent() {
  const [project, setProject] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  const investigate = async (projectName?: string) => {
    const target = (projectName ?? project).trim();
    if (!target) return;
    if (projectName) setProject(projectName);

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project: target }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Error en la investigación");
      } else {
        setResult(data);
      }
    } catch {
      setError("Error de conexión. Verifica tu red e inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    investigate();
  };

  return (
    <section className="glass rounded-xl border border-blue-500/10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-blue-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center">
            <FileSearch className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Agente Investigador</h2>
            <p className="text-[10px] text-slate-500">Investigación autónoma con búsqueda web en tiempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
          <Bot className="w-3 h-3" />
          Agente IA
        </div>
      </div>

      <div className="p-5 space-y-4 flex-1">
        {/* Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Proyecto a investigar
            </label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-orange-500/40 transition-colors">
                <Search className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Ej: Gasoducto Sur Peruano, Hospital Regional..."
                  className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={!project.trim() || loading}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-xs font-semibold text-white flex items-center gap-1.5 flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldAlert className="w-3.5 h-3.5" />
                )}
                {loading ? "Investigando..." : "Investigar"}
              </button>
            </div>
          </div>

          {/* Example projects */}
          {!result && !loading && (
            <div>
              <p className="text-[10px] text-slate-600 mb-1.5">Ejemplos rápidos:</p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLE_PROJECTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => investigate(p)}
                    className="text-[11px] text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-2.5 py-1 rounded-full transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Loading state */}
        {loading && (
          <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
              <p className="text-xs font-semibold text-orange-400">Agente investigando...</p>
            </div>
            <div className="space-y-2">
              {[
                "Buscando información pública del proyecto...",
                "Analizando contratos y licitaciones...",
                "Verificando empresas contratistas...",
                "Detectando irregularidades...",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500/40 animate-pulse" style={{ animationDelay: `${i * 300}ms` }} />
                  <span className="text-[11px] text-slate-500">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-400">Error en la investigación</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-enter">
            {/* Search steps */}
            {result.steps.length > 0 && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Búsquedas realizadas ({result.steps.length})
                </p>
                <div className="space-y-1">
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                      <span className="text-[11px] text-slate-400 truncate">{step.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report */}
            <div className="rounded-xl border border-orange-500/15 bg-orange-500/5 p-4">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/8">
                <ShieldAlert className="w-4 h-4 text-orange-400" />
                <p className="text-xs font-bold text-white">Informe de Investigación</p>
                <span className="ml-auto text-[10px] text-slate-500">{project}</span>
              </div>
              <ReportContent content={result.report ?? ""} />
            </div>

            {/* Sources */}
            {result.sources.length > 0 && (
              <div className="rounded-xl border border-white/8 bg-white/3 p-3">
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Fuentes consultadas ({result.sources.length})
                </p>
                <div className="space-y-1.5">
                  {result.sources.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[11px] text-blue-400 hover:text-blue-300 transition-colors group"
                    >
                      <ChevronRight className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate flex-1">{source.url}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* New investigation button */}
            <button
              onClick={() => { setResult(null); setProject(""); }}
              className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors py-2 border border-white/8 rounded-lg hover:bg-white/5"
            >
              Nueva investigación
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
