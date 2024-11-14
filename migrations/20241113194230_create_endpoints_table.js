// migrations/xxxx_create_endpoints_table.js
exports.up = function(knex) {
    return knex.schema.createTable('endpoints', function(table) {
      table.increments('endpoint_id').primary();
      table.string('url').notNullable();
      table.string('method').notNullable(); // e.g., GET, POST, PUT, DELETE
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('endpoints');
  };
  