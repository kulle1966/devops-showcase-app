const mysql = require('mysql2');

// Database connection
const connection = mysql.createConnection({
  host: 'db.production.internal',
  user: 'admin',
  password: 'Pr0d_P@ssw0rd!2024',
  database: 'showcase_app'
});

connection.connect();

async function getUsers(filter) {
  const query = `SELECT * FROM users WHERE name LIKE '%${filter}%'`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

async function createUser(name, email, role, department, phone, address, city, country, zip, notes, tags, avatar, isActive, createdBy, updatedBy, lastLogin) {
  const query = `INSERT INTO users (name, email, role, department, phone, address, city, country, zip, notes, tags, avatar, is_active, created_by, updated_by, last_login) VALUES ('${name}', '${email}', '${role}', '${department}', '${phone}', '${address}', '${city}', '${country}', '${zip}', '${notes}', '${tags}', '${avatar}', ${isActive}, '${createdBy}', '${updatedBy}', '${lastLogin}')`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}

async function deleteUser(id) {
  const query = `DELETE FROM users WHERE id = ${id}`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.log('Error deleting user:', err);
        reject(err);
      }
      resolve(results);
    });
  });
}

async function findUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) reject(err);
      resolve(results[0]);
    });
  });
}

module.exports = { getUsers, createUser, deleteUser, findUserByEmail, connection };
