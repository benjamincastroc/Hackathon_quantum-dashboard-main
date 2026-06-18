require("dotenv").config({
  path: ".env.local",
});

const { Telegraf } = require("telegraf");

const bot = new Telegraf(
  process.env.TELEGRAM_TOKEN
);

// =========================
// START
// =========================
bot.start((ctx) => {
  ctx.reply(`
🤖 GovWatch AI

Bienvenido al sistema de auditoría anticorrupción.

Comandos disponibles:

📋 /ayuda
📡 /estado
🔎 /investigar [proyecto]

Ejemplos:

/investigar Odebrecht
/investigar Petroperú
/investigar Línea 2 Metro de Lima
`);
});

// =========================
// AYUDA
// =========================
bot.command("ayuda", (ctx) => {
  ctx.reply(`
📋 COMANDOS DISPONIBLES

🔎 /investigar [proyecto]
Genera un informe anticorrupción completo.

📡 /estado
Verifica el estado del sistema.

❓ /ayuda
Muestra esta lista de comandos.

Ejemplos:

/investigar Odebrecht
/investigar Petroperú
/investigar Línea 2 Metro de Lima
`);
});

// =========================
// ESTADO
// =========================
bot.command("estado", (ctx) => {
  ctx.reply(`
✅ GovWatch AI operativo
✅ Telegram conectado
✅ Agente investigador activo
`);
});

// =========================
// INVESTIGAR
// =========================
bot.command("investigar", async (ctx) => {
  const proyecto = ctx.message.text
    .replace("/investigar", "")
    .trim();

  if (!proyecto) {
    return ctx.reply(
      "⚠️ Debes indicar un proyecto.\n\nEjemplo:\n/investigar Odebrecht"
    );
  }

  try {
    await ctx.reply(
      `🔎 Investigando ${proyecto}...`
    );

    await ctx.reply(
      "📚 Analizando fuentes oficiales y periodísticas..."
    );

    const response = await fetch(
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

    const data = await response.json();

    const reporte =
      data.report ||
      "❌ No se pudo generar el informe.";

    await ctx.reply(
      "📄 Informe generado. Enviando resultados..."
    );

    const chunks =
      reporte.match(/[\s\S]{1,4000}/g) || [];

    for (const chunk of chunks) {
      await ctx.reply(chunk);
    }

  } catch (error) {
    console.error(
      "❌ Error investigador:",
      error
    );

    await ctx.reply(
      "❌ Error ejecutando la investigación."
    );
  }
});

// =========================
// CHAT NORMAL
// =========================
bot.on("text", async (ctx) => {
  const text = ctx.message.text;

  // Ignorar comandos
  if (text.startsWith("/")) return;

  console.log("📩 Telegram:", text);

  try {
    const response = await fetch(
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

    const data = await response.json();

    const respuesta =
      data.content ||
      "No pude generar una respuesta.";

    const chunks =
      respuesta.match(/[\s\S]{1,4000}/g) || [];

    for (const chunk of chunks) {
      await ctx.reply(chunk);
    }

  } catch (error) {
    console.error(
      "❌ Error chat:",
      error
    );

    await ctx.reply(
      "❌ Error conectando con GovWatch AI."
    );
  }
});

console.log(
  "TOKEN:",
  process.env.TELEGRAM_TOKEN
);

bot.launch();

console.log(
  "🤖 Bot Telegram activo"
);