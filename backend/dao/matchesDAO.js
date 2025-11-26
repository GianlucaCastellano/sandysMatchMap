const db = require("../database/db");

async function getAllMatches() {
  return db("matches as m")
    .select(
      "m.id",
      "m.girl_id",
      "g.name as girl_name",
      "m.boy_id",
      "b.name as boy_name",
      "m.is_match"
    )
    .leftJoin("girls as g", "m.girl_id", "g.id")
    .leftJoin("boys as b", "m.boy_id", "b.id");
}

async function getMatchById(id) {
  return db("matches as m")
    .select(
      "m.id",
      "m.girl_id",
      "g.name as girl_name",
      "m.boy_id",
      "b.name as boy_name",
      "m.is_match"
    )
    .leftJoin("girls as g", "m.girl_id", "g.id")
    .leftJoin("boys as b", "m.boy_id", "b.id")
    .where("m.id", id)
    .first();
}

async function createMatch(match) {
  const [newMatch] = await db("matches").insert(match).returning("*");
  return newMatch;
}

async function updateMatch(id, match) {
  const [updated] = await db("matches")
    .where({ id })
    .update(match)
    .returning("*");

  return updated;
}

async function deleteMatch(id) {
  return db("matches").where({ id }).del();
}

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
