const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");

router.use(getUserIdMiddleware);

router.get("/", leaveController.getAllLeave);

module.exports = router;
