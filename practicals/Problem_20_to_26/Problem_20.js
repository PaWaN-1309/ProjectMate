const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ? On browser use this - http://localhost:3000/user/pawan

app.get('/user/:id', (req, res) => {
  console.log('req.params:', req.params);

  console.log('req.query:', req.query);

  console.log('req.path:', req.path);

  console.log('req.method:', req.method);

  console.log('req.url:', req.url);

  res.send('Request object demonstration complete! Check the console.');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Request demo server running at http://localhost:${port}`);
});
