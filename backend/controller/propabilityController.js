const { calculateProbabilities } = require("../services/probabilityService");

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

module.exports = { getProbabilities };
