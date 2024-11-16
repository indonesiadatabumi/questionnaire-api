// controllers/mbtiController.js
const knex = require('../knex');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * /mbti/questions:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Retrieve all MBTI-related questions.
 *     description: Fetch a list of questions designed for MBTI assessment.
 *     tags:
 *       - MBTI
 *     responses:
 *       200:
 *         description: List of MBTI questions retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question_id:
 *                     type: integer
 *                     description: ID of the question.
 *                   question_text:
 *                     type: string
 *                     description: Text of the MBTI question.
 *                   dimension:
 *                     type: string
 *                     description: Personality dimension (e.g., EI, SN, TF, JP).
 *                   direction:
 *                     type: string
 *                     enum: [positive, negative]
 *                     description: Direction of scoring for the dimension.
 *       500:
 *         description: Failed to fetch MBTI questions.
 */
exports.getMBTIQuestions = async (req, res) => {
  try {
    const questions = await knex('mbti_questions').select('*');
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch MBTI questions' });
  }
};


/**
 * @swagger
 * /mbti/submit:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Submit user's MBTI assessment answers.
 *     description: Calculate MBTI type based on the user's answers and store it in the database.
 *     tags:
 *       - MBTI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     question_id:
 *                       type: integer
 *                       description: ID of the answered question.
 *                     response:
 *                       type: integer
 *                       description: User's response to the question (1-5 scale).
 *             required:
 *               - answers
 *     responses:
 *       201:
 *         description: MBTI type calculated and saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type:
 *                   type: string
 *                   description: User's calculated MBTI type (e.g., INTJ).
 *                 description:
 *                   type: string
 *                   description: Description of the calculated MBTI type.
 *       400:
 *         description: Invalid request body or missing required fields.
 *       500:
 *         description: Failed to submit MBTI answers.
 */
exports.submitMBTIAnswers = async (req, res) => {
  const { answers } = req.body; // Array of { question_id, response }
  const userId = req.user.userId;

  console.log(`answer ${answers}`)

  try {
    // Initialize score counters
    let scores = { EI: 0, SN: 0, TF: 0, JP: 0 };

    for (const answer of answers) {
      const question = await knex('mbti_questions').where({ question_id: answer.question_id }).first();
      if (!question) continue;

      // Adjust the score based on the answer and question direction
      if (question.direction === 'positive') {
        scores[question.dimension] += answer.response;
      } else {
        scores[question.dimension] -= answer.response;
      }
    }

    // Determine the MBTI type based on scores
    const type = [
      scores.EI >= 0 ? 'E' : 'I',
      scores.SN >= 0 ? 'S' : 'N',
      scores.TF >= 0 ? 'T' : 'F',
      scores.JP >= 0 ? 'J' : 'P'
    ].join('');

    // Find the type_id from mbti_types table
    const mbtiType = await knex('mbti_types').where({ type_name: type }).first();
    if (!mbtiType) {
      return res.status(500).json({ error: 'MBTI type calculation failed' });
    }

    // Save user MBTI type in user_mbti table
    await knex('user_mbti').insert({ user_id: userId, type_id: mbtiType.type_id });
    res.status(201).json({ type, description: mbtiType.description });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit MBTI answers' });
  }
};

/**
 * @swagger
 * /mbti/user-type:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Get user's MBTI type.
 *     description: Retrieve the MBTI type for the authenticated user.
 *     tags:
 *       - MBTI
 *     responses:
 *       200:
 *         description: User's MBTI type retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 type_name:
 *                   type: string
 *                   description: MBTI type of the user (e.g., INTJ).
 *                 description:
 *                   type: string
 *                   description: Description of the user's MBTI type.
 *       404:
 *         description: MBTI type not found for user.
 *       500:
 *         description: Failed to fetch user's MBTI type.
 */
exports.getUserMBTIType = async (req, res) => {
  const userId = req.user.userId;
  try {
    const userMBTI = await knex('user_mbti')
      .join('mbti_types', 'user_mbti.type_id', '=', 'mbti_types.type_id')
      .where('user_mbti.user_id', userId)
      .select('mbti_types.type_name', 'mbti_types.description')
      .first();

    if (!userMBTI) {
      return res.status(404).json({ error: 'MBTI type not found for user' });
    }

    res.json(userMBTI);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user MBTI type' });
  }
};
