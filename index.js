const { Telegraf, Markup } = require("telegraf");
const { Spot } = require(`@binance/connector`);
require("dotenv").config();

const binance = new Spot(
  process.env.BINANCE_API_KEY,
  process.env.BINANCE_SECRET_KEY
);
const bot = new Telegraf(process.env.BOT_TOKEN);

async function getPrice() {
  const market = await binance.ticker24hr(`BTCUSDT`);
  if (!market.data) {
    return;
  }
  return market.data;
}

async function getHome(ctx) {
  await ctx.sendMessage(
    `Hallo <i>${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name}</i>,\n\nSaya adalah Bot Telegram yang dibuat oleh <b>Adip Perdana</b> untuk membantu pembelajaran JavaScript menggunakan NodeJS dan Telegraf Package. Terus berkarya dengan coding dan tetap semangat!`,
    {
      parse_mode: `HTML`,
    }
  );

  await ctx.sendMessage(
    `Gunakan menu pilihan dibawah:`,
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          `Lihat Harga Cryptocurrencies`,
          `getCryptoPrice`
        ),
      ],
      [Markup.button.callback(`Kembali ke Menu Awal`, `getHome`)],
    ])
  );
}

bot.start(async (ctx) => {
  // await ctx.deleteMessage();
  if (ctx.startPayload) {
    ctx.sendMessage(
      `Kamu menggunakan bot ini dengan kode <code>${ctx.startPayload}</code>.`,
      {
        parse_mode: `HTML`,
        reply_to_message_id: ctx.update.message.message_id,
      }
    );
  }

  await getHome(ctx);
});

bot.action(`getCryptoPrice`, async (ctx) => {
  const price = getPrice();
  const arrow =
    parseInt(price.lastPrice) - parseInt(price.prevClosePrice) < 0
      ? `🔴`
      : `🟢`;
  const messages = `Harga Cryptocurrencies saat ini diambil dari data <b>Binance API</b>\n\n${arrow} ${
    price.priceChangePercent
  }% | ${price.symbol} | $${parseFloat(price.lastPrice).toFixed(2)} USDT`;
  await ctx.sendMessage(messages, {
    parse_mode: `HTML`,
  });
});

bot.launch();
