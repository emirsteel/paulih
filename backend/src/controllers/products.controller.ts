import { Request, Response } from "express";
import { Product } from "../models/products.model";

// Fetch products by venue ID
export const getProductsByVenue = async (req: Request, res: Response) => {
  try {
    const { venueId } = req.params;
    const products = await Product.find({ venueId });
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products." });
  }
};

// Update a product by ID
export const updateProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const updatedData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product." });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    // Optionally validate productData here
    const newProduct = await Product.create(productData);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product." });
  }
};
