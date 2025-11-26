const express = require("express");
const router = express.Router();

const matchingPicksController = require("../controller/matchingPicksController");

router.get("/", matchingPicksController.getAllMatchingPicks);
router.get("/:id", matchingPicksController.getMatchingPickById);
router.post("/", matchingPicksController.createMatchingPick);
router.put("/:id", matchingPicksController.updateMatchingPick);
router.delete("/:id", matchingPicksController.deleteMatchingPick);

module.exports = router;
