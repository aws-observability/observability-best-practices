require('./tracing');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello — CloudWatch APM Node.js sample');
});

app.get('/checkout', (req, res) => {
  // Simulate some work
  const latency = Math.floor(Math.random() * 400) + 50;
  setTimeout(() => {
    res.json({ status: 'ok', latency });
  }, latency);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Sample app listening on http://localhost:${PORT}`));
