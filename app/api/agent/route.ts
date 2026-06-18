import Groq from "groq-sdk";
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sha256 } from "@/lib/blockchain";
import { isPdfUrl, extractPdf } from "@/lib/pdf";
import { withRetry } from "@/lib/retry";

export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
});


interface RawTavilyResult {
  title: string;
  url: string;
  content: string;
}

interface SearchedSource {
  title: string;
  url: string;
  content: string;
  isPdf?: boolean;
  pages?: number;
  sizeBytes?: number;
}

// Dominios oficiales de gobierno y organismos de control
const GOV_DOMAINS = [
  // Perú — portales de transparencia y contrataciones
  "gob.pe",
  "contraloria.gob.pe",
  "osce.gob.pe",
  "seace.gob.pe",
  "mef.gob.pe",
  "transparencia.gob.pe",
  "datosabiertos.gob.pe",
  "invierte.gob.pe",
  "perucompras.gob.pe",
  // Periodismo de investigación y organismos internacionales
  "ojo-publico.com",
  "idl-reporteros.pe",
  "occrp.org",
  "opencontracting.org",
  "worldbank.org",
  "iadb.org",
];

let lastTavilyResults: RawTavilyResult[] = [];

async function searchWeb(query: string, restrictDomains = true): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return "ERROR: TAVILY_API_KEY no configurada en .env.local";

  try {
    const body: Record<string, unknown> = {
      api_key: apiKey,
      query,
      search_depth: "basic",
      max_results: 4,
      include_answer: true,
      include_raw_content: false,
    };

    if (restrictDomains) body.include_domains = GOV_DOMAINS;

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const body = await res.text();
      return `Error en búsqueda (${res.status}): ${body}`;
    }

    const data = await res.json();
    lastTavilyResults = data.results ?? [];

    const answer = data.answer ? `**Resumen:** ${data.answer.slice(0, 300)}\n\n` : "";
    const results = lastTavilyResults
      .map((r) => `**${r.title}**\nURL: ${r.url}\n${r.content?.slice(0, 250)}`)
      .join("\n\n---\n\n");

    console.log("[Agent] Tavily resultados:", lastTavilyResults.length);
    return answer + (results || "Sin resultados");
  } catch (err) {
    console.error("[Agent] Tavily fetch error:", err);
    return `Error al conectar con Tavily: ${err}`;
  }
}

export interface AgentStep {
  type: "search" | "thinking";
  content: string;
}

export interface AgentSource {
  title: string;
  url: string;
  content: string;
  sha256: string;
  isPdf?: boolean;
  pages?: number;
  sizeBytes?: number;
  docId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { project } = await req.json();
    console.log("[Agent] Investigando proyecto:", project);

    if (!project?.trim()) {
      return NextResponse.json({ error: "Se requiere el nombre del proyecto" }, { status: 400 });
    }

    // ── FASE 1: generar queries y ejecutar búsquedas directamente ─────────
    const steps: AgentStep[] = [];
    const searchedSources: SearchedSource[] = [];

    const queryResponse = await withRetry(() =>
      groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "Eres un investigador anticorrupción. Genera consultas de búsqueda web específicas para investigar el proyecto dado. Responde SOLO con un array JSON de strings, sin texto adicional. Ejemplo: [\"query 1\",\"query 2\",\"query 3\",\"query 4\"]",
          },
          {
            role: "user",
            content: `Genera 4 consultas de búsqueda para investigar irregularidades en el proyecto gubernamental: "${project}". Cubre: nombre del proyecto + irregularidades, contratistas/empresas, presupuesto/licitación SEACE, contraloría/auditoría.`,
          },
        ],
        max_tokens: 256,
        temperature: 0.2,
      })
    );

    const queriesRaw = queryResponse.choices[0].message.content ?? "[]";
    const queriesMatch = queriesRaw.match(/\[[\s\S]*?\]/);
    let queries: string[] = queriesMatch
      ? (JSON.parse(queriesMatch[0]) as string[])
      : [`${project} irregularidades`, `${project} contratistas SEACE`, `${project} contraloría auditoría`, `${project} presupuesto licitación`];
    queries = queries.slice(0, 4);

    console.log("[Agent] Queries generadas:", queries);

    for (const query of queries) {
      steps.push({ type: "search", content: query });
      let results = await searchWeb(query, true);
      if (lastTavilyResults.length === 0) {
        console.log("[Agent] Sin resultados gov, ampliando...");
        results = await searchWeb(query, false);
      }
      console.log(`[Agent] "${query}" → ${lastTavilyResults.length} resultados`);
      for (const raw of lastTavilyResults) {
        if (!searchedSources.find((s) => s.url === raw.url)) {
          searchedSources.push({ title: raw.title, url: raw.url, content: raw.content ?? "" });
        }
      }
      void results;
    }

    // ── FASE 2: informe final con OpenRouter (Gemini Flash) ───────────────
    const sourceSummary = searchedSources
      .slice(0, 10)
      .map((s, i) => `[${i + 1}] ${s.title}\nURL: ${s.url}\n${s.content.slice(0, 500)}`)
      .join("\n\n");

    const reportResponse = await withRetry(() =>
      openrouter.chat.completions.create({
        model: "openai/gpt-oss-120b:free",
        messages: [
          {
            role: "system",
            content: "Eres un auditor anticorrupción experto. Redacta informes detallados en español basándote en las fuentes proporcionadas. Sé concreto con montos, fechas, nombres y RUCs cuando aparezcan.",
          },
          {
            role: "user",
            content: `Con base en estas fuentes sobre el proyecto "${project}", redacta un informe de auditoría anticorrupción con exactamente estas secciones:\n\n## Resumen Ejecutivo\n## Irregularidades Detectadas\n## Empresas y Personas Involucradas\n## Fuentes Consultadas\n## Nivel de Riesgo (Crítico / Alto / Medio / Bajo)\n\nFuentes encontradas:\n\n${sourceSummary}`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.3,
      })
    );

    const report = reportResponse.choices[0].message.content ?? "";
    console.log("[Agent] Informe OpenRouter generado, chars:", report.length);

    // ── FASE 3: PDFs + SHA-256 + Supabase ──────────────────────────────────
    await Promise.all(
      searchedSources.map(async (src) => {
        if (isPdfUrl(src.url)) {
          const pdf = await extractPdf(src.url);
          if (pdf) {
            src.content = pdf.content;
            src.isPdf = true;
            src.pages = pdf.pages;
            src.sizeBytes = pdf.sizeBytes;
            console.log(`[Agent] PDF: ${src.url} (${pdf.pages}p)`);
          }
        }
      })
    );

    const sources: AgentSource[] = searchedSources.map((s) => ({
      ...s,
      sha256: sha256(s.content || s.url),
    }));

    let investigationId: string | undefined;
    try {
      const { data: inv } = await supabase
        .from("investigations")
        .insert({ project_name: project, report, steps })
        .select("id")
        .single();

      if (inv?.id) {
        investigationId = inv.id;
        const docs = sources.map((s) => ({
          investigation_id: inv.id,
          url: s.url,
          title: s.title,
          content: s.content,
          sha256: s.sha256,
          is_pdf: s.isPdf ?? false,
          pdf_pages: s.pages ?? null,
          pdf_size_bytes: s.sizeBytes ?? null,
        }));
        const { data: savedDocs } = await supabase.from("documents").insert(docs).select("id, url");
        if (savedDocs) {
          for (const src of sources) {
            const match = savedDocs.find((d) => d.url === src.url);
            if (match) src.docId = match.id;
          }
        }
      }
    } catch (dbErr) {
      console.error("[Agent] Supabase error (no crítico):", dbErr);
    }

    return NextResponse.json({ report, steps, sources, investigationId });
  } catch (error) {
    console.error("[Agent] Error fatal:", error);
    const msg = String(error);
    if (msg.includes("tokens per day") || msg.includes("TPD")) {
      const waitMatch = msg.match(/try again in (.+?)\./);
      const wait = waitMatch ? waitMatch[1] : "unos minutos";
      return NextResponse.json(
        { error: `Límite diario de Groq alcanzado. Intenta de nuevo en ${wait}.` },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: `Error interno: ${error}` }, { status: 500 });
  }
}
