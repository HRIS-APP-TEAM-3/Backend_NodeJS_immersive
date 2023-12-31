const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const getUserIdMiddleware = require("../middlewares/getUserIdMiddleware.js");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
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
    // Define the subdirectory (e.g., 'leaves')
    const subdirectory = "leaves";
    const subdirectoryPath = path.join(destinationFolder, subdirectory);

    // Create the subdirectory if it doesn't exist
    if (!fs.existsSync(subdirectoryPath)) {
      fs.mkdirSync(subdirectoryPath);
    }

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
router.post(
  "/",
  roleMiddleware(allUser),
  upload.single("file_name"),
  leaveController.addLeave
);
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
