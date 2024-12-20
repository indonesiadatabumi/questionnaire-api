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

/**
 * @swagger
 * /mbti/questions:
 *   post:
 *     summary: Create a new MBTI question.
 *     description: Add a question for the Myers-Briggs Type Indicator (MBTI) assessment.
 *     tags:
 *       - MBTI
 *     security:
 *       - Authorization: [] 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question_text
 *               - dimension
 *               - direction
 *             properties:
 *               question_text:
 *                 type: string
 *                 description: The text of the MBTI question.
 *                 example: "You enjoy vibrant social events with lots of people."
 *               dimension:
 *                 type: string
 *                 description: The MBTI dimension the question is assessing.
 *                 enum: [EI, SN, TF, JP]
 *                 example: "EI"
 *               direction:
 *                 type: string
 *                 description: Indicates if the question has a positive or negative impact on the score.
 *                 enum: [positive, negative]
 *                 example: "positive"
 *     responses:
 *       201:
 *         description: MBTI question created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_id:
 *                   type: integer
 *                   description: The unique ID of the created question.
 *                   example: 1
 *                 question_text:
 *                   type: string
 *                   example: "You enjoy vibrant social events with lots of people."
 *                 dimension:
 *                   type: string
 *                   example: "EI"
 *                 direction:
 *                   type: string
 *                   example: "positive"
 *       400:
 *         description: Invalid input or missing fields.
 *       500:
 *         description: Server error during question creation.
 */
exports.createMBTIQuestion = async (req, res) => {
  const { question_text, dimension, direction } = req.body;

  try {
    // Validate input
    if (!question_text || !dimension || !direction) {
      return res.status(400).json({ error: 'All fields (question_text, dimension, direction) are required.' });
    }

    // Ensure dimension and direction are valid
    const validDimensions = ['EI', 'SN', 'TF', 'JP']; // MBTI personality dimensions
    const validDirections = ['positive', 'negative'];
    if (!validDimensions.includes(dimension)) {
      return res.status(400).json({ error: `Invalid dimension. Allowed values: ${validDimensions.join(', ')}` });
    }
    if (!validDirections.includes(direction)) {
      return res.status(400).json({ error: `Invalid direction. Allowed values: ${validDirections.join(', ')}` });
    }

    // Insert the MBTI question into the database
    const [newQuestion] = await knex('mbti_questions').insert({
      question_text,
      dimension,
      direction,
    }).returning('*');

    // Return the created question
    res.status(201).json(newQuestion);
  } catch (err) {
    console.error('Error creating MBTI question:', err);
    res.status(500).json({ error: `Failed to create MBTI question: ${err.message}` });
  }
};



/**
 * @swagger
 * /mbti/admin-results:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Get MBTI results for all members.
 *     description: Retrieve MBTI types and descriptions for all members. Admin-only access.
 *     tags:
 *       - MBTI
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (default is 10).
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter by username or MBTI type.
 *     responses:
 *       200:
 *         description: List of members and their MBTI results retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user_id:
 *                         type: integer
 *                         description: User's ID.
 *                       username:
 *                         type: string
 *                         description: User's name.
 *                       type_name:
 *                         type: string
 *                         description: User's MBTI type.
 *                       description:
 *                         type: string
 *                         description: Description of the MBTI type.
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       403:
 *         description: Forbidden - Admin-only access.
 *       500:
 *         description: Server error during retrieval.
 */
exports.getAllMBTIResults = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const offset = (page - 1) * limit;

    // Query members with MBTI results
    const results = await knex('user_mbti')
      .join('users', 'user_mbti.user_id', '=', 'users.user_id')
      .join('mbti_types', 'user_mbti.type_id', '=', 'mbti_types.type_id')
      .select('users.user_id', 'users.username', 'mbti_types.type_name', 'mbti_types.description')
      .where(function () {
        if (search) {
          this.where('users.username', 'like', `%${search}%`)
            .orWhere('mbti_types.type_name', 'like', `%${search}%`);
        }
      })
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const total = await knex('user_mbti')
      .join('users', 'user_mbti.user_id', '=', 'users.user_id')
      .count('user_mbti.user_id as count')
      .first();

    res.json({
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total.count,
      },
    });
  } catch (err) {
    console.error('Error fetching MBTI results for all members:', err);
    res.status(500).json({ error: 'Failed to fetch MBTI results for all members' });
  }
};


/**
 * @swagger
 * /mbti/member-result:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Get individual MBTI result.
 *     description: Retrieve the authenticated user's MBTI type and description.
 *     tags:
 *       - MBTI
 *     responses:
 *       200:
 *         description: User's MBTI result retrieved successfully.
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
 *         description: MBTI result not found for user.
 *       500:
 *         description: Server error during retrieval.
 */
exports.getMemberMBTIResult = async (req, res) => {
  const userId = req.user.userId;

  try {
    const userMBTI = await knex('user_mbti')
      .join('mbti_types', 'user_mbti.type_id', '=', 'mbti_types.type_id')
      .where('user_mbti.user_id', userId)
      .select('mbti_types.type_name', 'mbti_types.description')
      .first();

    if (!userMBTI) {
      return res.status(404).json({ error: 'MBTI result not found for user' });
    }

    res.json(userMBTI);
  } catch (err) {
    console.error('Error fetching individual MBTI result:', err);
    res.status(500).json({ error: 'Failed to fetch MBTI result for user' });
  }
};
