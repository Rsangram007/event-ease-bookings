import Event from '../models/Event.js';
import Booking from '../models/Booking.js';
import { generateEventId } from '../utils/generateEventId.js';

export const createEvent = async (req, res) => {
  const { title, description, date, location, category, capacity } = req.body;
  const event = await Event.create({
    eventId: generateEventId(),
    title, description, date, location, category, capacity
  });
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  Object.assign(event, req.body);
  await event.save();
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  await event.deleteOne();
  res.json({ message: 'Event deleted' });
};

export const getAttendees = async (req, res) => {
  const attendees = await Booking.find({ event: req.params.eventId, status: 'Confirmed' })
    .populate('user', 'name email');
  res.json(attendees);
};
