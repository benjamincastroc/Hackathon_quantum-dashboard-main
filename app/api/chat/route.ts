import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `Eres GovWatch AI, un asistente experto en auditoría anticorrupción gubernamental.
Tu rol es ayudar a auditores, funcionarios y organizaciones de transparencia a:
- Detectar anomalías y patrones de corrupción en proyectos públicos
- Analizar contratos, pagos y proveedores gubernamentales
- Interpretar métricas de riesgo y alertas del sistema
- Sugerir acciones correctivas y mejores prácticas de auditoría

Responde siempre en el idioma del usuario. Sé conciso, profesional y directo.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ],
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content ?? "Sin respuesta.";
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
