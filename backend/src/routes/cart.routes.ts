import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
  // <-- Import the new function
  getOtherProductsFromVenue,
} from "../controllers/cart.controller";

const router = Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.delete("/:userId/:productId", removeFromCart);
router.put("/:userId/:productId", updateCartQuantity);

// NEW: get other products in the same venue that are not in the user's cart
router.get("/:userId/venue/:venueId/others", getOtherProductsFromVenue);

export default router;
