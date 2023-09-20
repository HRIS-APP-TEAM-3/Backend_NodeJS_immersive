const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");

router.use(getUserIdMiddleware("verysectretkey007"));

router.get("/", leaveController.getAllLeave);
router.post("/", leaveController.addLeave);
router.get("/:leaveIndex", leaveController.getLeaveById);
router.put("/:leaveIndex", leaveController.updateLeave);
router.delete("/:leaveIndex", leaveController.deleteLeave);

router.get("/", leaveController.getAllLeave);

module.exports = router;
