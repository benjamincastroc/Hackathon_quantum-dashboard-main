require("dotenv").config({
  path: ".env.local",
});

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const {
  Client,
  GatewayIntentBits,
  AttachmentBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// =========================
// GENERAR PDF
// =========================
async function generarPDF(nombreProyecto, contenido) {
  return new Promise((resolve, reject) => {
    const nombreArchivo = `reporte-${Date.now()}.pdf`;
    const rutaArchivo = path.join(__dirname, nombreArchivo);

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
    });

    const stream = fs.createWriteStream(rutaArchivo);

    doc.pipe(stream);

    doc
      .fontSize(22)
      .text("GovWatch AI", {
        align: "center",
      });

    doc.moveDown();

    doc
      .fontSize(14)
      .text(`Proyecto investigado: ${nombreProyecto}`);

    doc.moveDown();

    doc
      .fontSize(10)
      .text(contenido);

    doc.end();

    stream.on("finish", () => {
      resolve(rutaArchivo);
    });

    stream.on("error", reject);
  });
}

client.once("clientReady", () => {
  console.log(`✅ Bot conectado: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log("📩 Mensaje:", message.content);

  // =========================
  // COMANDO AYUDA
  // =========================
  if (message.content === "!ayuda") {
    return message.reply(`
📋 COMANDOS DISPONIBLES

🔎 !investigar [proyecto]
Genera un informe anticorrupción completo.

📡 !estado
Verifica el estado del sistema.

❓ !ayuda
Muestra esta lista de comandos.

Ejemplos:
• !investigar Odebrecht
• !investigar Petroperú
• !investigar Línea 2 Metro de Lima
`);
  }

  // =========================
  // COMANDO ESTADO
  // =========================
  if (message.content === "!estado") {
    return message.reply(
      "✅ GovWatch AI operativo.\n✅ Discord conectado.\n✅ Agente investigador activo."
    );
  }

  // =========================
  // AGENTE INVESTIGADOR
  // =========================
  if (message.content.startsWith("!investigar ")) {
    const proyecto = message.content
      .replace("!investigar ", "")
      .trim();

    try {
      await message.channel.send(
        `🔎 Investigando **${proyecto}**...`
      );

      await message.channel.send(
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

      await message.channel.send(
        "📄 Informe generado. Enviando resultados..."
      );

      // Enviar informe en bloques
      const chunks =
        reporte.match(/[\s\S]{1,1800}/g) || [];

      for (const chunk of chunks) {
        await message.channel.send(chunk);
      }

      // =========================
      // GENERAR PDF
      // =========================
      try {
        await message.channel.send(
          "📄 Generando PDF..."
        );

        const pdfPath = await generarPDF(
          proyecto,
          reporte
        );

        const archivo =
          new AttachmentBuilder(pdfPath);

        await message.channel.send({
          content:
            "📎 Informe PDF generado:",
          files: [archivo],
        });

        // Eliminar PDF temporal
        setTimeout(() => {
          try {
            fs.unlinkSync(pdfPath);
          } catch {}
        }, 5000);

      } catch (pdfError) {
        console.error(
          "❌ Error PDF:",
          pdfError
        );

        await message.channel.send(
          "⚠️ No se pudo generar el PDF."
        );
      }

    } catch (error) {
      console.error(
        "❌ Error investigador:",
        error
      );

      await message.channel.send(
        "❌ Error ejecutando la investigación."
      );
    }

    return;
  }

  // =========================
  // CHAT NORMAL GOVWATCH
  // =========================
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
              content: message.content,
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
      respuesta.match(/[\s\S]{1,1800}/g) || [];

    for (const chunk of chunks) {
      await message.reply(chunk);
    }

  } catch (error) {
    console.error("❌ Error chat:", error);

    await message.reply(
      "❌ Error conectando con GovWatch AI."
    );
  }
});

client.login(process.env.DISCORD_TOKEN);
