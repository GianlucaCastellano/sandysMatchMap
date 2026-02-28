const db = require("../database/db");

async function getAllMatchingNights() {
  const nights = await db("matching_nights").select("*").orderBy("week", "asc");
  const allPicks = await db("matching_picks").select(
    "matching_nights_id",
    "boys_id",
    "girls_id",
  );

  return nights.map((night) => {
    const seating = {};

    const nightPicks = allPicks.filter(
      (p) => p.matching_nights_id === night.id,
    );

    nightPicks.forEach((pick) => {
      seating[pick.boys_id] = pick.girls_id;
    });

    return {
      id: night.id,
      week: night.week,
      lights: night.beams,
      seating: seating,
    };
  });
}

async function getMatchingNightById(id) {
  return db("matching_nights").where({ id }).first();
}

async function createMatchingNight(data) {
  const [created] = await db("matching_nights").insert(data).returning("*");
  return created;
}

async function updateMatchingNight(id, data) {
  const [updated] = await db("matching_nights")
    .where({ id })
    .update(data)
    .returning("*");

  return updated;
}

async function deleteMatchingNight(id) {
  return db("matching_nights").where({ id }).del();
}

module.exports = {
  getAllMatchingNights,
  getMatchingNightById,
  createMatchingNight,
  updateMatchingNight,
  deleteMatchingNight,
};
