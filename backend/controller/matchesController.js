const matchesDAO = require("../dao/matchesDAO");

async function getAllMatches(req, res, next) {
  try {
    const matches = await matchesDAO.getAllMatches();
    res.json(matches);
  } catch (error) {
    next(error);
  }
}

async function getMatchById(req, res, next) {
  try {
    const match = await matchesDAO.getMatchById(req.params.id);
    if (!match) throw new Error("Match nicht gefunden");
    res.json(match);
  } catch (error) {
    next(error);
  }
}

async function createMatch(req, res, next) {
  try {
    const { girlId, boyId, isMatch } = req.body;
    if (!girlId || !boyId)
      throw new Error("Teilnehmer und Teilnehmerin ID benötigt");

    const newMatch = await matchesDAO.createMatch({
      girlId,
      boyId,
      isMatch: isMatch ?? false,
    });

    res.status(201).json(newMatch);
  } catch (error) {
    next(error);
  }
}

async function updateMatch(req, res, next) {
  try {
    const updated = await matchesDAO.updateMatch(req.params.id, req.body);
    if (!updated) throw new Error("Match existiert nicht");
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteMatch(req, res, next) {
  try {
    const matchId = await matchesDAO.deleteMatch(req.params.id);
    if (!matchId) throw new Error("Match existiert nicht");
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
