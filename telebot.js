const { Telegraf, Markup } = require("telegraf");
const { Spot } = require(`@binance/connector`);
const fs = require(`fs`);
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
        // const binance = new Spot(
        //   process.env.BINANCE_API_KEY,
        //   process.env.BINANCE_SECRET_KEY
        // );
        // await ctx.deleteMessage();
        // const btcPrice = await binance.ticker24hr(`BTCUSDT`);
        // const priceChangePercent = parseFloat(btcPrice.data.lastPrice).toFixed(
        //   2
        // );
        const file = JSON.parse(fs.readFileSync(`./coingecko.json`, `utf-8`));
        let message = ``;
        let count = 0;
        for (const obj of file.data) {
          if (
            obj.symbol == `usdt` ||
            obj.symbol == `usdc` ||
            obj.symbol == `busd`
          ) {
            continue;
          }
          count++;
          if (count > 10) {
            break;
          }
          let color = obj.market_data.price_change_24h < 0 ? `🔴` : `🟢`;
          message += `${color} <b>${obj.symbol.toUpperCase()}USD</b> | $${
            obj.market_data.current_price.usd
          } USD | ${obj.market_data.price_change_percentage_24h}%\n\n`;
        }
        await ctx.replyWithHTML(
          `Ini adalah data harga Cryptocurrencies yang diambil dari data CoinGecko API secara realtime:\n\n` +
            message
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
