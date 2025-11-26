const db = require("../database/db");

async function getAllMatchBoxes() {
  return db("matchbox");
}

async function getMatchBoxById(id) {
  return db("matchbox").where({ id }).first();
}

async function createMatchBox(data) {
  const [created] = await db("matchbox").insert(data).returning("*");
  return created;
}

async function updateMatchBox(id, data) {
  const [updated] = await db("matchbox")
    .where({ id })
    .update(data)
    .returning("*");
  return updated;
}

async function deleteMatchBox(id) {
  return db("matchbox").where({ id }).del();
}

module.exports = {
  getAllMatchBoxes,
  getMatchBoxById,
  createMatchBox,
  updateMatchBox,
  deleteMatchBox,
};
