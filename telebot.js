const { Telegraf, Markup } = require("telegraf");
const { CoinGeckoClient } = require(`coingecko-api-v3`);
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
        const client = new CoinGeckoClient({
          timeout: 300000,
          autoRetry: true,
        });
        const coins = await client.coinMarket({
          vs_currency: `usd`,
          order: `market_cap_desc`,
          per_page: 20,
        });
        if (coins.length > 1) {
          let message = ``;
          let count = 0;
          for (const obj of coins) {
            if (
              obj.symbol == `usdt` ||
              obj.symbol == `usdc` ||
              obj.symbol == `busd`
            ) {
              continue;
            }
            count++;
            let color = obj.price_change_24h < 0 ? `🔴` : `🟢`;
            message += `${color} <b>${obj.symbol.toUpperCase()}USD</b> | $${
              obj.current_price
            } USD | ${obj.price_change_percentage_24h}%\n\n`;
          }
          await ctx.replyWithHTML(
            `Ini adalah data harga Cryptocurrencies yang diambil dari data CoinGecko API secara realtime:\n\n` +
              message
          );
        }
        // uhui
      } catch (err) {
        console.error(err);
      }
    });
    bot.launch();
  } catch (err) {
    console.error(err);
  }
})();
