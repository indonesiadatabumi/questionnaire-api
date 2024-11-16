exports.up = async function (knex) {
    await knex.schema.createTable('mbti_questions', (table) => {
        table.increments('question_id').primary();
        table.string('question_text').notNullable();
        table.enum('dimension', ['EI', 'SN', 'TF', 'JP']).notNullable(); // E-I, S-N, T-F, J-P
        table.enum('direction', ['positive', 'negative']).notNullable(); // Determines question effect
    });

    await knex.schema.createTable('mbti_types', (table) => {
        table.increments('type_id').primary();
        table.string('type_name', 4).notNullable().unique(); // e.g., "INTJ", "ENFP"
        table.string('description').notNullable();
    });

    await knex.schema.createTable('user_mbti', (table) => {
        table.increments('user_mbti_id').primary();
        table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users');
        table.integer('type_id').unsigned().notNullable().references('type_id').inTable('mbti_types');
        table.timestamp('assigned_at').defaultTo(knex.fn.now());
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('user_mbti');
    await knex.schema.dropTableIfExists('mbti_types');
    await knex.schema.dropTableIfExists('mbti_questions');
};