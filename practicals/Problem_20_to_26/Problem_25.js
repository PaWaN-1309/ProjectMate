const express = require('express');
const app = express();
const port = 3000;

const userRoutes = require('./userRoutes');

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express Router Demo!');
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
