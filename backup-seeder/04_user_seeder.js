// seeds/001_users.js
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('users').del();
  
    // Inserts seed entries
    await knex('users').insert([
      { username: 'admin', email: 'admin@example.com', password_hash: 'hashedpassword', role_id: 1 },
      { username: 'user1', email: 'user1@example.com', password_hash: 'hashedpassword', role_id: 2 }
    ]);
  };