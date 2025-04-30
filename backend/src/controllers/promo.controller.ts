import { Request, Response } from "express";
import PromoCode from "../models/promo.model";

export const createPromoCode = async (req: Request, res: Response) => {
  const { code, type, value, expiryDate } = req.body;

  try {
    const promoCode = new PromoCode({ code, type, value, expiryDate });
    await promoCode.save();
    res
      .status(201)
      .json({ message: "Promo code created successfully", promoCode });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create promo code", details: error });
  }
};

export const applyPromoCode = async (req: Request, res: Response) => {
  const { code, total } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode || !promoCode.isActive) {
      return res.status(400).json({ error: "Invalid or expired promo code" });
    }

    if (new Date(promoCode.expiryDate) < new Date()) {
      return res.status(400).json({ error: "Promo code has expired" });
    }

    let discount = 0;

    if (promoCode.type === "percentage") {
      discount = (total * promoCode.value) / 100;
    } else if (promoCode.type === "fixed") {
      discount = promoCode.value;
    }

    const finalTotal = Math.max(0, total - discount);

    res.status(200).json({ discount, finalTotal });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to apply promo code", details: error });
  }
};
