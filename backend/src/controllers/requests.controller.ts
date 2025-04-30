import { Request, Response } from "express";
import { RequestModel } from "../models/requests.model";
import multer from "multer";
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files stored in uploads/ folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

export const upload = multer({ storage });

export const createRequest = async (req: Request, res: Response) => {
  try {
    const { supplierName, email, phone, requestType, message } = req.body;
    const attachment = req.file ? req.file.path : null; // Get file path if uploaded

    const newRequest = new RequestModel({
      supplierName,
      email,
      phone,
      requestType,
      message,
      attachment,
    });

    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully!" });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
