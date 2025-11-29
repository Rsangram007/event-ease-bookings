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
  const imageUrl = req.file ? req.file.path : undefined;

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

  const event = await Event.create(eventData);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  // Handle image upload if present
  if (req.file) {
    req.body.imageUrl = req.file.path;
  }

  Object.assign(event, req.body);
  await event.save();
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
