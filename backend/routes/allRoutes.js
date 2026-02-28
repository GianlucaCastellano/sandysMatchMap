const express = require("express");
const router = express.Router();

const girlsRouter = require("./girlsRouter");
const boysRouter = require("./boysRouter");
const matchesRouter = require("./matchesRouter");
const matchboxRouter = require("./matchboxRouter");
const matchingNightsRouter = require("./matchingNightsRouter");
const matchingPicksRouter = require("./matchingPicksRouter");
const matchingRouter = require("./matchingRouter");

router.use("/girls", girlsRouter);
router.use("/boys", boysRouter);
router.use("/matches", matchesRouter);
router.use("/matchbox", matchboxRouter);
router.use("/matching_nights", matchingNightsRouter);
router.use("/matching_picks", matchingPicksRouter);
router.use("/probabilities", matchingRouter);

module.exports = router;
