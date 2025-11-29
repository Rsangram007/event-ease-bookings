import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import { generateEventId } from "../utils/generateEventId.js";
import uploadImage from "../utils/uploadImage.js";

export const createEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    locationType,
    category,
    capacity,
  } = req.body;

  // Handle image upload if present
  console.log("Received file:", req.file);
  if (req.file) {
    console.log("File details:", {
      path: req.file.path,
      secure_url: req.file.secure_url,
      url: req.file.url,
      filename: req.file.filename,
      originalname: req.file.originalname,
    });
  }

  // Use secure_url if available (Cloudinary), otherwise fallback to path
  const imageUrl = req.file ? req.file.secure_url || req.file.path : undefined;

  const eventData = {
    eventId: generateEventId(),
    title,
    description,
    date,
    location,
    locationType,
    category,
    capacity,
    ...(imageUrl && { imageUrl }),
  };

  console.log("Creating event with data:", eventData);
  const event = await Event.create(eventData);
  console.log("Created event:", event);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  // Handle image upload if present
  console.log("Received file for update:", req.file);
  if (req.file) {
    console.log("File details for update:", {
      path: req.file.path,
      secure_url: req.file.secure_url,
      url: req.file.url,
      filename: req.file.filename,
      originalname: req.file.originalname,
    });
    // Use secure_url if available (Cloudinary), otherwise fallback to path
    req.body.imageUrl = req.file.secure_url || req.file.path;
  }

  Object.assign(event, req.body);
  await event.save();
  console.log("Updated event:", event);
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  await event.deleteOne();
  res.json({ message: "Event deleted" });
};

export const getAttendees = async (req, res) => {
  const attendees = await Booking.find({
    event: req.params.eventId,
    status: "Confirmed",
  }).populate("user", "-password");
  res.json(attendees);
};
