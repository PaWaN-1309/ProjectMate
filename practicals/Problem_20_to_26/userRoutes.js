const router = express.Router();

// Example routes using Router
router.get('/', (req, res) => {
  res.send('List of all users');
});

router.get('/:id', (req, res) => {
  res.send(`User profile for ID: ${req.params.id}`);
});

router.post('/', (req, res) => {
  res.send('New user created');
});

router.put('/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} updated`);
});

router.delete('/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} deleted`);
});
