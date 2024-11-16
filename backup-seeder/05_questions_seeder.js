// seeds/005_questions.js
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('questions').del();
  
    // Inserts seed entries
    await knex('questions').insert([
      { questionnaire_id: 1, question_text: 'What is your favorite color?', question_type: 'multiple_choice' },
      { questionnaire_id: 1, question_text: 'Explain why you like this color?', question_type: 'text' }
    ]);
  };