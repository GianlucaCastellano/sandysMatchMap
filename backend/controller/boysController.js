const boysDao = require("../dao/boysDAO");

async function getAllBoys(req, res, next) {
  try {
    const boys = await boysDao.getAllBoys();
    res.json(boys);
  } catch (error) {
    next(error);
  }
}

async function getBoyById(req, res, next) {
  try {
    const boy = await boysDao.getBoyById(req.params.id);
    if (!boy) throw new Error("Teilnehmer existiert nicht");
    res.json(boy);
  } catch (error) {
    next(error);
  }
}

async function createBoy(req, res, next) {
  try {
    const newBoy = await boysDao.createBoy(req.body);
    res.status(201).json(newBoy);
  } catch (error) {
    next(error);
  }
}

async function updateBoy(req, res, next) {
  try {
    const updatedBoy = await boysDao.updateBoy(req.params.id, req.body);
    if (!updatedBoy) throw new Error("Teilnehmer existiert nicht");
    res.json(updatedBoy);
  } catch (error) {
    next(error);
  }
}

async function deleteBoy(req, res, next) {
  try {
    const boyId = await boysDao.deleteBoy(req.params.id);
    if (!boyId) throw new Error("Teilnehmer existiert nicht");
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllBoys,
  getBoyById,
  createBoy,
  updateBoy,
  deleteBoy,
};
