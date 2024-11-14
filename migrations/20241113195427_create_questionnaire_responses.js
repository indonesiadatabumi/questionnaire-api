// migration for creating the 'questionnaire_responses' table
exports.up = function(knex) {
    return knex.schema.createTable('questionnaire_responses', function(table) {
      table.increments('response_id').primary(); // Auto-increment primary key
      table.integer('questionnaire_id').unsigned().references('questionnaire_id').inTable('questionnaires'); // Foreign key to questionnaires table
      table.integer('user_id').unsigned().references('user_id').inTable('users'); // Foreign key to users table
      table.timestamp('submitted_at').defaultTo(knex.fn.now()); // Submitted timestamp with default to current time
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('questionnaire_responses');
  };
  