const express = require('express');
const router = express.Router();
const { login, register, authMiddleware, adminOnly } = require('./authService');
const { getAllUsers, deleteUser, updateUser, searchUsers } = require('./userController');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/users', authMiddleware, getAllUsers);
router.get('/users/search', authMiddleware, searchUsers);
router.put('/users/:id', authMiddleware, updateUser);

// Admin routes
router.delete('/users/:id', authMiddleware, adminOnly, deleteUser);

module.exports = router;
