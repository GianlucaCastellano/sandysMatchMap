const express = require("express");
const router = express.Router();

const girlsRouter = require("./girlsRouter");
const boysRouter = require("./boysRouter");
const matchesRouter = require("./matchesRouter");
const matchboxRouter = require("./matchboxRouter");
const matchingNightsRouter = require("./matching_nightsRouter");
const matchingPicksRouter = require("./matching_picksRouter");

router.use("/girls", girlsRouter);
router.use("/boys", boysRouter);
router.use("/matches", matchesRouter);
router.use("/matchbox", matchboxRouter);
router.use("/matching_nights", matchingNightsRouter);
router.use("/matching_picks", matchingPicksRouter);

module.exports = router;
