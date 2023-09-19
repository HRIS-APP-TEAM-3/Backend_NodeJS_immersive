const express = require("express");
const router = express.Router();
const reimburseController = require("../controllers/reimburseController");
const getUserIdMiddleware = require("../middleware/getUserIdMiddleware.js");

router.use(getUserIdMiddleware);

router.get("/", reimburseController.getAllReimburse);

module.exports = router;
