const girlsDao = require("../dao/girlsDAO");

async function getAllGirls(req, res, next) {
  try {
    const girls = await girlsDao.getAllGirls();
    res.json(girls);
  } catch (error) {
    next(error);
  }
}

async function getGirlById(req, res, next) {
  try {
    const girl = await girlsDao.getGirlById(req.params.id);
    if (!girl) throw new Error("Teilnehmerin existiert nicht");

    res.json(girl);
  } catch (error) {
    next(error);
  }
}

async function createGirl(req, res, next) {
  try {
    const newGirl = await girlsDao.createGirl(req.body);
    res.status(201).json(newGirl);
  } catch (error) {
    next(error);
  }
}

async function updateGirl(req, res, next) {
  try {
    const updatedGirl = await girlsDao.updateGirl(req.params.id, req.body);
    if (!updatedGirl) throw new Error("Teilnehmerin existiert nicht");
    res.json(updatedGirl);
  } catch (error) {
    next(error);
  }
}

async function deleteGirl(req, res, next) {
  try {
    const girlId = await girlsDao.deleteGirl(req.params.id);
    if (!girlId) throw new Error("Teilnehmerin existiert nicht");
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllGirls,
  getGirlById,
  createGirl,
  updateGirl,
  deleteGirl,
};
