const matchingNightsDAO = require("../dao/matchingNightsDAO");

async function getAllMatchingNights(req, res, next) {
  try {
    const items = await matchingNightsDAO.getAllMatchingNights();
    res.json(items);
  } catch (error) {
    next(error);
  }
}

async function getMatchingNightById(req, res, next) {
  try {
    const matchingNight = await matchingNightsDAO.getMatchingNightById(
      req.params.id
    );
    if (!matchingNight) throw new Error("Matching Night nicht gefunden");
    res.json(matchingNight);
  } catch (error) {
    next(error);
  }
}

async function createMatchingNight(req, res, next) {
  try {
    const { week, beams } = req.body;
    if (!week) throw new Error("Wochen nummer muss angegeben werden");

    const created = await matchingNightsDAO.createMatchingNight({
      week,
      beams,
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateMatchingNight(req, res, next) {
  try {
    const updated = await matchingNightsDAO.updateMatchingNight(
      req.params.id,
      req.body
    );
    if (!updated) throw new Error("Matching Night existiert nicht");
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteMatchingNight(req, res, next) {
  try {
    const deleted = await matchingNightsDAO.deleteMatchingNight(req.params.id);
    if (!deleted) throw new Error("Matching Night existiert nicht");
    res.json({ sucess: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMatchingNights,
  getMatchingNightById,
  createMatchingNight,
  updateMatchingNight,
  deleteMatchingNight,
};
