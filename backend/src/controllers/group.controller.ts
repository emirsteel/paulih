import { Request, Response } from "express";
import Group from "../models/group.model";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

// Create a group
export const createGroup = async (req: AuthenticatedRequest, res: Response) => {
  console.log("Incoming Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const { name, members } = req.body;
  const loggedInUserId = req.user?._id;

  if (!name || !members || members.length === 0) {
    return res.status(400).json({ message: "Invalid group data." });
  }

  try {
    const parsedMembers = JSON.parse(members);
    console.log("Parsed Members:", parsedMembers);

    const group = new Group({
      name,
      members: [loggedInUserId, ...parsedMembers],
      image: req.file ? `/uploads/${req.file.filename}` : null, // Correctly assign image path
    });

    console.log("Group to Save:", group);

    await group.save();

    res.status(201).json(group);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Fetch groups for a user
export const getUserGroups = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const loggedInUserId = req.user?._id;

  try {
    const groups = await Group.find({ members: loggedInUserId }).populate(
      "members",
      "name username profileImage"
    );

    res.status(200).json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const leaveGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.members = group.members.filter(
      (memberId: any) => memberId.toString() !== userId
    );
    await group.save();

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Error leaving group" });
  }
};
