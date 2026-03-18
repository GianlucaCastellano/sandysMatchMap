exports.seed = async function (knex) {
  await knex("matching_picks").del();
  await knex("matching_nights").del();
  await knex("matchbox").del();
  await knex("matches").del();
  await knex("boys").del();
  await knex("girls").del();

  const girls = await knex("girls")
    .insert([
      { name: "Lara", age: 23, active: false },
      { name: "Sophie", age: 25, active: false },
      { name: "Mia", age: 22, active: true },
      { name: "Emilia", age: 24, active: true },
      { name: "Hannah", age: 21, active: true },
      { name: "Lea", age: 26, active: true },
      { name: "Lina", age: 23, active: true },
      { name: "Marie", age: 27, active: true },
      { name: "Sarah", age: 24, active: true },
      { name: "Jana", age: 22, active: true },
    ])
    .returning("*");

  const boys = await knex("boys")
    .insert([
      { name: "Lukas", age: 25, active: false },
      { name: "Leon", age: 24, active: false },
      { name: "Kevin", age: 26, active: true },
      { name: "Dennis", age: 28, active: true },
      { name: "Tim", age: 23, active: true },
      { name: "Finn", age: 25, active: true },
      { name: "Jonas", age: 29, active: true },
      { name: "Luis", age: 22, active: true },
      { name: "Julian", age: 27, active: true },
      { name: "Max", age: 24, active: true },
    ])
    .returning("*");

  const g = (name) => girls.find((x) => x.name === name).id;
  const b = (name) => boys.find((x) => x.name === name).id;

  await knex("matchbox").insert([
    { boys_id: b("Lukas"), girls_id: g("Lara"), result: true },
    { boys_id: b("Leon"), girls_id: g("Sophie"), result: true },
    { boys_id: b("Kevin"), girls_id: g("Lara"), result: false },
    { boys_id: b("Dennis"), girls_id: g("Sophie"), result: false },
    { boys_id: b("Tim"), girls_id: g("Mia"), result: false },
  ]);

  await knex("matches").insert([
    { boys_id: b("Lukas"), girls_id: g("Lara"), is_match: true, week: 3 },
    { boys_id: b("Leon"), girls_id: g("Sophie"), is_match: true, week: 5 },
  ]);

  const nights = await knex("matching_nights")
    .insert([
      { week: 1, beams: 2 },
      { week: 2, beams: 1 },
      { week: 3, beams: 3 },
      { week: 4, beams: 2 },
      { week: 5, beams: 4 },
      { week: 6, beams: 4 },
    ])
    .returning("*");

  const n = (w) => nights.find((x) => x.week === w).id;

  const picksData = [
    {
      w: 1,
      picks: [
        ["Lukas", "Sophie"],
        ["Leon", "Lara"],
        ["Kevin", "Sarah"],
        ["Dennis", "Mia"],
        ["Tim", "Hannah"],
        ["Finn", "Lea"],
        ["Jonas", "Marie"],
        ["Luis", "Lina"],
        ["Julian", "Emilia"],
        ["Max", "Jana"],
      ],
    },
    {
      w: 2,
      picks: [
        ["Lukas", "Jana"],
        ["Leon", "Hannah"],
        ["Kevin", "Sophie"],
        ["Dennis", "Lara"],
        ["Tim", "Mia"],
        ["Finn", "Sarah"],
        ["Jonas", "Emilia"],
        ["Luis", "Marie"],
        ["Julian", "Lina"],
        ["Max", "Lea"],
      ],
    },
    {
      w: 3,
      picks: [
        ["Lukas", "Lara"],
        ["Leon", "Sarah"],
        ["Kevin", "Sophie"],
        ["Dennis", "Mia"],
        ["Tim", "Jana"],
        ["Finn", "Hannah"],
        ["Jonas", "Lina"],
        ["Luis", "Lea"],
        ["Julian", "Emilia"],
        ["Max", "Marie"],
      ],
    },
    {
      w: 4,
      picks: [
        ["Lukas", "Lara"],
        ["Leon", "Lina"],
        ["Kevin", "Mia"],
        ["Dennis", "Sarah"],
        ["Tim", "Hannah"],
        ["Finn", "Marie"],
        ["Jonas", "Jana"],
        ["Luis", "Sophie"],
        ["Julian", "Emilia"],
        ["Max", "Lea"],
      ],
    },
    {
      w: 5,
      picks: [
        ["Lukas", "Lara"],
        ["Leon", "Sophie"],
        ["Kevin", "Sarah"],
        ["Dennis", "Mia"],
        ["Tim", "Lina"],
        ["Finn", "Jana"],
        ["Jonas", "Hannah"],
        ["Luis", "Marie"],
        ["Julian", "Emilia"],
        ["Max", "Lea"],
      ],
    },
    {
      w: 6,
      picks: [
        ["Lukas", "Lara"],
        ["Leon", "Sophie"],
        ["Kevin", "Lina"],
        ["Dennis", "Sarah"],
        ["Tim", "Mia"],
        ["Finn", "Marie"],
        ["Jonas", "Lea"],
        ["Luis", "Hannah"],
        ["Julian", "Jana"],
        ["Max", "Emilia"],
      ],
    },
  ];

  const finalPicks = [];
  picksData.forEach((night) => {
    night.picks.forEach((p) => {
      finalPicks.push({
        matching_nights_id: n(night.w),
        boys_id: b(p[0]),
        girls_id: g(p[1]),
      });
    });
  });

  await knex("matching_picks").insert(finalPicks);
};
