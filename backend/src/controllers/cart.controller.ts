import { Request, Response } from "express";
import { Cart } from "../models/cart.model";
import { Product } from "../models/products.model";

// Add Product to Cart
export const addToCart = async (req: Request, res: Response) => {
  console.log("Request body:", req.body);

  const { userId, productId } = req.body;

  if (!userId || !productId) {
    console.error("Missing userId or productId");
    return res
      .status(400)
      .json({ error: "User ID and Product ID are required." });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] }); // Create a new cart if it doesn't exist
    }

    // Check if the product already exists in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex > -1) {
      // Product already exists; do not increment quantity
      console.log(`Product ${productId} already exists in cart.`);
    } else {
      // Add the new product to the cart
      cart.products.push({ productId, quantity: 1 });
    }

    await cart.save();

    // Populate the updated cart before returning
    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      select: "name price",
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Cart
// Get Cart
export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      select: "name price image venueId", // added "image"
      populate: {
        path: "venueId", // populate the venue document from venueId
        select: "name", // only get the name of the venue
      },
    });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to get cart" });
  }
};

// Remove Product from Cart
export const removeFromCart = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    // Re-fetch and populate the cart
    const updatedCart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      select: "name price",
    });

    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ error: "Failed to remove product from cart" });
  }
};

// Update Product Quantity
export const updateCartQuantity = async (req: Request, res: Response) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity = quantity;
        await cart.save();

        // Re-fetch and populate the cart
        const updatedCart = await Cart.findOne({ userId }).populate({
          path: "products.productId",
          select: "name price",
        });

        res.status(200).json(updatedCart);
      } else {
        res.status(404).json({ error: "Product not found in cart" });
      }
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
};

export const getOtherProductsFromVenue = async (
  req: Request,
  res: Response
) => {
  const { userId, venueId } = req.params;

  try {
    // 1) Find the user's cart
    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      select: "_id", // We just need the _id of products in the cart
    });

    // If no cart found, just return empty array or 404
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // 2) Get all products from the given venue
    const allVenueProducts = await Product.find({ venueId });

    // 3) Extract product IDs in the user's cart
    const productIdsInCart = cart.products.map((item) =>
      item.productId.toString()
    );

    // 4) Filter out products that are already in the cart
    const otherProducts = allVenueProducts.filter(
      (p) => !productIdsInCart.includes(p._id.toString())
    );

    // 5) Return the remaining "other" products
    return res.status(200).json(otherProducts);
  } catch (error) {
    console.error("Error fetching other products:", error);
    return res.status(500).json({ error: "Failed to get other products" });
  }
};
