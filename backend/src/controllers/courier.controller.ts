import { Request, Response } from "express";
import Courier from "../models/courier.model";

export const loginCourier = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const courier = await Courier.findOne({ username });
    if (!courier) {
      return res.status(404).json({ message: "Courier not found" });
    }
    // For simplicity, we compare plaintext passwords.
    if (courier.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    return res.json({ message: "Login successful", courier });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
