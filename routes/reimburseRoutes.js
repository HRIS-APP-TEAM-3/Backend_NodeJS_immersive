const express = require("express");
const router = express.Router();
const reimburseController = require("../controllers/reimburseController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");

router.use(getUserIdMiddleware("verysectretkey007"));

router.get("/", reimburseController.getAllReimburse);
router.post("/", reimburseController.addReimburse);
router.get("/:reimburseIndex", reimburseController.getReimburseById);
router.put("/:reimburseIndex", reimburseController.updateReimburse);
router.delete("/:reimburseIndex", reimburseController.deleteReimburse);

module.exports = router;
