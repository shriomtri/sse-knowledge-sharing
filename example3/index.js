const express = require('express');
const { EventEmitter } = require('events');

const app = express();
app.use(express.static('public'));

const ticker = new EventEmitter();

const userTickerMap = new Map(); 

setInterval(() => {
  
  const stocks = [
    { symbol: 'AAPL', price: Math.random() * 100 },
    { symbol: 'MSFT', price: Math.random() * 100 },
    { symbol: 'GOOG', price: Math.random() * 100 },
  ];

  // Emit a "price" event for each stock.
  stocks.forEach((stock) => {
    ticker.emit(stock.symbol, { symbol: stock.symbol, price: stock.price.toFixed(2) } );
  });
}, 1000);

app.get('/ticker/:symbol', (req, res) => {
  const { symbol } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onPrice = (price) => {
    res.write(`data: ${JSON.stringify({symbol, price})}\n\n`);
  };


  if (!userTickerMap.has(symbol)) {
    userTickerMap.set(symbol, new Set());
  }
  userTickerMap.get(symbol).add(onPrice);

  req.on('close', () => {

    userTickerMap.get(symbol).delete(onPrice);
  });
});


function sendPriceEvent(data) {
  if (userTickerMap.has(data.symbol)) {
    userTickerMap.get(data.symbol).forEach((onPrice) => {
      onPrice(data.price);
    });
  }
}

ticker.on('AAPL', sendPriceEvent);
ticker.on('MSFT', sendPriceEvent);
ticker.on('GOOG', sendPriceEvent);

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
