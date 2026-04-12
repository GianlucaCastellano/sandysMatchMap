const db = require("../database/db");

async function getAllBoys() {
  return db("boys").select("*");
}

async function getBoyById(id) {
  return db("boys").where({ id }).first();
}

async function createBoy(name, age, image_url) {
  const [newBoy] = await db("boys")
    .insert({ name, age, image_url, active: true })
    .returning("*");
  return newBoy;
}

async function updateBoy(id, boy) {
  const [updatedBoy] = await db("boys")
    .where({ id })
    .update(boy)
    .returning("*");
  return updateBoy;
}

async function deleteBoy(id) {
  return db("boys").where({ id }).del();
}

module.exports = {
  getAllBoys,
  getBoyById,
  createBoy,
  updateBoy,
  deleteBoy,
};
