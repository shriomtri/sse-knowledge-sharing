const { EventEmitter } = require('events');
global.ticker = new EventEmitter();

require('./stockTicker');

const express = require('express');
const app = express();
app.use(express.static('public'));



app.get('/ticker', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const onPrice = (price) => {
    res.write(`data: ${price}\n\n`);
  };

  global.ticker.on('price', onPrice);

  req.on('close', () => {
    console.log('connection closed')
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
