// migrations/xxxx_create_question_options_table.js
exports.up = function(knex) {
    return knex.schema.createTable('question_options', function(table) {
      table.increments('option_id').primary();
      table.integer('question_id').unsigned().references('question_id').inTable('questions').onDelete('CASCADE');
      table.string('option_text').notNullable();  // Text for the option
      table.boolean('is_correct').defaultTo(false);  // Flag to indicate if this option is correct
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('question_options');
  };
  