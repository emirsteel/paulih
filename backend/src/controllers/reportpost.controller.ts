// backend/src/controllers/reportpost.controller.ts
import { Request, Response } from "express";
import ReportPost from "../models/reportpost.model";

export const createReportPost = async (req: Request, res: Response) => {
  try {
    const { postId, category, reason } = req.body;
    // Optionally, you could retrieve reportedBy from req.user if you have authentication middleware
    const reportedBy = req.body.reportedBy || null;

    if (!postId || !category || !reason) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const reportPost = new ReportPost({
      post: postId,
      category,
      reason,
      reportedBy,
    });

    const savedReport = await reportPost.save();

    res
      .status(201)
      .json({ message: "Report submitted successfully", report: savedReport });
  } catch (error) {
    console.error("Error creating report post:", error);
    res.status(500).json({ message: "Server error while submitting report." });
  }
};
