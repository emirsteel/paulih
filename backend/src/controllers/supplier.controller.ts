import { Request, Response } from "express";
import { Venue } from "../models/venues.model"; // Use Venue model since it now includes username/password
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "52152364Edi";

export const supplierLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find the venue using the username
    const venue = await Venue.findOne({ username });

    if (!venue) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, venue.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { venueId: venue._id, username: venue.username },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.json({ token, venueId: venue._id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
