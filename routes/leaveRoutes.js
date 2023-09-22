const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");
const roleMiddleware = require("../middlewares/roleMiddleware");
const allUser = [1, 2, 3, 4];
// 1, Superadmin
// 2, Admin
// 3, Manager
// 4, Employee

router.use(getUserIdMiddleware("verysectretkey007"));

router.get(
  "/alluser",
  roleMiddleware([1, 2, 3]),
  leaveController.getAllUserLeave
);
router.get(
  "/approved",
  roleMiddleware([1, 2, 3]),
  leaveController.getApprovedLeave
);
router.get(
  "/pending",
  roleMiddleware([1, 2, 3]),
  leaveController.getPendingLeave
);
router.get("/", roleMiddleware(allUser), leaveController.getAllLeave);
router.post("/", roleMiddleware(allUser), leaveController.addLeave);
router.get(
  "/:leaveIndex",
  roleMiddleware(allUser),
  leaveController.getLeaveById
);
router.put("/:leaveIndex", roleMiddleware([2, 3]), leaveController.updateLeave);
router.delete(
  "/:leaveIndex",
  roleMiddleware([2, 3]),
  leaveController.deleteLeave
);

router.get("/", leaveController.getAllLeave);

module.exports = router;
