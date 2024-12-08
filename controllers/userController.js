// controllers/userController.js
const knex = require('../knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with username, email, and password.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssw0rd
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: johndoe@example.com
 *       500:
 *         description: User registration failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User registration failed due to server error."
 */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  try {
    const [newUser] = await knex('users').insert({ username, email, password_hash: hashedPassword }).returning('*');
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: `User registration failed ${err}` });
  }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with username and password and returns a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssw0rd
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid credentials"
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during login."
 */
exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await knex('users').where({ username }).first();
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(400).send('Invalid credentials');
  }

  const role = await knex('roles').where({role_id: user.role_id}).first();
  const roleName = role.role_name;


  const token = jwt.sign({ userId: user.user_id, username: user.username, role_id: user.role_id }, process.env.JWT_SECRET);
  res.json({ token, roleName });
};

/**
 * @swagger
 * /get-role:
 *   get:
 *     security:
 *       - Authorization: []  
 *     summary: Get User Role
 *     description: Get User Role.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "Admin, Member..."
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "Invalid credentials"
 *       500:
 *         description: Server error during login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred during login."
 */
exports.decodeRole = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or incorrect' });
  }
  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const dataSelect = {
    role_id: decoded.role_id
  }
  const role = await knex('roles').where(dataSelect).first();
  const roleName = role.role_name;
  res.json({ roleName });
}
