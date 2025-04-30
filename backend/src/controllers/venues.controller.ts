import { Request, Response } from "express";
import { Venue } from "../models/venues.model";
import { Product } from "../models/products.model";
import { Cart } from "../models/cart.model"; // Ensure this model exists

// Fetch all venues
export const getAllVenues = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const venues = await Venue.find(filter);
    res.status(200).json(venues);
  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).json({ error: "Failed to fetch venues." });
  }
};

// Add a new venue
export const createVenue = async (req: Request, res: Response) => {
  try {
    const newVenue = new Venue(req.body);
    await newVenue.save();
    res.status(201).json(newVenue);
  } catch (err) {
    res.status(400).json({ error: "Failed to create venue." });
  }
};

// Fetch a venue by ID
export const getVenueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const venue = await Venue.findById(id);

    if (!venue) {
      return res.status(404).json({ error: "Venue not found." });
    }

    res.status(200).json(venue);
  } catch (err) {
    console.error(`Error fetching venue with ID ${req.params.id}:`, err);
    res.status(500).json({ error: "Failed to fetch venue." });
  }
};

// Update venue's payment method
export const updateVenuePaymentMethod = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { paymentMethod } = req.body;

    // Ensure paymentMethod is an array
    if (!Array.isArray(paymentMethod)) {
      return res.status(400).json({ error: "Invalid payment method format" });
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
      id,
      { paymentMethod },
      { new: true }
    );

    if (!updatedVenue) {
      return res.status(404).json({ error: "Venue not found." });
    }

    res.status(200).json(updatedVenue);
  } catch (err) {
    console.error("Error updating payment method:", err);
    res.status(500).json({ error: "Failed to update payment method." });
  }
};

// Toggle like for a venue
export const toggleVenueLike = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body; // Get user ID
    const { venueId } = req.params; // Get venue ID

    const venue = await Venue.findById(venueId);
    if (!venue) {
      return res.status(404).json({ error: "Venue not found." });
    }

    // Check if user already liked the venue
    const isLiked = venue.likedBy.includes(userId);

    if (isLiked) {
      // If liked, remove user from likedBy
      venue.likedBy = venue.likedBy.filter((id) => id !== userId);
    } else {
      // If not liked, add user to likedBy
      venue.likedBy.push(userId);
    }

    await venue.save();

    res.status(200).json({ likedBy: venue.likedBy });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ error: "Failed to toggle like." });
  }
};

// Fetch venue based on products in the user's cart
export const fetchVenuesByAddedProducts = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    // Step 1: Get the cart of the user
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({ error: "No products in cart" });
    }

    // Step 2: Extract product IDs
    const productIds = cart.products.map((p) => p.productId);

    // Step 3: Find venue IDs from products
    const products = await Product.find({ _id: { $in: productIds } });
    const venueIds = [...new Set(products.map((p) => p.venueId))]; // Remove duplicates

    if (venueIds.length === 0) {
      return res
        .status(404)
        .json({ error: "No venues found for these products" });
    }

    // Step 4: Fetch venues from the venue collection
    const venues = await Venue.find({ _id: { $in: venueIds } });

    return res.status(200).json(venues);
  } catch (err) {
    console.error("Error fetching venues by added products:", err);
    res.status(500).json({ error: "Failed to fetch venues." });
  }
};

export const updateVenueById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedVenue = await Venue.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedVenue) {
      return res.status(404).json({ error: "Mekan bulunamadı." });
    }

    res.status(200).json(updatedVenue);
  } catch (err) {
    console.error(`Mekan güncellenemedi: ${req.params.id}`, err);
    res.status(500).json({ error: "Mekan güncellenemedi." });
  }
};

export const updateVenueImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya yüklenmedi." });
    }
    const { venueId } = req.params;
    // Update the logo field with the uploaded file's filename
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { logo: req.file.filename },
      { new: true }
    );

    if (!updatedVenue) {
      return res.status(404).json({ error: "Mekan bulunamadı." });
    }

    res.status(200).json(updatedVenue);
  } catch (err) {
    console.error(`Mekan resmi güncellenemedi: ${req.params.venueId}`, err);
    res.status(500).json({ error: "Mekan resmi güncellenemedi." });
  }
};

export const updateVenueBanner = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Dosya yüklenmedi." });
    }
    const { venueId } = req.params;
    // Update the banner field with the uploaded file's filename
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueId,
      { banner: req.file.filename },
      { new: true }
    );
    if (!updatedVenue) {
      return res.status(404).json({ error: "Mekan bulunamadı." });
    }
    res.status(200).json(updatedVenue);
  } catch (err) {
    console.error(`Mekan bannerı güncellenemedi: ${req.params.venueId}`, err);
    res.status(500).json({ error: "Mekan bannerı güncellenemedi." });
  }
};
