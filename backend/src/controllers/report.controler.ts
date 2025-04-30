// backend/src/controllers/report.controller.ts
import { Request, Response } from "express";
import Report from "../models/report.model";

export const createReport = async (req: Request, res: Response) => {
  try {
    const { entityId, category, reason, details } = req.body;

    if (!entityId || !category || !reason) {
      return res.status(400).json({ message: "Eksik alanlar var." });
    }

    const newReport = await Report.create({
      entityId,
      category,
      reason,
      details,
    });

    res.status(201).json({
      message: "Rapor başarıyla oluşturuldu.",
      report: newReport,
    });
  } catch (error) {
    console.error("Rapor oluşturulurken hata:", error);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
