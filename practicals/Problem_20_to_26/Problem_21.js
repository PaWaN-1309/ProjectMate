const express = require('express');
const app = express();
const port = 3001;

app.get('/send', (req, res) => {
  res.send('Hello from res.send()!');
});

app.get('/json', (req, res) => {
  res.json({ message: 'This is a JSON response', status: 'success' });
});

app.get('/status', (req, res) => {
  res.status(404).send('This route simulates a 404 Not Found');
});

app.get('/redirect', (req, res) => {
  res.redirect('/send');
});

app.get('/header', (req, res) => {
  res.set('Custom-Header', 'ExpressDemo');
  res.send('Custom header set successfully!');
});

app.listen(port, () => {
  console.log(`✅ Response demo server running at http://localhost:${port}`);
});
