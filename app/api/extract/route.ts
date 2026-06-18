import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { withRetry } from "@/lib/retry";

export const maxDuration = 30;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM = `Eres un extractor de datos estructurados para auditoría gubernamental. Analiza el informe y extrae datos JSON.

Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin texto adicional):
{
  "projects": [
    {
      "name": "string",
      "agency": "string",
      "budget": 0,
      "executed": 0,
      "progress": 0,
      "risk": 0,
      "status": "Critical",
      "contractor": "string",
      "location": "string"
    }
  ],
  "contracts": [
    {"id":"CON-001","title":"string","vendor":"string","value":"$0M","status":"Flagged","risk":"high"}
  ],
  "suppliers": [
    {"name":"string","category":"string","contracts":1,"totalValue":"$0M","score":30,"trend":"down"}
  ],
  "payments": [
    {"id":"PAY-0001","vendor":"string","amount":"$0","date":"01 ene. 2024","status":"Flagged","type":"out"}
  ],
  "anomalies": [
    {"id":1,"title":"string","project":"string","severity":"Critical","type":"Financial","date":"2024-01-01","description":"string","impact":0}
  ]
}

Reglas:
- projects: lista TODOS los proyectos gubernamentales mencionados en el informe, NO solo el principal
- budget/impact: número entero (monto en soles o USD sin símbolo)
- executed/progress: porcentaje 0-100 (sin símbolo %)
- risk: entero 0-100 según nivel de riesgo
- status proyecto: "Critical" si riesgo>70, "Warning" si >50, "Review" si >30, "Healthy" si ≤30
- Incluye TODAS las empresas mencionadas como suppliers y contracts
- TODAS las irregularidades como anomalies con descripción detallada
- Si no hay datos concretos para un campo numérico, infiere según el contexto
- Retorna SOLO el JSON puro sin ningún texto adicional`;

export async function POST(req: NextRequest) {
  try {
    const { report, projectName, investigationId } = (await req.json()) as {
      report: string;
      projectName: string;
      investigationId?: string;
    };

    if (!report?.trim()) {
      return NextResponse.json({ error: "Falta el informe" }, { status: 400 });
    }

    const completion = await withRetry(() =>
      groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Proyecto: ${projectName}\n\nInforme de investigación:\n${report.slice(0, 4000)}`,
          },
        ],
        max_tokens: 2048,
        temperature: 0.1,
      })
    );

    const raw = completion.choices[0]?.message?.content ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("[Extract] JSON no encontrado:", raw.slice(0, 200));
      return NextResponse.json({ error: "JSON no encontrado en respuesta" }, { status: 500 });
    }

    const structured = JSON.parse(match[0]);

    // Normalizar: si el LLM devuelve "project" singular en lugar de "projects" array, convertirlo
    if (!structured.projects && structured.project) {
      structured.projects = [structured.project];
    }
    if (!structured.projects || structured.projects.length === 0) {
      structured.projects = [];
    }
    // project singular = el de mayor riesgo (para compatibilidad con otros paneles)
    structured.project = structured.projects.reduce(
      (max: typeof structured.projects[0], p: typeof structured.projects[0]) => (p.risk > (max?.risk ?? 0) ? p : max),
      structured.projects[0] ?? null
    );

    console.log("[Extract] OK — proyectos:", structured.projects.length, "contratos:", structured.contracts?.length, "proveedores:", structured.suppliers?.length);

    // Persistir en Supabase si hay investigationId
    if (investigationId) {
      const { error: dbErr } = await supabase.from("investigation_structured").upsert(
        {
          investigation_id: investigationId,
          project_name: projectName,
          project: structured.project ?? null,
          projects: structured.projects ?? [],
          contracts: structured.contracts ?? [],
          suppliers: structured.suppliers ?? [],
          payments: structured.payments ?? [],
          anomalies: structured.anomalies ?? [],
        },
        { onConflict: "investigation_id" }
      );
      if (dbErr) {
        console.error("[Extract] Supabase error:", dbErr.code, dbErr.message);
        if (dbErr.code === "42P01") {
          console.error("[Extract] La tabla 'investigation_structured' no existe. Ejecuta el script supabase-schema.sql");
        }
      } else {
        console.log("[Extract] Guardado en Supabase — investigation_id:", investigationId);
      }
    }

    return NextResponse.json({ structured });
  } catch (err) {
    console.error("[Extract] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
