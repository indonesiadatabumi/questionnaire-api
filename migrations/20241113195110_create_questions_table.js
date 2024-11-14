exports.up = function(knex) {
    return knex.schema.createTable('questions', function(table) {
      table.increments('question_id').primary(); // Auto-increment primary key
      table.integer('questionnaire_id').unsigned().references('questionnaire_id').inTable('questionnaires'); // Foreign key to questionnaires table
      table.text('question_text').notNullable(); // Question text as TEXT, not nullable
      table.enum('question_type', ['text', 'multiple_choice']).notNullable().defaultTo('text');
      table.text('options'); // JSON or serialized list of options for objective questions
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('questions');
  };