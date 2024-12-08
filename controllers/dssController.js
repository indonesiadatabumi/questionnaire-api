// controllers/dssController.js
const knex = require('../knex');


/**
 * @swagger
 * /dss/submit:
 *   post:
 *     security:
 *       - Authorization: [] 
 *     summary: Perform analysis on submitted answers
 *     description: Analyzes the answers of a specific questionnaire, calculating the most common selected options for multiple-choice questions. Results are stored in the DSS analysis table.
 *     tags:
 *       - Analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionnaire_id
 *             properties:
 *               questionnaire_id:
 *                 type: integer
 *                 description: The ID of the questionnaire to analyze.
 *                 example: 5
 *     responses:
 *       201:
 *         description: Analysis successfully completed and stored in DSS table
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 questionnaire_id:
 *                   type: integer
 *                   example: 5
 *                 analysis_result:
 *                   type: string
 *                   description: JSON string containing analysis results
 *                   example: '[{"option_text": "Option A", "count": 23}, {"option_text": "Option B", "count": 17}]'
 *       500:
 *         description: Failed to perform analysis due to server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to perform analysis"
 */
exports.submitAnalysis = async (req, res) => {
  const { questionnaire_id } = req.body;
  
  try {
    // Example analysis logic: Find most common options selected for multiple-choice questions
    const results = await knex('answers')
      .join('question_options', 'answers.answer_option', '=', 'question_options.option_id')
      .join('questions', 'questions.question_id', '=', 'question_options.question_id')
      .where('questions.questionnaire_id', questionnaire_id)
      .groupBy('question_options.option_id')
      .select('question_options.option_text', knex.raw('COUNT(*) as count'))
      .orderBy('count', 'desc');

    // Store results in the DSS table
    const [analysisResult] = await knex('dss_analysis')
      .insert({ questionnaire_id, analysis_result: JSON.stringify(results) })
      .returning('*');
    
    res.status(201).json(analysisResult);
  } catch (err) {
    res.status(500).json({ error: `Failed to perform analysis ${err}` });
  }
};


/**
 * @swagger
 * /dss/results:
 *   get:
 *     security:
 *       - Authorization: [] 
 *     summary: Retrieve all questionnaire analysis results
 *     description: Fetches the analysis results for all questionnaires in the system.
 *     tags:
 *       - Analysis
 *     responses:
 *       200:
 *         description: Successfully retrieved analysis results for all questionnaires
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
 *                   analysis_results:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         option_text:
 *                           type: string
 *                           example: "Blue"
 *                         count:
 *                           type: integer
 *                           example: 10
 *                   analyzed_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-11-16T01:41:05.471Z"
 *       500:
 *         description: Failed to fetch analysis results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to fetch all analysis results"
 */

exports.getAllAnalysisResults = async (req, res) => {
  try {
    const analyses = await knex('dss_analysis').select('questionnaire_id', 'analysis_result', 'analyzed_at');

    analyses.map((analysis) => {
      console.log(analysis);
    })
    
    const results = analyses.map((analysis) => ({      
      questionnaire_id: analysis.questionnaire_id,
      analysis_results: analysis.analysis_result,
      analyzed_at: analysis.analyzed_at,
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: `Failed to fetch all analysis results ${err}` });
  }
};
