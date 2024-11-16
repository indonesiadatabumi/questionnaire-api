// seeds/006_question_options.js
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('question_options').del();
  
    // Inserts seed entries for multiple choice options
    await knex('question_options').insert([
      { question_id: 1, option_text: 'Red', is_correct: false },
      { question_id: 1, option_text: 'Blue', is_correct: true },
      { question_id: 1, option_text: 'Green', is_correct: false }
    ]);
  };