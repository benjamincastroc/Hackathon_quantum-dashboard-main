require("dotenv").config({ path: ".env.local" });

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => {
  ctx.reply("Bot conectado 🤖");
});

bot.on("text", async (ctx) => {
  const text = ctx.message.text;

  console.log("📩 Telegram:", text);

  try {
    const response = await fetch("http://localhost:3000/api/chat", {
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
    });

    const data = await response.json();

    ctx.reply(data.content || "Sin respuesta");
  } catch (err) {
    console.error(err);
    ctx.reply("Error conectando con la IA");
  }
});

console.log("TOKEN:", process.env.TELEGRAM_TOKEN);
bot.launch();

console.log("🤖 Bot Telegram activo");