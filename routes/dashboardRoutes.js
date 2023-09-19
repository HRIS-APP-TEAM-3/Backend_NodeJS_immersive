const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");

router.use(getUserIdMiddleware);
router.get("/", dashboardController.verifyUser, (req, res) => {
    return res.json({Status: "Success", role: req.role, userId: req.userId, divisionId: req.divisionId})
});


module.exports = router;
