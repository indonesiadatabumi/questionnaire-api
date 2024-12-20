// routes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const roleController = require('../controllers/roleController');
const rolePrivilegesController = require('../controllers/rolePrivilegesController');
const endpointController = require('../controllers/endpointController');
const questionController = require('../controllers/questionController');
const answerController = require('../controllers/answerController');
const dssController = require('../controllers/dssController');
const mbtiController = require('../controllers/mbtiController');
const questionnareController = require('../controllers/questionnaireController');

const checkRolePermission = require('../middlewares/rbacMiddleware');

// User routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/get-role', userController.decodeRole);

// Role routes
router.post('/roles', checkRolePermission, roleController.createRole);
router.get('/roles', checkRolePermission, roleController.getRoles);

// Endpoint routes
router.post('/endpoints', checkRolePermission, endpointController.createEndpoint);
router.get('/endpoints', checkRolePermission, endpointController.getEndpoints);

// Role Privileges routes
router.post('/role_privileges', checkRolePermission, rolePrivilegesController.setRolePrivileges);

// Questionnare Routes
router.post('/questionnaire', checkRolePermission, questionnareController.createQuestionnaire);
router.get('/questionnaire', checkRolePermission, questionnareController.getQuestionnaires);

// Question routes
router.post('/questions', checkRolePermission, questionController.createQuestion); // Create a new question (supports multi-choice)
router.get('/questions/:questionnaire_id', checkRolePermission, questionController.getQuestionsByQuestionnaire); // Get questions by questionnaire

// Answer routes
router.post('/submitAnswer', checkRolePermission, answerController.submitAnswer); // Submit an answer (supports multi-choice answers)

// DSS routes
router.post('/dss/submit', checkRolePermission, dssController.submitAnalysis); // Perform analysis on submitted answers
router.get('/dss/results', checkRolePermission, dssController.getAllAnalysisResults); // Perform analysis on submitted answers

// MBTI Routes
router.get('/mbti/questions', checkRolePermission, mbtiController.getMBTIQuestions);
router.post('/mbti/questions', checkRolePermission, mbtiController.createMBTIQuestion);
router.post('/mbti/submit', checkRolePermission, mbtiController.submitMBTIAnswers);
router.get('/mbti/user-type', checkRolePermission, mbtiController.getUserMBTIType);
router.get('/mbti/admin-results', checkRolePermission, mbtiController.getAllMBTIResults);
router.get('/mbti/member-result', checkRolePermission, mbtiController.getMemberMBTIResult);


module.exports = router;
