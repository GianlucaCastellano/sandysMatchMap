const db = require("../database/db");

async function getAllGirls() {
  return db("girls").select("*");
}

async function getGirlById(id) {
  return db("girls").where({ id }).first();
}

async function createGirl(girl) {
  const [newGirl] = await db("girls").insert(girl).returning("*");
  return newGirl;
}

async function updateGirl(id, girl) {
  const [updatedGirl] = await db("girls")
    .where({ id })
    .update(girl)
    .returning("*");
  return updateGirl;
}

async function deleteGirl(id) {
  return db("girls").where({ id }).del();
}

module.exports = {
  getAllGirls,
  getGirlById,
  createGirl,
  updateGirl,
  deleteGirl,
};
