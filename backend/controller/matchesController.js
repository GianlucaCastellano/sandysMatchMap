const matchesDAO = require("../dao/matchesDAO");

async function getAllMatches(req, res, next) {
  try {
    const matches = await matchesDAO.getAllMatches();
    res.json(matches);
  } catch (error) {
    next(error);
  }
}

async function getMatchById(req,res,next) {
    try{
        const match = await matchesDAO.getMatchById(req.params.id);
        if(!match) return

    }catch(error) {
        next(error);
    }
}
