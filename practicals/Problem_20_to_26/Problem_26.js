const express = require('express');
const app = express();
const port = 3000;

// Middleware 1: Logging every request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // move to next middleware or route handler
});

// Middleware 2: Parse JSON request body
app.use(express.json());

// Middleware 3: Custom route handler middleware
app.use('/hello', (req, res) => {
  res.send('Hello from app.use() middleware!');
});

// Route outside app.use()
app.get('/', (req, res) => {
  res.send('Welcome to the app.use() demo!');
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

