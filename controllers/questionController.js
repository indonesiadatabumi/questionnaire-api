// controllers/questionController.js
const knex = require('../knex');


/**
 * @swagger
 * /questions:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Create a new question within a questionnaire
 *     description: Adds a new question to a specified questionnaire. If the question is multiple-choice, includes options.
 *     tags:
 *       - Questions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionnaire_id
 *               - question_text
 *               - question_type
 *             properties:
 *               questionnaire_id:
 *                 type: integer
 *                 description: The ID of the questionnaire to add the question to.
 *                 example: 1
 *               question_text:
 *                 type: string
 *                 description: The text of the question.
 *                 example: "What is the capital of France?"
 *               question_type:
 *                 type: string
 *                 description: The type of the question (e.g., 'multiple_choice', 'text').
 *                 example: "multiple_choice"
 *               options:
 *                 type: array
 *                 description: Options for multiple-choice questions.
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       description: Text of the option.
 *                       example: "Paris"
 *                     is_correct:
 *                       type: boolean
 *                       description: Indicates if this option is correct.
 *                       example: true
 *     responses:
 *       201:
 *         description: Question created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question_id:
 *                   type: integer
 *                   example: 1
 *                 questionnaire_id:
 *                   type: integer
 *                   example: 1
 *                 question_text:
 *                   type: string
 *                   example: "What is the capital of France?"
 *                 question_type:
 *                   type: string
 *                   example: "multiple_choice"
 *       500:
 *         description: Failed to create question
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to create question"
 */
exports.createQuestion = async (req, res) => {
  const { questionnaire_id, question_text, question_type, options } = req.body;

  try {
    // Insert the question
    const [newQuestion] = await knex('questions').insert({
      questionnaire_id,
      question_text,
      question_type,
    }).returning('*');
    
    // If the question is multiple-choice, insert options
    if (question_type === 'multiple_choice' && options && Array.isArray(options)) {
      const optionsData = options.map(option => ({
        question_id: newQuestion.question_id,
        option_text: option.text,
        is_correct: option.is_correct || false, // Flag if the option is the correct one
      }));

      await knex('question_options').insert(optionsData);
    }

    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create question' });
  }
};

/**
 * @swagger
 * /questions/{questionnaire_id}:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Retrieve all questions for a questionnaire
 *     description: Fetches all questions for a given questionnaire, including options for multiple-choice questions.
 *     tags:
 *       - Questions
 *     parameters:
 *       - in: path
 *         name: questionnaire_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the questionnaire to retrieve questions from.
 *     responses:
 *       200:
 *         description: Successfully retrieved questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   question_id:
 *                     type: integer
 *                     example: 1
 *                   questionnaire_id:
 *                     type: integer
 *                     example: 1
 *                   question_text:
 *                     type: string
 *                     example: "What is the capital of France?"
 *                   question_type:
 *                     type: string
 *                     example: "multiple_choice"
 *                   options:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         option_id:
 *                           type: integer
 *                           example: 10
 *                         option_text:
 *                           type: string
 *                           example: "Paris"
 *                         is_correct:
 *                           type: boolean
 *                           example: true
 *       500:
 *         description: Failed to fetch questions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch questions"
 */
exports.getQuestionsByQuestionnaire = async (req, res) => {
  const { questionnaire_id } = req.params;
  try {
    const questions = await knex('questions')
      .where('questionnaire_id', questionnaire_id)
      .select('*');

    // Fetch options for multiple-choice questions
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        if (question.question_type === 'multiple_choice') {
          const options = await knex('question_options')
            .where('question_id', question.question_id)
            .select('option_id', 'option_text', 'is_correct');
          question.options = options;
        }
        return question;
      })
    );

    res.json(questionsWithOptions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};
