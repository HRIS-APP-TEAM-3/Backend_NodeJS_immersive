const express = require("express");
const router = express.Router();

router.get("/", dashboardController.getAllData);

module.exports = router;
