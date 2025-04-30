import { Request, Response } from "express";
import { Order } from "../models/order.model";
import { Cart } from "../models/cart.model";
import { Product } from "../models/products.model"; // Import Product model

export const createOrder = async (req: Request, res: Response) => {
  const {
    userId,
    userName,
    userEmail,
    userPhone,
    supplierUsername,
    supplierId,
    deliveryAddress,
    deliveryCity,
    deliveryInstructions,
    paymentMethod,
  } = req.body;

  try {
    if (!userId || !paymentMethod) {
      return res.status(400).json({ error: "Missing required order details." });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      model: Product,
      select: "name price", // Fetch only required fields
    });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    const totalAmount = cart.products.reduce(
      (acc, item) => acc + (item.productId as any).price * item.quantity,
      0
    );

    const taxAmount = totalAmount * 0.1;
    const deliveryFee = 2.0;
    const finalAmount = totalAmount + taxAmount + deliveryFee;

    const newOrder = new Order({
      userId,
      supplierUsername,
      supplierId,
      items: cart.products.map((item) => ({
        productId: item.productId._id,
        name: (item.productId as any).name, // Type assertion
        quantity: item.quantity,
        price: (item.productId as any).price, // Type assertion
        totalItemPrice: (item.productId as any).price * item.quantity,
      })),
      totalAmount: finalAmount,
      taxAmount,
      deliveryFee,
      estimatedDeliveryTime: "30-45 mins",
      deliveryAddress,
      deliveryCity,
      deliveryInstructions,
      paymentMethod,
      status: "Pending",
    });

    await newOrder.save();
    await Cart.deleteOne({ userId });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      orderId: newOrder._id,
    });
  } catch (error: any) {
    console.error("Order processing error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};
