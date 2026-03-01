exports.seed = async function (knex) {
  await knex("matching_picks").del();
  await knex("matching_nights").del();
  await knex("matchbox").del();
  await knex("boys").del();
  await knex("girls").del();

  const girls = await knex("girls")
    .insert([
      { name: "Lara" },
      { name: "Sophie" },
      { name: "Mia" },
      { name: "Emilia" },
      { name: "Hannah" },
      { name: "Lea" },
      { name: "Lina" },
      { name: "Marie" },
      { name: "Sarah" },
      { name: "Jana" },
    ])
    .returning("*");

  const boys = await knex("boys")
    .insert([
      { name: "Kevin" },
      { name: "Dennis" },
      { name: "Lukas" },
      { name: "Leon" },
      { name: "Tim" },
      { name: "Finn" },
      { name: "Jonas" },
      { name: "Luis" },
      { name: "Julian" },
      { name: "Max" },
    ])
    .returning("*");

  const g = (name) => girls.find((x) => x.name === name).id;
  const b = (name) => boys.find((x) => x.name === name).id;

  // 1. TRUTH BOOTH: Wir legen fest, wer KEIN Match ist
  await knex("matchbox").insert([
    { boys_id: b("Kevin"), girls_id: g("Lara"), result: false },
  ]);

  // 2. MATCHING NIGHTS: Wir simulieren 2 Wochen
  const nights = await knex("matching_nights")
    .insert([
      { week: 1, beams: 3 }, // Wir sagen: 3 Paare hier sind richtig
      { week: 2, beams: 1 }, // Wir sagen: Nur 1 Paar hier ist richtig
    ])
    .returning("*");

  // WOCHE 1 PICKS
  await knex("matching_picks").insert([
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Kevin"),
      girls_id: g("Sophie"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Dennis"),
      girls_id: g("Lara"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Lukas"),
      girls_id: g("Mia"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Leon"),
      girls_id: g("Emilia"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Tim"),
      girls_id: g("Hannah"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Finn"),
      girls_id: g("Lea"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Jonas"),
      girls_id: g("Lina"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Luis"),
      girls_id: g("Marie"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Julian"),
      girls_id: g("Sarah"),
    },
    {
      matching_nights_id: nights[0].id,
      boys_id: b("Max"),
      girls_id: g("Jana"),
    },
  ]);

  // WOCHE 2 PICKS (Alles durchgemischt)
  await knex("matching_picks").insert([
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Kevin"),
      girls_id: g("Jana"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Dennis"),
      girls_id: g("Sarah"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Lukas"),
      girls_id: g("Marie"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Leon"),
      girls_id: g("Lina"),
    },
    { matching_nights_id: nights[1].id, boys_id: b("Tim"), girls_id: g("Lea") },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Finn"),
      girls_id: g("Hannah"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Jonas"),
      girls_id: g("Emilia"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Luis"),
      girls_id: g("Mia"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Julian"),
      girls_id: g("Sophie"),
    },
    {
      matching_nights_id: nights[1].id,
      boys_id: b("Max"),
      girls_id: g("Lara"),
    },
  ]);
};
