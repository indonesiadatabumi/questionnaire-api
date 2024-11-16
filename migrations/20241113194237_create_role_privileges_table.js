// migrations/xxxx_create_role_privileges_table.js
exports.up = function(knex) {
    return knex.schema.createTable('role_privileges', function(table) {
      table.increments('role_privilege_id').primary();
      table.integer('role_id').unsigned().references('role_id').inTable('roles');
      table.integer('endpoint_id').unsigned().references('endpoint_id').inTable('endpoints');
      table.boolean('can_create').defaultTo(false);
      table.boolean('can_read').defaultTo(false);
      table.boolean('can_update').defaultTo(false);
      table.boolean('can_delete').defaultTo(false);
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('role_privileges');
  };
  