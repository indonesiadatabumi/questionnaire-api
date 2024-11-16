// controllers/endpointController.js
const knex = require('../knex');

/**
 * @swagger
 * /endpoints:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Create a new API endpoint
 *     description: Adds a new API endpoint with specified URL, HTTP method, and description to the system.
 *     tags:
 *       - Endpoints
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - method
 *               - description
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL path of the new endpoint.
 *                 example: "/api/v1/new-endpoint"
 *               method:
 *                 type: string
 *                 description: HTTP method of the endpoint (GET, POST, PUT, DELETE).
 *                 example: "POST"
 *               description:
 *                 type: string
 *                 description: Brief description of the endpoint’s purpose.
 *                 example: "Creates a new resource in the system."
 *     responses:
 *       201:
 *         description: Endpoint created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 url:
 *                   type: string
 *                   example: "/api/v1/new-endpoint"
 *                 method:
 *                   type: string
 *                   example: "POST"
 *                 description:
 *                   type: string
 *                   example: "Creates a new resource in the system."
 *       500:
 *         description: Error creating endpoint
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error creating endpoint"
 */
exports.createEndpoint = async (req, res) => {
  const { url, method, description } = req.body;
  try {
    const [newEndpoint] = await knex('endpoints').insert({ url, method, description }).returning('*');
    res.status(201).json(newEndpoint);
  } catch (err) {
    res.status(500).json({ error: 'Error creating endpoint' });
  }
};

/**
 * @swagger
 * /endpoints:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Retrieve all API endpoints
 *     description: Fetches a list of all available API endpoints, including URL, method, and description for each.
 *     tags:
 *       - Endpoints
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of endpoints
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   url:
 *                     type: string
 *                     example: "/api/v1/new-endpoint"
 *                   method:
 *                     type: string
 *                     example: "POST"
 *                   description:
 *                     type: string
 *                     example: "Creates a new resource in the system."
 *       500:
 *         description: Failed to fetch endpoints due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch endpoints"
 */
exports.getEndpoints = async (req, res) => {
  try {
    const endpoints = await knex('endpoints').select('*');
    res.json(endpoints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch endpoints' });
  }
};
