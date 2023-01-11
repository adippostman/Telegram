const fs = require(`fs`);
const CoinGecko = require(`coingecko-api`);

const client = new CoinGecko();

(async () => {
  try {
    // console.log(trending);
    const looper = true;
    let count = 1;
    while (looper) {
      const allCoin = await client.coins.all();
      const allCoinString = await JSON.stringify(allCoin);
      if (allCoin.success == true) {
        fs.writeFileSync(`coingecko.json`, allCoinString);
        console.log(`${count}. Success write to coingecko.json`);
      } else {
        console.log(`${count}. Failed write to coingecko.json`);
      }
      count++;
      await new Promise((r) => setTimeout(r, 10000));
      //   //   const file = JSON.parse(fs.readFileSync(`./coingecko.json`, `utf-8`));
      //   let message = ``;
      //   let count = 0;
      //   for (const obj of allCoinString.data) {
      //     if (
      //       obj.symbol == `usdt` ||
      //       obj.symbol == `usdc` ||
      //       obj.symbol == `busd`
      //     ) {
      //       continue;
      //     }
      //     count++;
      //     if (count > 10) {
      //       break;
      //     }
      //     message += `${obj.symbol.toUpperCase()}USD $${
      //       obj.market_data.current_price.usd
      //     }\n`;
      //   }
    }

    // file.data.slice(0, 10).map(function (value, index) {
    //   message += `${value.symbol.toUpperCase()}USD $${
    //     value.market_data.current_price.usd
    //   }\n`;
    // });
  } catch (err) {
    console.error(err);
  }
})();
