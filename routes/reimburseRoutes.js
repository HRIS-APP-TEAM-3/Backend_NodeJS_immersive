const express = require("express");
const router = express.Router();
const reimburseController = require("../controllers/reimburseController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");
const fs = require("fs");
const allUser = [1, 2, 3, 4];
// 1, Superadmin
// 2, Admin
// 3, Manager
// 4, Employee

// Define the destination folder path
const destinationFolder = "./uploads";

// Create the destination folder if it doesn't exist
if (!fs.existsSync(destinationFolder)) {
  fs.mkdirSync(destinationFolder);
}

// Set up storage engine using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationFolder); // Define the directory where files will be stored
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName); // Set the file name
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });

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
router.post(
  "/",
  roleMiddleware(allUser),
  upload.single("file_name"),
  reimburseController.addReimburse
);
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
