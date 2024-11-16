// middlewares/rbacMiddleware.js
const knex = require('../knex');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Role-based access control middleware
 * Checks if the user has permission for the requested endpoint
 */
const checkRolePermission = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header missing or incorrect' });
    }

    // Extract the token from the Bearer scheme
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Set user information from token into the request object
    req.user = decoded;

    const { userId, role_id } = decoded;
    const { method, originalUrl } = req;
    try {
      const userRole = role_id; // Assume `req.user` is populated with the user's role ID from the authentication process
      const requestMethod = method; // e.g., GET, POST
      const requestUrl = req.baseUrl + req.path; // Combine base URL with the path
  
      // Fetch all endpoints from the database
      const endpoints = await knex('endpoints').select('endpoint_id', 'url', 'method');
  
      // Match request URL with dynamic endpoint patterns
      let matchedEndpoint = null;
      for (const endpoint of endpoints) {
        const endpointPattern = endpoint.url.replace(/:\w+/g, '\\w+'); // Convert :params to regex
        const regex = new RegExp(`^${endpointPattern}$`);
        if (regex.test(requestUrl) && endpoint.method === requestMethod) {
          matchedEndpoint = endpoint;
          break;
        }
      }
  
      if (!matchedEndpoint) {
        return res.status(403).json({ error: 'Access denied: Endpoint not found or not allowed' });
      }
  
      // Fetch role privileges for the matched endpoint
      const privilege = await knex('role_privileges')
        .where({ role_id: userRole, endpoint_id: matchedEndpoint.endpoint_id })
        .first();
  
      if (!privilege) {
        return res.status(403).json({ error: 'Access denied: No permissions for this endpoint' });
      }
  
      // Check permission based on request method
      switch (requestMethod) {
        case 'POST':
          if (!privilege.can_create) {
            return res.status(403).json({ error: 'Access denied: Insufficient create permissions' });
          }
          break;
        case 'GET':
          if (!privilege.can_read) {
            return res.status(403).json({ error: 'Access denied: Insufficient read permissions' });
          }
          break;
        case 'PUT':
        case 'PATCH':
          if (!privilege.can_update) {
            return res.status(403).json({ error: 'Access denied: Insufficient update permissions' });
          }
          break;
        case 'DELETE':
          if (!privilege.can_delete) {
            return res.status(403).json({ error: 'Access denied: Insufficient delete permissions' });
          }
          break;
        default:
          return res.status(405).json({ error: 'Method not allowed' });
      }
  
      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error('RBAC Middleware Error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (err) {}
};

module.exports = checkRolePermission;
