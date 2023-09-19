const express = require("express");
const router = express.Router();
const reimburseController = require("../controllers/reimburseController");
const getUserIdMiddleware = require("../middleware/getUserIdMiddleware.js");

router.use(getUserIdMiddleware("verysectretkey007"));

router.get("/", reimburseController.getAllReimburse);
router.post("/", reimburseController.addReimburse);

module.exports = router;
