const express = require("express");
const { getProbabilities } = require("../controller/propabilityController");
const router = express.Router();

router.get("/calculate", getProbabilities);

module.exports = router;
