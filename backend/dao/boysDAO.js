const db = require("../database/db");

async function getAllBoys() {
    return db("boys").select("*");

}

async function getBoyById(id) {
    return db("boys").where({id}).first();
}

async function createBoy(boy) {
    const [newBoy] = await db 
}