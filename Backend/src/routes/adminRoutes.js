import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getAttendees,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { admin } from "../middlewares/adminMiddleware.js";
import uploadImage from "../utils/uploadImage.js";

const router = express.Router();
router.use(protect, admin);
router.post("/events", uploadImage.single("image"), createEvent);
router.put("/events/:id", uploadImage.single("image"), updateEvent);
router.delete("/events/:id", deleteEvent);
router.get("/events/:eventId/attendees", getAttendees);

export default router;
