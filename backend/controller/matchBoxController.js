const matchBoxDAO = require("../dao/matchBoxDAO");

async function getAllMatchBoxes(req, res, next) {
  try {
    const items = await matchBoxDAO.getAllMatchBoxes();
    res.json(items);
  } catch (error) {
    next(error);
  }
}

async function getMatchBoxById(req, res, next) {
  try {
    const item = await matchBoxDAO.getMatchBoxById(req.params.id);
    if (!item) throw new Error("Matchbox Eintrag konnte nicht gefunden werden");
    res.json(item);
  } catch (error) {
    next(error);
  }
}

async function createMatchBox(req, res, next) {
  try {
    const { girlId, boyId, result } = req.body;
    if (!girlId || !boyId)
      throw new Error("Teilnehmer und Teilnehmerin ID benötigt");

    const created = await matchBoxDAO.createMatchBox({ girlId, boyId, result });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

async function updateMatchBox(req, res, next) {
  try {
    const updated = await matchBoxDAO.update(req.params.id, req.body);
    if (!updated) throw new Error("Matchbox existiert nicht");

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteMatchBox(req, res, next) {
  try {
    const deleted = await matchBoxDAO.deleteMatchBox(req.params.id);
    if (!deleted) throw new Error("Matchbox existiert nicht");

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMatchBoxes,
  getMatchBoxById,
  createMatchBox,
  updateMatchBox,
  deleteMatchBox,
};
