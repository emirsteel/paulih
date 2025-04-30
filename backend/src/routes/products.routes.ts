import { Router } from "express";
import {
  getProductsByVenue,
  updateProductById,
  createProduct,
} from "../controllers/products.controller";

const router = Router();

// Fetch products for a venue
router.get("/venue/:venueId", getProductsByVenue);

// Update a product
router.put("/:productId", updateProductById);

// Create a new product
router.post("/", createProduct);

export default router;
