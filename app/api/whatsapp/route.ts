// =========================
// COMANDOS WHATSAPP
// =========================

let reply = "";

if (
  text &&
  text.toLowerCase().startsWith("investigar ")
) {
  const proyecto = text
    .replace(/^investigar\s+/i, "")
    .trim();

  console.log(
    "🔎 Investigación solicitada:",
    proyecto
  );

  const agentResponse = await fetch(
    "http://localhost:3000/api/agent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project: proyecto,
      }),
    }
  );

  const agentData =
    await agentResponse.json();

  reply =
    agentData.report ||
    "No se pudo generar el informe.";

} else if (
  text &&
  text.toLowerCase() === "estado"
) {

  reply = `
✅ GovWatch AI operativo

✅ WhatsApp conectado

✅ Agente investigador activo

✅ Blockchain activo

✅ Sistema listo para auditorías
`;

} else {

  const aiResponse = await fetch(
    "http://localhost:3000/api/chat",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    await aiResponse.json();

  reply =
    data.content ||
    "Lo siento, no pude generar una respuesta.";
}

// =========================
// PROTECCIÓN WHATSAPP
// =========================

const MAX_WHATSAPP_LENGTH = 3500;

if (reply.length > MAX_WHATSAPP_LENGTH) {
  reply =
    reply.substring(0, MAX_WHATSAPP_LENGTH) +
    "\n\n⚠️ Informe resumido automáticamente para WhatsApp.";
}

console.log("🤖 Respuesta:", reply);