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
      beams: night.beams,
      seating: seating,
    };
  });
}

async function getMatchingNightById(id) {
  return db("matching_nights").where({ id }).first();
}

async function createMatchingNight(data) {
  const { week, beams, money, seating } = data;

  return db.transaction(async (trx) => {
    const [night] = await trx("matching_nights")
      .insert({
        week: week,
        beams: beams,
        money: money,
      })
      .returning("*");

    if (seating && Object.keys(seating).length > 0) {
      const picksToInsert = Object.entries(seating).map(([boyId, girlId]) => ({
        matching_nights_id: night.id,
        boys_id: boyId,
        girls_id: girlId,
      }));

      await trx("matching_picks").insert(picksToInsert);
    }

    // Wir geben die Night inkl. der seating Info zurück für das Frontend
    return { ...night, seating };
  });
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

async function getMoneyByWeek(week) {
  return db("matching_nights").where({ week }).select("money");
}

async function getLatestMoney() {
  return await db("matching_nights")
    .select("week", "money")
    .orderBy("week", "desc")
    .first();
}

module.exports = {
  getAllMatchingNights,
  getMatchingNightById,
  createMatchingNight,
  updateMatchingNight,
  deleteMatchingNight,
  getMoneyByWeek,
  getLatestMoney,
};
