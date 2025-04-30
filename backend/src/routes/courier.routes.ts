import express from "express";
import { loginCourier } from "../controllers/courier.controller";

const router = express.Router();

// POST /api/couriers/login
router.post("/login", loginCourier);

export default router;
