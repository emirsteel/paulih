// venues.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  getAllVenues,
  createVenue,
  getVenueById,
  updateVenuePaymentMethod,
  toggleVenueLike,
  fetchVenuesByAddedProducts,
  updateVenueById,
  updateVenueBanner,
  updateVenueImage, // <-- new function
} from "../controllers/venues.controller";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    // Create a unique filename (you can adjust this as needed)
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Existing routes
router.get("/", getAllVenues);
router.post("/", createVenue);
router.get("/:id", getVenueById);
router.put("/:id/payment-method", updateVenuePaymentMethod);
router.put("/:venueId/like", toggleVenueLike);
router.get("/cart/:userId", fetchVenuesByAddedProducts);
router.put("/:id", updateVenueById);

// New route for image upload (update logo)
router.put("/:venueId/image", upload.single("file"), updateVenueImage);

// New route for banner image upload
router.put("/:venueId/banner", upload.single("file"), updateVenueBanner);

export default router;
