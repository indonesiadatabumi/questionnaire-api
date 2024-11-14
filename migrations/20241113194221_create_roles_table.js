// migrations/xxxx_create_roles_table.js
exports.up = function(knex) {
    return knex.schema.createTable('roles', function(table) {
      table.increments('role_id').primary();
      table.string('role_name').notNullable();
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('roles');
  };
  