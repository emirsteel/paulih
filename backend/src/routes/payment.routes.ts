import express from "express";
import {
  processPayment,
  getPurchasedProducts,
  updateOrderStatus,
  getVenueEarnings,
  getUserOrders,
  getAllPayments, // <-- import here
} from "../controllers/payment.controller";

const router = express.Router();

// POST /api/payments
router.post("/", processPayment);

// GET all payments with full information
router.get("/", getAllPayments);

router.get("/purchases/:venueId", getPurchasedProducts);
router.put("/update-order-status", updateOrderStatus);
router.get("/earnings/:venueId", getVenueEarnings);
router.get("/user-orders/:userId", getUserOrders);

export default router;
