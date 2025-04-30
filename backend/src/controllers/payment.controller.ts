import { Request, Response } from "express";
import Payment from "../models/payment.model";
import { Cart } from "../models/cart.model";
import { Product } from "../models/products.model";
import { Venue } from "../models/venues.model";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15" as Stripe.LatestApiVersion,
});

if (!process.env.STRIPE_SECRET_KEY) {
  console.error(
    "Stripe secret key is missing. Please set it in your .env file."
  );
  throw new Error("Stripe secret key is missing.");
}

export const processPayment = async (req: Request, res: Response) => {
  // Now also expect deliveryAddress in the request body.
  const { userId, paymentMethod, paymentMethodId, deliveryAddress } = req.body;

  try {
    if (!userId || !paymentMethod) {
      return res
        .status(400)
        .json({ error: "Missing required payment details." });
    }

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: "Your cart is empty." });
    }

    // Calculate total amount
    const totalAmount = cart.products.reduce((acc: number, item: any) => {
      return acc + (item.productId?.price || 0) * item.quantity;
    }, 0);

    if (paymentMethod === "Credit/Debit Card") {
      if (!paymentMethodId) {
        return res.status(400).json({ error: "Invalid payment method ID." });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: "usd",
        payment_method: paymentMethodId,
        confirm: true,
      });

      if (paymentIntent.status === "succeeded") {
        const productsWithDetails = await Promise.all(
          cart.products.map(async (item: any) => {
            const product = await Product.findById(item.productId);
            if (!product) return null;
            return {
              productId: product._id,
              name: product.name,
              price: product.price,
              category: product.category,
              image: product.image,
              quantity: item.quantity,
              extraSideChoice: product.extraSideChoice,
              sauces: product.sauces,
            };
          })
        );

        const validProducts = productsWithDetails.filter((p) => p !== null);

        const firstProduct = await Product.findById(
          cart.products[0]?.productId
        );
        const venueId = firstProduct?.venueId;
        const venue = venueId ? await Venue.findById(venueId) : null;

        // Save Payment Details with Initial Status and include the deliveryAddress
        const payment = new Payment({
          userId,
          amount: totalAmount,
          paymentMethod,
          status: "Success",
          orderStatus: "Order Received", // Default initial status
          products: validProducts,
          venue: venue
            ? {
                venueId: venue._id,
                name: venue.name,
                category: venue.category,
                location: venue.location,
              }
            : null,
          deliveryAddress, // New field added
        });

        await payment.save();
        await Cart.deleteOne({ userId });

        return res.status(201).json({
          success: true,
          message: "Payment processed successfully.",
          orderId: payment._id,
        });
      } else {
        return res.status(500).json({ error: "Payment failed." });
      }
    }

    return res.status(400).json({ error: "Invalid payment method." });
  } catch (error: any) {
    console.error("Payment processing error:", error.message);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const getPurchasedProducts = async (req: Request, res: Response) => {
  const { venueId } = req.params;

  try {
    const payments = await Payment.find({ "venue.venueId": venueId });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No purchased products found." });
    }

    const purchasedProducts = payments.flatMap((payment) =>
      payment.products.map((product: any) => ({
        orderId: payment._id,
        productId: product.productId,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: product.quantity,
        purchasedAt: payment.createdAt,
        orderStatus: payment.orderStatus || "Order Received", // ✅ Correct orderStatus
      }))
    );

    return res.json(purchasedProducts);
  } catch (error) {
    console.error("Error fetching purchased products:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId, newStatus } = req.body;

  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.json({ success: true, orderStatus: updatedPayment.orderStatus });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getVenueEarnings = async (req: Request, res: Response) => {
  const { venueId } = req.params;

  try {
    // Calculate the date range for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Find payments within the last 7 days for the given venue
    const payments = await Payment.find({
      "venue.venueId": venueId,
      status: "Success", // Only successful payments
      createdAt: { $gte: sevenDaysAgo }, // Only payments from the last 7 days
    });

    // Sum the total earnings
    const totalEarnings = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    return res.json({ totalEarnings });
  } catch (error) {
    console.error("Error fetching venue earnings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const orders = await Payment.find({ userId })
      .sort({ createdAt: -1 }) // ✅ Sort from newest to oldest
      .populate("products.productId");

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    return res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.find()
      .populate("products.productId")
      .populate("userId")
      .populate("venue.venueId");
    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found." });
    }
    return res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
