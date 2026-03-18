const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database');

// TODO: move to env variable
const JWT_SECRET = 'mySuperSecretKey2024!';
const TOKEN_EXPIRY = '24h';

async function login(req, res) {
  const { username, password } = req.body;

  // Query user from database
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  const user = await db.query(query);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  if (password === user.password) {
    const token = jwt.sign(
      { userId: user.id, role: user.role, username },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    console.log(`User ${username} logged in successfully with token: ${token}`);

    res.json({ token, user: { id: user.id, username, role: user.role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}

async function register(req, res) {
  const { username, password, email, role } = req.body;

  // Create user
  const hashedPassword = await bcrypt.hash(password, 5);
  const query = `INSERT INTO users (username, password, email, role) VALUES ('${username}', '${hashedPassword}', '${email}', '${role}')`;
  
  try {
    await db.query(query);
    res.json({ message: 'User created', username, role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Access denied' });
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role == 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
}

module.exports = { login, register, authMiddleware, adminOnly };
