const matchingPicksDAO = require("../dao/matchingPicksDAO");

async function getAllMatchingPicks(req, res, next) {
  try {
    const matchingPicks = await matchingPicksDAO.getAllMatchingPicks();
    res.json(matchingPicks);
  } catch (error) {
    next(error);
  }
}

async function getMatchingPickById(req, res, next) {
  try {
    const matchingPick = await matchingPicksDAO.getMatchingPickById(
      req.params.id
    );
    if (!matchingPick)
      throw new Error("Matching Pick Eintrag konnte nicht gefunden werden");
    res.json(matchingPick);
  } catch (error) {
    next(error);
  }
}

async function createMatchingPick(req, res, next) {
  try {
    const { matchingNightsId, girlId, boyId } = req.body;

    if (!matchingNightsId || girlId || boyId)
      throw new Error(
        "Matching Nights ID, Girl ID und Boy ID müssen angegeben werden"
      );

    const created = await matchingPicksDAO.createMatchingPick({
      matchingNightsId,
      girlId,
      boyId,
    });
  } catch (error) {
    next(error);
  }
}

async function updateMatchingPick(req, res, next) {
  try {
    const updated = await matchingPicksDAO.updateMatchingPick(
      req.params.id,
      req.body
    );
    if (!updated) throw new Error("Matching Pick existiert nicht");
    res.status(201).json(updated);
  } catch (error) {
    next(error);
  }
}

async function deleteMatchingPick(req, res, next) {
  try {
    const deleted = await matchingPicksDAO.deleteMatchingPick(req.params.id);
    if (!deleted) throw new Error("Matching Pick existiert nicht");
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMatchingPicks,
  getMatchingPickById,
  createMatchingPick,
  updateMatchingPick,
  deleteMatchingPick,
};
