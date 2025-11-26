import Event from '../models/Event.js';
import Booking from '../models/Booking.js';

export const getEvents = async (req, res) => {
  const { category, location, startDate, endDate } = req.query;
  let query = {};

  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const events = await Event.find(query).select('-__v');
  res.json(events);
};

export const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    const bookedCount = await Booking.countDocuments({ event: event._id, status: 'Confirmed' });
    event.bookedSeats = bookedCount;
    await event.save();
    res.json(event);
  } else {
    res.status(404).json({ message: 'Event not found' });
  }
};
