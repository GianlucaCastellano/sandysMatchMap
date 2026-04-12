const express = require("express");
const router = express.Router();
const boysController = require("../controller/boysController");
const upload = require("../middleware/multer");

router.get("/", boysController.getAllBoys);
router.get("/:id", boysController.getBoyById);
router.post("/", upload.single("image"), boysController.createBoy);
router.put("/:id", boysController.updateBoy);
router.delete("/:id", boysController.deleteBoy);

module.exports = router;
