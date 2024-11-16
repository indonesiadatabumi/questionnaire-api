// seeds/008_dss_analysis.js
exports.seed = async function(knex) {
    // Deletes ALL existing entries
    await knex('dss_analysis').del();
  
    // Inserts seed entries
    await knex('dss_analysis').insert([
      { questionnaire_id: 1, analysis_result: JSON.stringify([{ option_text: 'Blue', count: 10 }, { option_text: 'Red', count: 5 }]) }
    ]);
  };