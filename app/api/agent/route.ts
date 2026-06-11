import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sha256 } from "@/lib/blockchain";
import { isPdfUrl, extractPdf } from "@/lib/pdf";

export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const AGENT_PROMPT = `Eres un agente investigador especializado en auditoría anticorrupción gubernamental.
Tu tarea es investigar un proyecto gubernamental específico usando las herramientas disponibles.

Las búsquedas están restringidas a portales oficiales del Estado (Contraloría, OSCE, SEACE, MEF, Transparencia Económica, datos abiertos) y medios de periodismo de investigación reconocidos. Prioriza siempre estas fuentes primarias.

Proceso obligatorio:
1. Realiza AL MENOS 3 búsquedas con diferentes términos (nombre del proyecto, empresa contratista, irregularidades, presupuesto, licitación, RUC, SEACE)
2. Analiza contratos, pagos, proveedores y beneficiarios encontrados en fuentes oficiales
3. Identifica irregularidades: sobrecostos, pagos sin obra, empresas fantasma, conflictos de interés, licitaciones amañadas
4. Documenta la fuente exacta (URL del portal oficial) de cada hallazgo

Al terminar, entrega un informe en español con estas secciones exactas:
## Resumen Ejecutivo
## Irregularidades Detectadas
## Empresas y Personas Involucradas
## Fuentes Consultadas
## Nivel de Riesgo (Crítico / Alto / Medio / Bajo)

Sé metódico, cita datos concretos (montos, fechas, nombres) cuando los encuentres.`;

const tools: Groq.Chat.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Busca información en internet sobre el proyecto gubernamental investigado",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Términos de búsqueda específicos en español o inglés",
          },
        },
        required: ["query"],
      },
    },
  },
];

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
      max_results: 5,
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

    const answer = data.answer ? `**Resumen:** ${data.answer}\n\n` : "";
    const results = lastTavilyResults
      .map((r) => `**${r.title}**\nURL: ${r.url}\n${r.content?.slice(0, 600)}`)
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

    const messages: Groq.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: AGENT_PROMPT },
      {
        role: "user",
        content: `Investiga este proyecto gubernamental y encuentra todas las irregularidades posibles:\n\n**Proyecto:** ${project}\n\nSé exhaustivo. Usa múltiples búsquedas con distintos ángulos.`,
      },
    ];

    const steps: AgentStep[] = [];
    const searchedSources: SearchedSource[] = [];

    for (let i = 0; i < 6; i++) {
      const forceSearch = steps.length < 3;

      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages,
        tools,
        tool_choice: forceSearch ? "required" : "auto",
        max_tokens: 2048,
        temperature: 0.3,
      });

      const choice = response.choices[0];
      const message = choice.message;
      console.log(`[Agent] Iteración ${i}, finish_reason: ${choice.finish_reason}`);

      messages.push(message as Groq.Chat.ChatCompletionMessageParam);

      if (choice.finish_reason === "stop") {
        const report = message.content ?? "";

        // Extraer contenido completo de PDFs en paralelo
        await Promise.all(
          searchedSources.map(async (src) => {
            if (isPdfUrl(src.url)) {
              const pdf = await extractPdf(src.url);
              if (pdf) {
                src.content = pdf.content;
                src.isPdf = true;
                src.pages = pdf.pages;
                src.sizeBytes = pdf.sizeBytes;
                console.log(`[Agent] PDF procesado: ${src.url} (${pdf.pages}p, ${(pdf.sizeBytes/1024).toFixed(0)}KB)`);
              }
            }
          })
        );

        // Calcular sha256 sobre el contenido completo (PDF o snippet)
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

            const { data: savedDocs } = await supabase
              .from("documents")
              .insert(docs)
              .select("id, url");

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
      }

      if (choice.finish_reason === "tool_calls" && message.tool_calls) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === "search_web") {
            const args = JSON.parse(toolCall.function.arguments) as { query: string };
            steps.push({ type: "search", content: args.query });

            let result = await searchWeb(args.query, true);

            // Si la búsqueda restringida no retornó resultados, ampliar sin restricción
            if (lastTavilyResults.length === 0) {
              console.log("[Agent] Sin resultados en dominios gov, ampliando búsqueda...");
              result = await searchWeb(args.query, false);
            }

            // Capturar fuentes con contenido real desde Tavily
            for (const raw of lastTavilyResults) {
              if (!searchedSources.find((s) => s.url === raw.url)) {
                searchedSources.push({
                  title: raw.title,
                  url: raw.url,
                  content: raw.content ?? "",
                });
              }
            }

            messages.push({
              role: "tool",
              content: result,
              tool_call_id: toolCall.id,
            });
          }
        }
      }
    }

    console.log("[Agent] Límite de iteraciones alcanzado");
    return NextResponse.json({ error: "El agente alcanzó el límite de iteraciones" }, { status: 500 });
  } catch (error) {
    console.error("[Agent] Error fatal:", error);
    return NextResponse.json({ error: `Error interno: ${error}` }, { status: 500 });
  }
}
