// seeds/007_answers.js
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('answers').del();
  
    // Inserts seed entries
    await knex('answers').insert([
      { response_id: 1, question_id: 1, answer_option: 2 },  // Assuming 2 is the correct option ID for "Blue"
      { response_id: 1, question_id: 2, answer_text: 'Because it is calm and peaceful.' }
    ]);
  };
  