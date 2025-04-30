// backend/src/routes/reportpost.routes.ts
import express from "express";
import { createReportPost } from "../controllers/reportpost.controller";

const router = express.Router();

// Endpoint to create a new report post
router.post("/", createReportPost);

export default router;
