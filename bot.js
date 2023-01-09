const teleBot = require(`node-telegram-bot-api`);
require(`dotenv`).config();

// init bot
const bot = new teleBot(process.env.BOT_TOKEN, { polling: true });
bot.useState = {};

(async () => {
  try {
    const me = await bot.getMe();
    // console.log(me);
  } catch (err) {
    console.error(err);
  }

  bot.onText(/\/start/, async (msg) => {
    await bot.sendMessage(
      msg.chat.id,
      `Halo <b>${msg.from.first_name} ${msg.from.last_name}</b>,\n\nSaya adalah Telegram BOT yang dibuat menggunakan NodeJS dan package node-telegram-bot-api.\n\nSaya dibuat oleh <b>Adip Perdana</b> dengan penuh semangat!`,
      { parse_mode: `HTML` }
    );
    let learn = await bot.sendMessage(
      msg.chat.id,
      `Untuk menggunakan BOT ini silahkan gunakan menu perintah dibawah:`,
      {
        parse_mode: `HTML`,
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `Lihat daftar harga Cryptocurrencies`,
                callback_data: `getCryptoPrice`,
              },
            ],
            [{ text: `Siapa yang membuat BOT ini?`, callback_data: `author` }],
          ],
        },
      }
    );

    // save message_id for delete chat
    bot.useState[chatId] = {
      chatId: learn.chat.id,
      messageId: learn.message_id,
    };
  });

  bot.on(`callback_query`, async (query) => {
    if (query.data == `getCryptoPrice`) {
      await bot.deleteMessage(
        bot.useState[query.message.chat.id].chatId,
        bot.useState[query.message.chat.id].messageId
      );
      delete bot.useState[query.message.chat.id];
      bot.sendMessage(query.message.chat.id, `Berhasil menghapus pesan!`);
    }
  });
})();
