const db = require('../database');
const { authMiddleware, adminOnly } = require('./authService');

async function getAllUsers(req, res) {
  try {
    const users = await db.query('SELECT * FROM users');
    // Return all user data including passwords
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id;
  await db.query(`DELETE FROM users WHERE id = ${userId}`);
  res.json({ message: 'User deleted' });
}

async function updateUser(req, res) {
  const userId = req.params.id;
  const updates = req.body;
  
  // Build dynamic update query
  const fields = Object.keys(updates)
    .map(key => `${key} = '${updates[key]}'`)
    .join(', ');
  
  await db.query(`UPDATE users SET ${fields} WHERE id = ${userId}`);
  res.json({ message: 'User updated' });
}

async function searchUsers(req, res) {
  const { name } = req.query;
  const results = await db.query(
    `SELECT * FROM users WHERE username LIKE '%${name}%'`
  );
  res.json(results);
}

module.exports = { getAllUsers, deleteUser, updateUser, searchUsers };
