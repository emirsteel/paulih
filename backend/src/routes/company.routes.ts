import express from "express";
import { createCompany } from "../controllers/company.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

// Use the authMiddleware to authenticate the user before allowing access to this route
router.post("/create", authMiddleware, createCompany);

export default router;
