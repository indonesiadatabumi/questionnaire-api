// routes/auth.js
const express = require('express');
const router = express.Router();
const knex = require('../knexfile');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Register Route
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const [newUser] = await knex('users').insert({ username, email, password_hash: hashedPassword }).returning('*');
  res.status(201).json(newUser);
});

// Login Route
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in an existing user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await knex('users').where({ username }).first();
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(400).send('Invalid credentials');
  }
  
  const token = jwt.sign({ userId: user.user_id, username: user.username }, process.env.JWT_SECRET);
  res.json({ token });
});

module.exports = router;
