// controllers/roleController.js
const knex = require('../knex');
/**
 * @swagger
 * /roles:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Create a new role
 *     description: Creates a new role with a name and description for use in role-based access control.
 *     tags:
 *       - Roles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_name
 *               - description
 *             properties:
 *               role_name:
 *                 type: string
 *                 description: The name of the role.
 *                 example: "Admin"
 *               description:
 *                 type: string
 *                 description: A description of the role.
 *                 example: "Administrator role with full access"
 *     responses:
 *       201:
 *         description: Successfully created the role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role_id:
 *                   type: integer
 *                   example: 1
 *                 role_name:
 *                   type: string
 *                   example: "Admin"
 *                 description:
 *                   type: string
 *                   example: "Administrator role with full access"
 *       500:
 *         description: Failed to create role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Role creation failed"
 */
exports.createRole = async (req, res) => {
  const { role_name, description } = req.body;
  try {
    const [newRole] = await knex('roles').insert({ role_name, description }).returning('*');
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: 'Role creation failed' });
  }
};

/**
 * @swagger
 * /roles:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Retrieve all roles
 *     description: Fetches a list of all roles in the system.
 *     tags:
 *       - Roles
 *     responses:
 *       200:
 *         description: Successfully retrieved the roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   role_id:
 *                     type: integer
 *                     example: 1
 *                   role_name:
 *                     type: string
 *                     example: "Admin"
 *                   description:
 *                     type: string
 *                     example: "Administrator role with full access"
 *       500:
 *         description: Failed to fetch roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch roles"
 */
exports.getRoles = async (req, res) => {
  try {
    const roles = await knex('roles').select('*');
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};
