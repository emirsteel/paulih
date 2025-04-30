// backend/routes/events.routes.ts
import { Router } from "express";
import multer from "multer";
import {
  createEvent,
  getAllEvents,
  getEventsByPage,
  getDataOfThePageById,
  toggleParticipation,
} from "../controllers/events.controller";

const router = Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /api/events (create event)
router.post("/", upload.single("photo"), createEvent);

// GET /api/events/page/:pageId (fetch events by page)
router.get("/page/:pageId", getEventsByPage);

// GET /api/events (fetch all events)
router.get("/", getAllEvents);

// NEW: GET /api/events/pageinfo/:pageId (get page data for event)
router.get("/pageinfo/:pageId", getDataOfThePageById);

router.put("/participate", toggleParticipation);

export default router;
