var bcrypt = require('bcryptjs');
exports.seed = async function(knex) {
    // Deletes ALL existing entries in reverse order to avoid foreign key issues
    await knex('dss_analysis').del();
    await knex('answers').del();
    await knex('question_options').del();
    await knex('questions').del();
    await knex('questionnaire_responses').del();
    await knex('questionnaires').del();  
    await knex('users').del();
    await knex('role_privileges').del();
    await knex('endpoints').del();
    await knex('roles').del();
    await knex('mbti_questions').del();
    await knex('mbti_types').del();
    
    
    const [adminRole] = await knex('roles').insert({ role_name: 'admin', description: 'Full access, including user management' }).returning('*');
    const [managerRole] = await knex('roles').insert({ role_name: 'questionnaire manager', description: 'Manage questionnaires and generate reports' }).returning('*');
    const [memberRole] = await knex('roles').insert({ role_name: 'member', description: 'Submit answers and view own data' }).returning('*');
    // await knex('roles').insert([
    //   { role_id: 1, role_name: 'Admin', description: 'Administrator role with full access' },
    //   { role_id: 2, role_name: 'User', description: 'Regular user with limited access' }
    // ]);

    await knex('endpoints').insert([
      { endpoint_id: 1, url: '/register', method: 'POST', description: 'User registration endpoint' },
      { endpoint_id: 2, url: '/login', method: 'POST', description: 'User login endpoint' },
      { endpoint_id: 3, url: '/roles', method: 'POST', description: 'Create a new role' },
      { endpoint_id: 4, url: '/roles', method: 'GET', description: 'Fetch all roles' },
      { endpoint_id: 5, url: '/endpoints', method: 'POST', description: 'Create a new endpoint' },
      { endpoint_id: 6, url: '/endpoints', method: 'GET', description: 'Fetch all endpoints' },
      { endpoint_id: 7, url: '/role_privileges', method: 'POST', description: 'Assign or update role privileges for endpoints' },
      { endpoint_id: 8, url: '/questionnaire', method: 'GET', description: 'Get questionnaire' },
      { endpoint_id: 9, url: '/questionnaire', method: 'POST', description: 'Create questionnaire' },
      { endpoint_id: 10, url: '/questions', method: 'POST', description: 'Create a new question' },
      { endpoint_id: 11, url: '/questions/:questionnaire_id', method: 'GET', description: 'Fetch questions by questionnaire' },
      { endpoint_id: 12, url: '/submitAnswer', method: 'POST', description: 'Submit answers' },
      { endpoint_id: 13, url: '/dss/submit', method: 'POST', description: 'Submit answers for analysis' },
      { endpoint_id: 14, url: '/mbti/questions', method: 'GET', description: 'Get the MBTI Questionnare' },
      { endpoint_id: 15, url: '/mbti/submit', method: 'POST', description: 'Submit answers for MBTI analysis' },
      { endpoint_id: 16, url: '/mbti/user-type', method: 'GET', description: 'Get the user type' },
    ]);
  
    const privileges = [
      // Admin privileges: Full access
      { role_id: adminRole.role_id, endpoint_id: 1, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 2, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 3, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 4, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 5, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 6, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 7, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 8, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 9, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 10, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 11, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 12, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 13, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 14, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 15, can_create: true, can_read: true, can_update: true, can_delete: true },
      { role_id: adminRole.role_id, endpoint_id: 16, can_create: true, can_read: true, can_update: true, can_delete: true },
  
      // Questionnaire Manager privileges
      { role_id: managerRole.role_id, endpoint_id: 8, can_create: true, can_read: true, can_update: true, can_delete: true }, // Manage questions
      { role_id: managerRole.role_id, endpoint_id: 9, can_create: true, can_read: true, can_update: true, can_delete: true }, // Fetch questions by questionnaire
      { role_id: managerRole.role_id, endpoint_id: 10, can_create: true, can_read: true, can_update: true, can_delete: true }, // Manage questions
      { role_id: managerRole.role_id, endpoint_id: 11, can_create: true, can_read: true, can_update: true, can_delete: true }, // Fetch questions by questionnaire
      { role_id: managerRole.role_id, endpoint_id: 12, can_create: true, can_read: true, can_update: true, can_delete: true }, // Manage MBTI questions
      { role_id: managerRole.role_id, endpoint_id: 13, can_create: true, can_read: true, can_update: true, can_delete: true }, // Submit MBTI answers
      { role_id: managerRole.role_id, endpoint_id: 4, can_create: false, can_read: true, can_update: false, can_delete: false }, // Read roles
      { role_id: managerRole.role_id, endpoint_id: 14, can_create: false, can_read: true, can_update: false, can_delete: false }, // Read user MBTI type
  
      // Member privileges
      { role_id: memberRole.role_id, endpoint_id: 12, can_create: true, can_read: false, can_update: false, can_delete: false }, // Submit answers
      { role_id: memberRole.role_id, endpoint_id: 15, can_create: true, can_read: false, can_update: false, can_delete: false }, // Submit MBTI answers
      { role_id: memberRole.role_id, endpoint_id: 16, can_create: false, can_read: true, can_update: false, can_delete: false }, // View user MBTI type
    ];
  
    // Insert privileges
    await knex('role_privileges').insert(privileges);
  
    // await knex('role_privileges').insert([
    //   { role_id: 1, endpoint_id: 1, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 2, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 3, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 4, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 5, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 6, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 7, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 8, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 9, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 10, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 11, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 12, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 13, can_create: true, can_read: true, can_update: true, can_delete: true },
    //   { role_id: 1, endpoint_id: 14, can_create: true, can_read: true, can_update: true, can_delete: true },

    //   { role_id: 2, endpoint_id: 1, can_create: false, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 2, can_create: false, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 3, can_create: false, can_read: false, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 4, can_create: false, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 5, can_create: false, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 6, can_create: false, can_read: false, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 7, can_create: false, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 8, can_create: true, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 9, can_create: true, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 10, can_create: true, can_read: true, can_update: false, can_delete: false },
    //   { role_id: 2, endpoint_id: 11, can_create: true, can_read: true, can_update: false, can_delete: false }
    //   { role_id: 2, endpoint_id: 12, can_create: true, can_read: true, can_update: false, can_delete: false }
    //   { role_id: 2, endpoint_id: 13, can_create: true, can_read: true, can_update: false, can_delete: false }
    //   { role_id: 2, endpoint_id: 14, can_create: true, can_read: true, can_update: false, can_delete: false }
    // ]);
  
    await knex('users').insert([
      { user_id: 1, username: 'admin', email: 'admin@example.com', password_hash: bcrypt.hashSync('admin', 8), role_id: adminRole.role_id },
      { user_id: 2, username: 'manager', email: 'manager@example.com', password_hash: bcrypt.hashSync('manager', 8), role_id: managerRole.role_id },
      { user_id: 3, username: 'member', email: 'member@example.com', password_hash: bcrypt.hashSync('member', 8), role_id: memberRole.role_id }
    ]);

    await knex('questionnaires').insert([
      { questionnaire_id: 1, title: 'Get the detail identity?' },
      { questionnaire_id: 2, title: 'Get the detail hashed identity?' }
    ]);
        
    await knex('questions').insert([
      { question_id: 1, questionnaire_id: 1, question_text: 'What is your favorite color?', question_type: 'multiple_choice' },
      { question_id: 2, questionnaire_id: 1, question_text: 'Explain why you like this color?', question_type: 'text' }
    ]);
  
    await knex('question_options').insert([
      { option_id: 1, question_id: 1, option_text: 'Red', is_correct: false },
      { option_id: 2, question_id: 1, option_text: 'Blue', is_correct: true },
      { option_id: 3, question_id: 1, option_text: 'Green', is_correct: false }
    ]);

    await knex('questionnaire_responses').insert([
      { response_id: 1, questionnaire_id: 1, user_id: 1},
      { response_id: 2, questionnaire_id: 1, user_id: 1}
    ]);

  
    await knex('answers').insert([
      { answer_id: 1, response_id: 1, question_id: 1, answer_option: 2 },  // Assuming 2 is the correct option ID for "Blue"
      { answer_id: 2, response_id: 1, question_id: 2, answer_text: 'Because it is calm and peaceful.' }
    ]);
  
    await knex('dss_analysis').insert([
      { analysis_id: 1, questionnaire_id: 1, analysis_result: JSON.stringify([{ option_text: 'Blue', count: 10 }, { option_text: 'Red', count: 5 }]) }
    ]);

    const mbtiTypes = [
      { type_name: 'ISTJ', description: 'The Inspector: Responsible, serious, traditional, and organized.' },
      { type_name: 'ISFJ', description: 'The Protector: Warm, caring, meticulous, and dependable.' },
      { type_name: 'INFJ', description: 'The Advocate: Visionary, empathetic, inspiring, and creative.' },
      { type_name: 'INTJ', description: 'The Architect: Strategic, logical, independent, and determined.' },
      { type_name: 'ISTP', description: 'The Virtuoso: Practical, spontaneous, analytical, and resourceful.' },
      { type_name: 'ISFP', description: 'The Adventurer: Artistic, adaptable, sensitive, and easygoing.' },
      { type_name: 'INFP', description: 'The Mediator: Idealistic, empathetic, introspective, and kind.' },
      { type_name: 'INTP', description: 'The Thinker: Curious, analytical, intellectual, and innovative.' },
      { type_name: 'ESTP', description: 'The Entrepreneur: Energetic, outgoing, adventurous, and bold.' },
      { type_name: 'ESFP', description: 'The Entertainer: Fun-loving, enthusiastic, spontaneous, and lively.' },
      { type_name: 'ENFP', description: 'The Campaigner: Creative, optimistic, enthusiastic, and friendly.' },
      { type_name: 'ENTP', description: 'The Debater: Charismatic, curious, energetic, and strategic.' },
      { type_name: 'ESTJ', description: 'The Executive: Organized, traditional, practical, and direct.' },
      { type_name: 'ESFJ', description: 'The Consul: Caring, social, reliable, and loyal.' },
      { type_name: 'ENFJ', description: 'The Protagonist: Inspiring, empathetic, charismatic, and altruistic.' },
      { type_name: 'ENTJ', description: 'The Commander: Visionary, assertive, strategic, and confident.' },
    ];

    await knex('mbti_types').insert(mbtiTypes);

    const mbtiQuestions = [
      { question_text: 'You enjoy vibrant social events with lots of people.', dimension: 'EI', direction: 'negative' },
      { question_text: 'You often spend time exploring unrealistic and impractical ideas.', dimension: 'SN', direction: 'positive' },
    ];

    await knex('mbti_questions').insert(mbtiQuestions);
  };
  