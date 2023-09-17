const express = require("express");
const router = express.Router();

router.get("/", reimburseController.getAllReimburse);

module.exports = router;
