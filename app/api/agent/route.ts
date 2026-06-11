import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

// Extender timeout a 60s (el loop puede tardar bastante)
export const maxDuration = 60;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const AGENT_PROMPT = `Eres un agente investigador especializado en auditoría anticorrupción gubernamental.
Tu tarea es investigar un proyecto gubernamental específico usando las herramientas disponibles.

Proceso obligatorio:
1. Realiza AL MENOS 3 búsquedas con diferentes términos (nombre del proyecto, empresa contratista, irregularidades, presupuesto, licitación)
2. Analiza contratos, pagos, proveedores y beneficiarios encontrados
3. Identifica irregularidades: sobrecostos, pagos sin obra, empresas fantasma, conflictos de interés, licitaciones amañadas
4. Documenta la fuente de cada hallazgo

Al terminar, entrega un informe en español con estas secciones exactas:
## Resumen Ejecutivo
## Irregularidades Detectadas
## Empresas y Personas Involucradas
## Fuentes Consultadas
## Nivel de Riesgo (Crítico / Alto / Medio / Bajo)

Sé metódico, cita datos concretos (montos, fechas, nombres) cuando los encuentres.`;

const tools: Groq.Chat.CompletionCreateParams.Tool[] = [
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

async function searchWeb(query: string): Promise<string> {
  const apiKey = process.env.TAVILY_API_KEY;
  console.log("[Agent] searchWeb llamado:", query);
  console.log("[Agent] TAVILY_API_KEY presente:", !!apiKey);

  if (!apiKey) return "ERROR: TAVILY_API_KEY no configurada en .env.local";

  try {
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: 5,
        include_answer: true,
        include_raw_content: false,
      }),
    });

    console.log("[Agent] Tavily status:", res.status);

    if (!res.ok) {
      const body = await res.text();
      console.error("[Agent] Tavily error body:", body);
      return `Error en búsqueda (${res.status}): ${body}`;
    }

    const data = await res.json();
    const answer = data.answer ? `**Resumen:** ${data.answer}\n\n` : "";
    const results = (data.results ?? [])
      .map((r: { title: string; url: string; content: string }) =>
        `**${r.title}**\nURL: ${r.url}\n${r.content?.slice(0, 600)}`
      )
      .join("\n\n---\n\n");

    console.log("[Agent] Tavily resultados:", data.results?.length ?? 0);
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
    const sources: AgentSource[] = [];

    for (let i = 0; i < 6; i++) {
      const forceSearch = steps.length < 3;
      console.log(`[Agent] Iteración ${i}, búsquedas hasta ahora: ${steps.length}, forzar: ${forceSearch}`);

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
      console.log(`[Agent] finish_reason: ${choice.finish_reason}, tool_calls: ${message.tool_calls?.length ?? 0}`);

      messages.push(message as Groq.Chat.ChatCompletionMessageParam);

      if (choice.finish_reason === "stop") {
        console.log("[Agent] Agente terminó con informe final");
        return NextResponse.json({ report: message.content, steps, sources });
      }

      if (choice.finish_reason === "tool_calls" && message.tool_calls) {
        for (const toolCall of message.tool_calls) {
          if (toolCall.function.name === "search_web") {
            const args = JSON.parse(toolCall.function.arguments) as { query: string };
            steps.push({ type: "search", content: args.query });

            const result = await searchWeb(args.query);

            const urlMatches = result.matchAll(/URL: (https?:\/\/[^\n]+)/g);
            for (const match of urlMatches) {
              const url = match[1].trim();
              if (!sources.find((s) => s.url === url)) {
                sources.push({ title: args.query, url });
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
