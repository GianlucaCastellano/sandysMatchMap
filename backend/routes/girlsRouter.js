const express = require("express");
const router = express.Router();
const girlsController = require("../controller/girlsController");

router.get("/", girlsController.getAllGirls);
router.get("/:id", girlsController.getGirlById);
router.post("/", girlsController.createGirl);
router.put("/:id", girlsController.updateGirl);
router.delete("/:id", girlsController.deleteGirl);

module.exports = router;
