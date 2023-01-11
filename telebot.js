const { Telegraf, Markup } = require("telegraf");
const { Spot } = require(`@binance/connector`);
require(`dotenv`).config();

const bot = new Telegraf(process.env.BOT_TOKEN_NEW);
const adminId = 1080449574;

(async () => {
  try {
    bot.start(async (ctx) => {
      if (ctx.message.from.id != adminId) {
        await ctx.sendMessage(
          `Kamu tidak memiliki akses untuk menggunakan bot ini!`
        );
        return;
      }
      await ctx.replyWithHTML(
        `Halo, saya adalah telegram bot api yang dibuat menggunakan nodejs dan package telegraf.\n\n` +
          `Saya dibuat oleh <b>Adip Perdana</b> dengan penuh semangat!`,
        Markup.inlineKeyboard([
          [
            Markup.button.callback(
              `Lihat harga Cryptocurrencies`,
              `getCryptoPrice`
            ),
          ],
          [
            Markup.button.callback(
              `Mencoba memasuki Wizard Scene`,
              `enterWizardScene`
            ),
          ],
        ])
      );
    });

    bot.action(`getCryptoPrice`, async (ctx) => {
      try {
        const binance = new Spot(
          process.env.BINANCE_API_KEY,
          process.env.BINANCE_SECRET_KEY
        );
        await ctx.deleteMessage();
        const btcPrice = await binance.ticker24hr(`BTCUSDT`);
        const priceChangePercent = parseFloat(btcPrice.data.lastPrice).toFixed(
          2
        );
        const color = priceChangePercent < 0 ? `🔴` : `🟢`;
        await ctx.sendMessage(
          `Ini adalah data harga Cryptocurrencies yang diambil dari data Binance API secara realtime:\n\n` +
            `${color} ${btcPrice.data.symbol} | $${priceChangePercent} USDT | ${btcPrice.data.priceChangePercent} %`
        );
      } catch (err) {
        console.error(err);
      }
    });
    bot.launch();
  } catch (err) {
    console.error(err);
  }
})();
