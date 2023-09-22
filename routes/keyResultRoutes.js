const express = require("express");
const router = express.Router();
const keyResultController = require("../controllers/keyResultController");
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
  roleMiddleware([1, 2]),
  keyResultController.getAllUserKey
);
router.get(
  "/achieved",
  roleMiddleware([1, 2, 3]),
  keyResultController.getAchievedKey
);
router.get(
  "/ongoing",
  roleMiddleware([1, 2, 3]),
  keyResultController.getPendingKey
);
router.get("/", roleMiddleware(allUser), keyResultController.getAllKey);
router.post("/", roleMiddleware(allUser), keyResultController.addKey);
router.get(
  "/:keyResultIndex",
  roleMiddleware(allUser),
  keyResultController.getKeyById
);
router.put(
  "/:keyResultIndex",
  roleMiddleware([3]),
  keyResultController.updateKey
);
router.delete(
  "/:keyResultIndex",
  roleMiddleware([2, 3]),
  keyResultController.deleteKey
);

router.get("/", keyResultController.getAllKey);

module.exports = router;
