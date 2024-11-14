// middlewares/rbacMiddleware.js
const knex = require('../knexfile');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Role-based access control middleware
 * Checks if the user has permission for the requested endpoint
 */
async function checkRolePermission(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(403).send('Access denied.');

  // Verify JWT
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;

    // Get the requested endpoint
    const endpointUrl = req.originalUrl;
    const method = req.method.toUpperCase();

    // Check if the user has access to this endpoint based on their role
    const hasPermission = await knex('role_privileges')
      .join('roles', 'roles.role_id', '=', 'role_privileges.role_id')
      .join('endpoints', 'endpoints.endpoint_id', '=', 'role_privileges.endpoint_id')
      .where('roles.role_id', user.role_id)
      .andWhere('endpoints.url', endpointUrl)
      .andWhere('endpoints.method', method)
      .andWhere(function() {
        switch (method) {
          case 'GET': return this.where('role_privileges.can_read', true);
          case 'POST': return this.where('role_privileges.can_create', true);
          case 'PUT': return this.where('role_privileges.can_update', true);
          case 'DELETE': return this.where('role_privileges.can_delete', true);
          default: return this;
        }
      })
      .first();

    if (!hasPermission) return res.status(403).send('Permission denied.');

    next();
  });
}

module.exports = checkRolePermission;
