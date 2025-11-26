const db = require("../database/db");

async function getAllMatchingPicks() {
  return db("matching_picks");
}

async function getMatchingPickById(id) {
  return db("matching_picks").where({ id }).first();
}

async function createMatchingPick(data) {
  const [created] = await db("matching_picks").insert(data).returning("*");
  return created;
}

async function updateMatchingPick(id, data) {
  const [updated] = await db("matching_picks")
    .where({ id })
    .update(data)
    .returning("*");
  return updated;
}

async function deleteMatchingPick(id) {
  return db("matching_picks").where({ id }).del();
}

module.exports = {
  getAllMatchingPicks,
  getMatchingPickById,
  createMatchingPick,
  updateMatchingPick,
  deleteMatchingPick,
};
