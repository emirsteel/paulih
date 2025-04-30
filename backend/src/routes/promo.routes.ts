import { Router } from "express";
import {
  createPromoCode,
  applyPromoCode,
} from "../controllers/promo.controller";

const router = Router();

// Route to create a promo code (admin functionality)
router.post("/create", createPromoCode);

// Route to apply a promo code
router.post("/apply", applyPromoCode);

export default router;
