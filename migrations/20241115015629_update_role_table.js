
exports.up = function(knex) {
    return knex.schema
    .alterTable('roles', (table) => {
        table.text('description');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('roles', table => {
        table.dropColumn('description');
    });
};