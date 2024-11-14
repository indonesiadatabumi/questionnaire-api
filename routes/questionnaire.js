// routes/questionnaire.js
const express = require('express');
const router = express.Router();
const knex = require('../knexfile');
const authenticateJWT = require('../server').authenticateJWT;

// Create Questionnaire
/**
 * @swagger
 * /questionnaire:
 *   post:
 *     summary: Create a new questionnaire
 *     security:
 *       - Bearer: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Questionnaire created successfully
 */
router.post('/', authenticateJWT, async (req, res) => {
  const { title, description } = req.body;
  const [newQuestionnaire] = await knex('questionnaires').insert({ title, description, created_by: req.user.userId }).returning('*');
  res.status(201).json(newQuestionnaire);
});

module.exports = router;
