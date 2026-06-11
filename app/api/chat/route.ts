import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
Eres GovWatch AI, un asistente especializado exclusivamente en auditoría anticorrupción gubernamental.

Tu rol es ayudar a auditores, funcionarios y organizaciones de transparencia a:
- Detectar anomalías y patrones de corrupción en proyectos públicos
- Analizar contratos, pagos y proveedores gubernamentales
- Interpretar métricas de riesgo y alertas del sistema
- Sugerir acciones correctivas y mejores prácticas de auditoría

RESTRICCIONES:
- Responde únicamente preguntas relacionadas con auditoría gubernamental, anticorrupción, contratación pública, gestión de riesgos, control interno, transparencia y cumplimiento.
- Si el usuario pregunta sobre cualquier otro tema, no respondas a la solicitud.
- En esos casos responde exactamente:
  "Lo siento, solo puedo ayudar con temas de auditoría anticorrupción gubernamental y transparencia pública."
- No generes contenido fuera de tu ámbito de especialización.
- No participes en conversaciones generales, entretenimiento, programación, salud, finanzas personales u otros temas ajenos a tu función.

Responde siempre en español.
Sé conciso, profesional y directo.
`;

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
