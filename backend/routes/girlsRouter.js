const express = require("express");
const router = express.Router();
const girlsController = require("../controller/girlsController");
const upload = require("../middleware/multer");

router.get("/", girlsController.getAllGirls);
router.get("/:id", girlsController.getGirlById);
router.post("/", upload.single("image"), girlsController.createGirl);
router.put("/:id", girlsController.updateGirl);
router.delete("/:id", girlsController.deleteGirl);
router.post("/upload");

module.exports = router;
