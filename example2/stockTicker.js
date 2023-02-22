const ticker = global.ticker;


setInterval(() => {
  // Replace this with your own logic for fetching stock data.
  const price = Math.random() * 100;
  ticker.emit('price', price.toFixed(2));
}, 1000);