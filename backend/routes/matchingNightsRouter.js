const express = require("express");
const router = express.Router();

const matchingNightsController = require("../controller/matchingNightsController");

router.get("/", matchingNightsController.getAllMatchingNights);
router.get("/:id", matchingNightsController.getMatchingNightById);
router.post("/", matchingNightsController.createMatchingNight);
router.put("/:id", matchingNightsController.updateMatchingNight);
router.delete("/:id", matchingNightsController.deleteMatchingNight);

module.exports = router;
