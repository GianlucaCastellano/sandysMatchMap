const express = require("express");
const router = express.Router();
const boysController = require("../controller/boysController");

router.get("/", boysController.getAllBoys);
router.get("/:id", boysController.getBoyById);
router.post("/", boysController.createBoy);
router.put("/:id", boysController.updateBoy);
router.delete("/:id", boysController.deleteBoy);

module.exports = router;
