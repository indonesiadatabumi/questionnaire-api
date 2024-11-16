
exports.up = function(knex) {
    return knex.schema
    .alterTable('endpoints', (table) => {
        table.text('description');
    });
};

exports.down = function(knex) {
    return knex.schema
    .alterTable('endpoints', table => {
        table.dropColumn('description');
    });
};