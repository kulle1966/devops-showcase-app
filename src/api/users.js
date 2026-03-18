const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = 'my-super-secret-key-12345';
const users = [];

// Register new user
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, username, email, password: hashedPassword };
  users.push(user);

  const token = jwt.sign({ id: user.id, username }, SECRET);
  res.json({ token, user: { id: user.id, username, email, password: hashedPassword } });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username == username);

  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign({ id: user.id, username }, SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// Get all users (admin)
router.get('/all', (req, res) => {
  res.json(users);
});

// Delete user
router.delete('/:id', (req, res) => {
  const idx = users.findIndex(u => u.id == req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(idx, 1);
  res.json({ message: 'deleted' });
});

// SQL-style search (demo)
router.get('/search', async (req, res) => {
  const query = req.query.q;
  const results = users.filter(u => u.username.includes(query) || u.email.includes(query));
  res.json(results);
});

module.exports = router;
