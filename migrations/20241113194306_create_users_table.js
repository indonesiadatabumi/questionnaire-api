// migrations/xxxx_create_users_table.js
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('user_id').primary();
      table.string('username').unique().notNullable();
      table.string('email').unique().notNullable();
      table.string('password_hash').notNullable();
      table.integer('role_id').unsigned().references('role_id').inTable('roles');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
  };
  