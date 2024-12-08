// controllers/answerController.js
const knex = require('../knex');

/**
 * @swagger
 * /submitAnswer:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Submit an answer to a question
 *     description: Allows users to submit answers to questions. Supports both text answers and multiple-choice answers.     
 *     tags:
 *       - Answers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - response_id
 *               - question_id
 *             properties:
 *               questionnaire_id:
 *                 type: integer
 *                 description: The ID of the response session.
 *                 example: 1
 *               question_id:
 *                 type: integer
 *                 description: The ID of the question being answered.
 *                 example: 10
 *               answer_text:
 *                 type: string
 *                 description: Answer text for open-ended questions (used if question is not multiple-choice).
 *                 example: "This is a sample text answer."
 *               answer_option:
 *                 type: string
 *                 description: Array of selected options for multiple-choice questions.
 *                 items:
 *                   type: integer
 *                   description: Option ID for a multiple-choice answer.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Answer submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Answer submitted successfully"
 *       500:
 *         description: Failed to submit answer due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to submit answer"
 */
exports.submitAnswer = async (req, res) => {
  const { questionnaire_id, question_id, answer_text, answer_option } = req.body;

  try {
    const queryResponse = {
      questionnaire_id: questionnaire_id,
      user_id: req.user.userId
    };

    let dataResponse = await knex('questionnaire_responses').where(queryResponse);
    if (dataResponse.length < 1) {
      dataResponse = await knex('questionnaire_responses').insert({
        questionnaire_id: questionnaire_id,
        user_id: req.user.userId
      }).returning("response_id")
    }


    if (answer_option) {
      // Multiple-choice question: answer_option will be an array of selected options
      // const answers = answer_option.map(option_id => ());
      await knex('answers').insert({
        response_id: dataResponse[0].response_id,
        question_id,
        answer_option: answer_option,
      });
    } else {
      // Text question: answer_text will be a string
      await knex('answers').insert({
        response_id: dataResponse[0].response_id,
        question_id,
        answer_text,
      });
    }

    res.status(201).json({ message: 'Answer submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: `Failed to submit answer ${err}` });
  }
};
