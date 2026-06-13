"use client";
import { Bot, Search } from "lucide-react";

interface Props {
  message?: string;
}

export default function EmptyInvestigation({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4">
        <Bot className="w-7 h-7 text-orange-400/60" />
      </div>
      <p className="text-sm font-semibold text-slate-400">Sin investigación activa</p>
      <p className="text-xs text-slate-600 mt-1 mb-5 max-w-xs leading-relaxed">
        {message ?? "Inicia una investigación para ver datos reales extraídos por el agente IA."}
      </p>
      <a
        href="/agent"
        className="flex items-center gap-2 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 px-4 py-2 rounded-lg transition-colors"
      >
        <Search className="w-3.5 h-3.5" />
        Ir al Agente Investigador
      </a>
    </div>
  );
}
