// migration for creating the 'dss_analysis' table
exports.up = function(knex) {
    return knex.schema.createTable('dss_analysis', function(table) {
      table.increments('analysis_id').primary(); // Auto-increment primary key
      table.integer('questionnaire_id').unsigned().references('questionnaire_id').inTable('questionnaires'); // Foreign key to questionnaires table
      table.json('analysis_result'); // JSON column for analysis results
      table.timestamp('analyzed_at').defaultTo(knex.fn.now()); // Analyzed timestamp with default to current time
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('dss_analysis');
  };
  