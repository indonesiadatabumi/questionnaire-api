exports.up = function(knex) {
    return knex.schema.createTable('questionnaires', function(table) {
      table.increments('questionnaire_id').primary(); // Auto-increment primary key
      table.string('title', 255).notNullable(); // Title with max length of 255
      table.text('description'); // Description as TEXT
      table.integer('created_by').unsigned().references('user_id').inTable('users'); // Foreign key to users table
      table.timestamp('created_at').defaultTo(knex.fn.now()); // Created timestamp with default to current time
      table.timestamp('updated_at').defaultTo(knex.fn.now()); // Updated timestamp with default to current time
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('questionnaires');
  };