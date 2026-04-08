const {
  calculateProbabilities,
  get100PercentMatches,
} = require("../services/probabilityService");

async function getProbabilities(req, res, next) {
  try {
    const data = await calculateProbabilities();

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

async function getPerfectMatches(req, res, next) {
  try {
    const data = await get100PercentMatches();

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProbabilities, getPerfectMatches };
