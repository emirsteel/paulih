// backend/controllers/block.controller.ts
import { Request, Response } from "express";
import Block from "../models/block.model";

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { blockerId, blockedId } = req.body;
    const existingBlock = await Block.findOne({ blockerId, blockedId });

    if (existingBlock) {
      return res.status(400).json({ message: "User already blocked." });
    }

    const block = new Block({ blockerId, blockedId });
    await block.save();

    res.status(200).json({ message: "User blocked successfully." });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to block user.", error: err.message });
  }
};

export const unblockUser = async (req: Request, res: Response) => {
  try {
    const { blockerId, blockedId } = req.body;
    const result = await Block.findOneAndDelete({ blockerId, blockedId });

    if (!result) {
      return res.status(404).json({ message: "Block not found." });
    }

    res.status(200).json({ message: "User unblocked successfully." });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to unblock user.", error: err.message });
  }
};

export const getBlockedUsers = async (req: Request, res: Response) => {
  try {
    const { blockerId } = req.params;
    const blocks = await Block.find({ blockerId }).populate(
      "blockedId",
      "name username profileImage"
    ); // ✅ populate yapıyoruz

    res.status(200).json(blocks);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch blocked users.", error: err.message });
  }
};
