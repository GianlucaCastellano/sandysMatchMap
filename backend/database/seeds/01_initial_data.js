/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // 1. Tabellen leeren (Reihenfolge wegen Foreign Keys wichtig!)
  await knex("matching_picks").del();
  await knex("matching_nights").del();
  await knex("matchbox").del();
  await knex("matches").del();
  await knex("boys").del();
  await knex("girls").del();

  // 2. Girls einfügen und IDs speichern
  const [g1, g2, g3] = await knex("girls")
    .insert([
      { name: "Lara", age: 23, active: true },
      { name: "Sophie", age: 25, active: true },
      { name: "Mia", age: 22, active: true },
    ])
    .returning("id");

  // 3. Boys einfügen und IDs speichern
  const [b1, b2, b3] = await knex("boys")
    .insert([
      { name: "Kevin", age: 24, active: true },
      { name: "Dennis", age: 27, active: true },
      { name: "Lukas", age: 26, active: true },
    ])
    .returning("id");

  // 4. Ein Matchbox-Ergebnis (Truth Booth) simulieren
  // Kevin (b1) und Lara (g1) sind KEIN Match
  await knex("matchbox").insert({
    girls_id: g1.id,
    boys_id: b1.id,
    result: false,
  });

  // 5. Eine Matching Night erstellen
  const [night1] = await knex("matching_nights")
    .insert({
      week: 1,
      beams: 1, // Nur ein Licht in dieser Nacht!
    })
    .returning("id");

  // 6. Die Picks für diese Nacht (Wer saß mit wem zusammen?)
  await knex("matching_picks").insert([
    { matching_nights_id: night1.id, boys_id: b1.id, girls_id: g1.id }, // Kevin & Lara
    { matching_nights_id: night1.id, boys_id: b2.id, girls_id: g2.id }, // Dennis & Sophie
    { matching_nights_id: night1.id, boys_id: b3.id, girls_id: g3.id }, // Lukas & Mia
  ]);
};
