import { NextRequest, NextResponse } from "next/server";

// =========================
// VERIFICAR WEBHOOK META
// =========================
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  ) {
    console.log("✅ Webhook verificado");
    return new Response(challenge);
  }

  return NextResponse.json(
    { error: "verification failed" },
    { status: 403 }
  );
}

// =========================
// RECIBIR MENSAJES
// =========================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(
      "📩 WhatsApp:",
      JSON.stringify(body, null, 2)
    );

    const value =
      body?.entry?.[0]?.changes?.[0]?.value;

    const message =
      value?.messages?.[0];

    if (!message) {
      return NextResponse.json({
        ok: true,
      });
    }

    const text =
      message.text?.body || "";

    const from =
      message.from;

    const phoneNumberId =
      process.env.PHONE_NUMBER_ID ||
      process.env.WHATSAPP_PHONE_NUMBER_ID ||
      value?.metadata?.phone_number_id;

    const token =
      process.env.WHATSAPP_TOKEN ||
      process.env.WHATSAPP_ACCESS_TOKEN;

    let reply = "";

    // =========================
    // INVESTIGAR
    // =========================
    if (
      text
        .toLowerCase()
        .startsWith("investigar ")
    ) {
      const proyecto = text
        .replace(/^investigar\s+/i, "")
        .trim();

      console.log(
        "🔎 Investigación:",
        proyecto
      );

      const response = await fetch(
        "http://localhost:3000/api/agent",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            project: proyecto,
          }),
        }
      );

      const data =
        await response.json();

      reply =
        data.report ||
        "No se pudo generar el informe.";
    }

    // =========================
    // ESTADO
    // =========================
    else if (
      text.toLowerCase() ===
      "estado"
    ) {
      reply = `
✅ GovWatch AI operativo

✅ WhatsApp conectado

✅ Agente investigador activo

✅ Blockchain activo

✅ Sistema listo
`;
    }

    // =========================
    // CHAT NORMAL
    // =========================
    else {
      const response = await fetch(
        "http://localhost:3000/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: text,
              },
            ],
          }),
        }
      );

      const data =
        await response.json();

      reply =
        data.content ||
        "Lo siento, no pude generar una respuesta.";
    }

    // =========================
    // LÍMITE WHATSAPP
    // =========================
    if (reply.length > 3500) {
      reply =
        reply.substring(0, 3500) +
        "\n\n⚠️ Informe resumido automáticamente para WhatsApp.";
    }

    console.log("🤖 Respuesta:", reply);

    // =========================
    // ENVIAR RESPUESTA
    // =========================
    const sendResponse = await fetch(
      `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          messaging_product:
            "whatsapp",
          to: from,
          type: "text",
          text: {
            body: reply,
          },
        }),
      }
    );

    const sendData =
      await sendResponse.json();

    console.log(
      "📤 WhatsApp Response:",
      sendData
    );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(
      "❌ Error WhatsApp:",
      error
    );

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}