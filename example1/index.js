const express = require('express');
const { EventEmitter } = require('events');

const app = express();
app.use(express.static('public'));

// const ticker = new EventEmitter();


// setInterval(() => {
//   // Replace this with your own logic for fetching stock data.
//   const price = Math.random() * 100;
//   ticker.emit('price', price.toFixed(2));
// }, 1000);

app.get('/ticker', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // const onPrice = (price) => {
  //   res.write(`data: ${price}\n\n`);
  // };

  // ticker.on('price', onPrice);


  setInterval(() => {
    const price = Math.random() * 100;
    res.write(`data: ${price.toFixed(2)}\n\n`)
  }, 1000);

  req.on('close', () => {
    console.log('connection closed')
    // ticker.off('price', onPrice);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
