import express from "express";
import {
  blockUser,
  unblockUser,
  getBlockedUsers,
} from "../controllers/block.controller";

const router = express.Router();

router.post("/block", blockUser);
router.post("/unblock", unblockUser);
router.get("/:blockerId", getBlockedUsers);

export default router;
