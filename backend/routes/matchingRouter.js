const express = require("express");
const { getProbabilities, getPerfectMatches } = require("../controller/propabilityController");
const router = express.Router();

router.get("/calculate", getProbabilities);
router.get("/perfect", getPerfectMatches);
module.exports = router;
