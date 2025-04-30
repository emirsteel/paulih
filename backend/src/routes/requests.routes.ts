import express from "express";
import { createRequest, upload } from "../controllers/requests.controller";

const router = express.Router();

router.post("/", upload.single("attachment"), createRequest); // Handles file uploads

export default router;
