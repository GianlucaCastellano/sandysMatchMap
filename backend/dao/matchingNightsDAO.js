const db = require("../database/db");

async function getAllMatchingNights() {
  return db("matching_nights");
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
