import express from "express";
import {
  saveOrderAddress,
  getUserAddresses,
  updateSelectedAddress,
  updateOrderAddress,
  deleteOrderAddress,
} from "../controllers/orderadress.controller";

const router = express.Router();

router.post("/save", saveOrderAddress);
router.get("/user/:userId", getUserAddresses);
router.post("/updateSelected", updateSelectedAddress); // ✅ New route
router.put("/update/:addressId", updateOrderAddress);
router.delete("/delete/:addressId", deleteOrderAddress);

export default router;
