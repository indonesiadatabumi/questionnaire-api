const knex = require('../knex');
/**
 * @swagger
 * /questionnaire:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Create a new questionnaire
 *     description: Adds a new questionnaire with a title, description, and the user who created it.
 *     tags:
 *       - Questionnaires
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the questionnaire.
 *                 example: "Customer Satisfaction Survey"
 *               description:
 *                 type: string
 *                 description: A brief description of the questionnaire.
 *                 example: "A survey to collect feedback from customers."
 *     responses:
 *       201:
 *         description: Successfully created the questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 questionnaire_id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Customer Satisfaction Survey"
 *                 description:
 *                   type: string
 *                   example: "A survey to collect feedback from customers."
 *                 created_by:
 *                   type: integer
 *                   example: 123
 *       500:
 *         description: Failed to create questionnaire
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create questionnaire"
 */
exports.createQuestionnaire = async (req, res) => {
  const { title, description } = req.body;
  try {
    const [newQuestionnaire] = await knex('questionnaires').insert({ title, description, created_by: req.user.userId }).returning('*');
    res.status(201).json(newQuestionnaire);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create questionnaire' });
  }
};

/**
 * @swagger
 * /questionnaire:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Retrieve all questionnaires
 *     description: Fetches a list of all questionnaires in the system.
 *     tags:
 *       - Questionnaires
 *     responses:
 *       200:
 *         description: Successfully retrieved questionnaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   questionnaire_id:
 *                     type: integer
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: "Customer Satisfaction Survey"
 *                   description:
 *                     type: string
 *                     example: "A survey to collect feedback from customers."
 *                   created_by:
 *                     type: integer
 *                     example: 123
 *       500:
 *         description: Failed to fetch questionnaires
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch questionnaires"
 */
exports.getQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await knex('questionnaires').select('*');
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questionnaires' });
  }
};
