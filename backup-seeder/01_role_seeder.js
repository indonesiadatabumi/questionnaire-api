exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('roles').del();

  // Inserts seed entries
  await knex('roles').insert([
    { role_name: 'Admin', description: 'Administrator role with full access' },
    { role_name: 'User', description: 'Regular user with limited access' }
  ]);
};