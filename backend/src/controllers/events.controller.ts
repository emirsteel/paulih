// backend/controllers/events.controller.ts
import { Request, Response } from "express";
import pagesModel from "../models/pages.model";
import EventModel from "../models/events.model";

export const createEvent = async (req: Request, res: Response) => {
  try {
    // Handle file upload for photo (if provided)
    let photoFilename: string | undefined;
    if (req.file) {
      photoFilename = req.file.filename;
    }

    // Extract fields from req.body including pageId
    const {
      title,
      category,
      description,
      date,
      startTime,
      endTime,
      locationType,
      locationLink,
      pageId, // Must be provided
    } = req.body;

    if (!pageId) {
      return res
        .status(400)
        .json({ message: "Page ID is required to create an event." });
    }

    const newEvent = new EventModel({
      title,
      category,
      description,
      photo: photoFilename,
      date,
      startTime,
      endTime,
      locationType,
      locationLink,
      page: pageId,
    });

    await newEvent.save();

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all events (existing function)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.find().sort({ createdAt: -1 });
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// New: Get events by page ID
export const getEventsByPage = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    if (!pageId) {
      return res.status(400).json({ message: "Page ID is required." });
    }

    const events = await EventModel.find({ page: pageId })
      .populate("page", "name username profileImage") // or more fields as needed
      .sort({ createdAt: -1 });

    return res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events by page:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getDataOfThePageById = async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    if (!pageId) {
      return res.status(400).json({ message: "Page ID is required." });
    }
    // Find the page by ID and select only the necessary fields
    const pageData = await pagesModel
      .findById(pageId)
      .select("name username profileImage");
    if (!pageData) {
      return res.status(404).json({ message: "Page not found." });
    }
    return res.status(200).json(pageData);
  } catch (error) {
    console.error("Error fetching page data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleParticipation = async (req: Request, res: Response) => {
  try {
    const { eventId, userId } = req.body;
    const event = await EventModel.findById(eventId).populate(
      "participants",
      "name username profileImage"
    );
    if (!event) return res.status(404).json({ message: "Event not found." });

    // Check if the user is already participating:
    // If participant is populated, use p._id.toString(), otherwise use p.toString()
    const index = event.participants.findIndex((p: any) => {
      return (p._id ? p._id.toString() : p.toString()) === userId;
    });

    if (index === -1) {
      // Not participating – add the user
      event.participants.push(userId);
    } else {
      // Already participating – remove the user
      event.participants.splice(index, 1);
    }

    await event.save();
    // Re-populate the participants field (Mongoose 6+ supports await populate)
    await event.populate("participants", "name username profileImage");

    return res.status(200).json({
      message: "Participation updated.",
      participants: event.participants,
    });
  } catch (error) {
    console.error("Error toggling participation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
