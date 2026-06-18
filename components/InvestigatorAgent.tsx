"use client";

import { useState } from "react";
import {
  Search,
  Bot,
  AlertTriangle,
  ExternalLink,
  Loader2,
  FileSearch,
  ShieldAlert,
  CheckCircle2,
  Link2,
  Hash,
  Fingerprint,
  Copy,
  Check,
  FileText,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { saveInvestigation } from "@/lib/investigation-store";

interface Step {
  type: "search" | "thinking";
  content: string;
}

interface Source {
  title: string;
  url: string;
  content: string;
  sha256: string;
  isPdf?: boolean;
  pages?: number;
  sizeBytes?: number;
  docId?: string;
}

interface Result {
  report: string;
  steps: Step[];
  sources: Source[];
  investigationId?: string;
}

interface StampState {
  status: "idle" | "loading" | "done" | "error";
  txHash?: string;
  explorerUrl?: string;
  error?: string;
}

type DashboardStatus = "idle" | "extracting" | "done" | "error";

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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0">
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function DocumentCard({ source, index }: { source: Source; index: number }) {
  const [stamp, setStamp] = useState<StampState>({ status: "idle" });

  const handleStamp = async () => {
    if (!source.docId) return;
    setStamp({ status: "loading" });
    try {
      const res = await fetch("/api/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: source.docId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStamp({ status: "error", error: data.error });
      } else {
        setStamp({
          status: "done",
          txHash: data.txHash,
          explorerUrl: data.explorerUrl,
        });
      }
    } catch {
      setStamp({ status: "error", error: "Error de conexión" });
    }
  };

  return (
    <div className="rounded-lg border border-white/8 bg-white/2 p-3 space-y-2">
      {/* Title + URL */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-[11px] font-semibold text-slate-300 truncate">{source.title}</p>
            {source.isPdf && (
              <span className="flex-shrink-0 flex items-center gap-0.5 text-[9px] font-bold text-red-300 bg-red-500/15 border border-red-500/20 px-1.5 py-0.5 rounded">
                <FileText className="w-2.5 h-2.5" />
                PDF {source.pages ? `· ${source.pages}p` : ""}{source.sizeBytes ? ` · ${(source.sizeBytes / 1024).toFixed(0)}KB` : ""}
              </span>
            )}
          </div>
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
            <span className="truncate">{source.url}</span>
          </a>
        </div>
        <span className="text-[10px] text-slate-600 flex-shrink-0">#{index + 1}</span>
      </div>

      {/* SHA-256 */}
      <div className="rounded bg-black/30 border border-white/5 px-2.5 py-1.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Hash className="w-3 h-3 text-cyan-400" />
          <span className="text-[9px] font-semibold text-cyan-400 uppercase tracking-wider">SHA-256</span>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-[10px] text-slate-400 font-mono truncate flex-1">
            {source.sha256}
          </code>
          <CopyButton text={source.sha256} />
        </div>
      </div>

      {/* Syscoin stamp */}
      {stamp.status === "idle" && (
        <button
          onClick={handleStamp}
          disabled={!source.docId}
          className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg py-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Fingerprint className="w-3.5 h-3.5" />
          Sellar en Syscoin Blockchain
        </button>
      )}

      {stamp.status === "loading" && (
        <div className="flex items-center justify-center gap-2 text-[11px] text-purple-400 py-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Enviando transacción...
        </div>
      )}

      {stamp.status === "done" && stamp.txHash && (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold text-emerald-400">Sellado en Syscoin NEVM</span>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-[10px] text-slate-400 font-mono truncate flex-1">{stamp.txHash}</code>
            <CopyButton text={stamp.txHash} />
          </div>
          <a
            href={stamp.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Link2 className="w-3 h-3" />
            Ver en explorador Tanenbaum
          </a>
        </div>
      )}

      {stamp.status === "error" && (
        <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-2 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-semibold text-orange-400">No se pudo sellar</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{stamp.error}</p>
            <button
              onClick={() => setStamp({ status: "idle" })}
              className="text-[10px] text-orange-400 hover:underline mt-1"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}
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
  const [dashboardStatus, setDashboardStatus] = useState<DashboardStatus>("idle");

  const extractAndSave = async (report: string, projectName: string, investigationId?: string) => {
    setDashboardStatus("extracting");
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report, projectName, investigationId }),
      });
      const data = await res.json();
      if (res.ok && data.structured) {
        saveInvestigation({
          ...data.structured,
          projects: data.structured.projects ?? (data.structured.project ? [data.structured.project] : []),
          projectName,
          investigatedAt: new Date().toISOString(),
        });
        setDashboardStatus("done");
      } else {
        setDashboardStatus("error");
      }
    } catch {
      setDashboardStatus("error");
    }
  };

  const investigate = async (projectName?: string) => {
    const target = (projectName ?? project).trim();
    if (!target) return;
    if (projectName) setProject(projectName);

    setLoading(true);
    setError(null);
    setResult(null);
    setDashboardStatus("idle");

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
        extractAndSave(data.report, target, data.investigationId);
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
            <p className="text-[10px] text-slate-500">Investigación autónoma · Huella SHA-256 · Blockchain Syscoin</p>
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

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-white/8 bg-white/3 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
              <p className="text-xs font-semibold text-orange-400">Agente investigando...</p>
            </div>
            <div className="space-y-2">
              {[
                "Buscando en portales oficiales del Estado...",
                "Analizando contratos y licitaciones (SEACE, OSCE)...",
                "Descargando y extrayendo texto de documentos PDF...",
                "Generando huellas SHA-256 de cada documento...",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-orange-500/40 animate-pulse"
                    style={{ animationDelay: `${i * 300}ms` }}
                  />
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
            {/* Steps */}
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
                {result.investigationId && (
                  <span className="ml-auto text-[9px] text-slate-600 font-mono truncate max-w-[120px]">
                    ID: {result.investigationId.slice(0, 8)}…
                  </span>
                )}
              </div>
              <ReportContent content={result.report ?? ""} />
            </div>

            {/* Documents + Blockchain */}
            {result.sources.length > 0 && (
              <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-purple-500/10">
                  <Fingerprint className="w-4 h-4 text-purple-400" />
                  <p className="text-xs font-bold text-white">Documentos con Huella Digital</p>
                  <span className="ml-auto text-[10px] text-slate-500">{result.sources.length} fuentes</span>
                </div>
                <div className="space-y-3">
                  {result.sources.map((source, i) => (
                    <DocumentCard key={i} source={source} index={i} />
                  ))}
                </div>
                <p className="text-[10px] text-slate-600 mt-3 text-center">
                  Cada documento tiene un hash SHA-256 único. Al sellar en Syscoin NEVM (testnet Tanenbaum), el hash queda registrado de forma inmutable en la blockchain.
                </p>
              </div>
            )}

            {/* Dashboard update status */}
            {dashboardStatus === "extracting" && (
              <div className="flex items-center gap-2 text-[11px] text-cyan-400 bg-cyan-500/8 border border-cyan-500/15 rounded-lg px-3 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
                <span>Actualizando módulos del dashboard con datos reales...</span>
              </div>
            )}

            {dashboardStatus === "done" && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-emerald-400">
                    Dashboard actualizado con datos reales de la investigación
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Contratos, proveedores, pagos y anomalías reflejan ahora los hallazgos de esta investigación.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {[
                    { label: "Contratos", href: "/contracts" },
                    { label: "Proveedores", href: "/suppliers" },
                    { label: "Pagos", href: "/payments" },
                    { label: "Análisis de Riesgo", href: "/risk" },
                  ].map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-2 py-0.5 rounded-full transition-colors"
                    >
                      <LayoutDashboard className="w-2.5 h-2.5" />
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Nueva investigación */}
            <button
              onClick={() => { setResult(null); setProject(""); setDashboardStatus("idle"); }}
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
