const express = require("express");
const router = express.Router();
const reimburseController = require("../controllers/reimburseController");
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
  reimburseController.getAllUserReimburse
);
router.get(
  "/approved",
  roleMiddleware([1, 2, 3]),
  reimburseController.getApprovedReimburse
);
router.get(
  "/pending",
  roleMiddleware([1, 2, 3]),
  reimburseController.getPendingReimburse
);
router.get("/", roleMiddleware(allUser), reimburseController.getAllReimburse);
router.post("/", roleMiddleware(allUser), reimburseController.addReimburse);
router.get(
  "/:reimburseIndex",
  roleMiddleware(allUser),
  reimburseController.getReimburseById
);
router.put(
  "/:reimburseIndex",
  roleMiddleware([2, 3]),
  reimburseController.updateReimburse
);
router.delete(
  "/:reimburseIndex",
  roleMiddleware([2, 3]),
  reimburseController.deleteReimburse
);

module.exports = router;
