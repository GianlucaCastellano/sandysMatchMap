const express = require("express");
const router = express.Router();

const matchBoxController = require("../controller/matchBoxController");

router.get("/", matchBoxController.getAllMatchBoxes);
router.get("/:id", matchBoxController.getMatchBoxById);
router.post("/", matchBoxController.createMatchBox);
router.put("/:id", matchBoxController.updateMatchBox);
router.delete("/:id", matchBoxController.deleteMatchBox);

module.exports = router;
