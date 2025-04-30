// backend/src/routes/report.routes.ts
import express from "express";
import { createReport } from "../controllers/report.controler";

const router = express.Router();

router.post("/entity", createReport); // POST /api/reportposts/entity

export default router;
