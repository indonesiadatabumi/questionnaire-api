// migration for creating the 'answers' table
exports.up = function(knex) {
    return knex.schema.createTable('answers', function(table) {
      table.increments('answer_id').primary(); // Auto-increment primary key
      table.integer('response_id').unsigned().references('response_id').inTable('questionnaire_responses'); // Foreign key to questionnaire_responses table
      table.integer('question_id').unsigned().references('question_id').inTable('questions'); // Foreign key to questions table
      table.text('answer_text'); // For subjective answers
      table.integer('answer_option'); // Option index for objective questions
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('answers');
  };
  