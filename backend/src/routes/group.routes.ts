import express from "express";
import multer from "multer";
import {
  createGroup,
  getUserGroups,
  leaveGroup,
} from "../controllers/group.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    console.log("File Upload:", file);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept image files
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname)); // Properly create a Multer error
    }
  },
});

router.post("/create", authMiddleware, upload.single("image"), createGroup);

// Get user groups
router.get("/my-groups", authMiddleware, getUserGroups);

router.put("/leave/:groupId/:userId", leaveGroup);

export default router;
