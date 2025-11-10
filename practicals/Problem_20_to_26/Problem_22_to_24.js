const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// You can test this with: GET http://localhost:3000/user
app.get('/user', (req, res) => {
  const sampleUser = { id: 1, name: 'Pawan', role: 'Student' };
  res.status(200).json({
    message: 'GET request received — sending user data',
    user: sampleUser,
  });
});

// Test this with Postman or curl:
// POST http://localhost:3000/user

app.post('/user', (req, res) => {
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required fields' });
  }

  res.status(201).json({
    message: 'POST request received — new user created',
    data: { name, role },
  });
});

// Test this with: PUT http://localhost:3000/user/1
app.put('/user/:id', (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body;

  if (!name || !role) {
    return res.status(400).json({ error: 'Name and role are required for update' });
  }

  res.status(200).json({
    message: 'PUT request received — user updated successfully',
    updatedUser: { id, name, role },
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
  console.log('Available routes:');
  console.log('  GET  → /user');
  console.log('  POST → /user');
  console.log('  PUT  → /user/:id');
});
