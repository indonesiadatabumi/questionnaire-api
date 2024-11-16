// controllers/rolePrivilegesController.js
const knex = require('../knex');
/**
 * @swagger
 * /role_privileges:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Set or update role privileges for an endpoint
 *     description: Assigns or updates the privileges (create, read, update, delete) for a specific role on a given endpoint.
 *     tags:
 *       - Role Privileges
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - endpoint_id
 *               - can_create
 *               - can_read
 *               - can_update
 *               - can_delete
 *             properties:
 *               role_id:
 *                 type: integer
 *                 description: The ID of the role to which privileges are being assigned.
 *                 example: 1
 *               endpoint_id:
 *                 type: integer
 *                 description: The ID of the endpoint for which privileges are being set.
 *                 example: 10
 *               can_create:
 *                 type: boolean
 *                 description: Whether the role has permission to create on this endpoint.
 *                 example: true
 *               can_read:
 *                 type: boolean
 *                 description: Whether the role has permission to read from this endpoint.
 *                 example: true
 *               can_update:
 *                 type: boolean
 *                 description: Whether the role has permission to update this endpoint.
 *                 example: false
 *               can_delete:
 *                 type: boolean
 *                 description: Whether the role has permission to delete this endpoint.
 *                 example: false
 *     responses:
 *       200:
 *         description: Successfully updated or set the role privileges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Role privileges updated successfully"
 *       500:
 *         description: Error in setting role privileges
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error setting role privileges"
 */
exports.setRolePrivileges = async (req, res) => {
  const { role_id, endpoint_id, can_create, can_read, can_update, can_delete } = req.body;
  try {
    await knex('role_privileges')
      .insert({ role_id, endpoint_id, can_create, can_read, can_update, can_delete })
      .onConflict(['role_id', 'endpoint_id'])
      .merge();  // Merge if the privilege already exists
    res.status(200).json({ message: 'Role privileges updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error setting role privileges' });
  }
};
