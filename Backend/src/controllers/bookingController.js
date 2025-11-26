import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

export const createBooking = async (req, res) => {
  const { event: eventId, seats } = req.body;
  if (!seats || seats < 1 || seats > 2) return res.status(400).json({ message: 'Seats must be 1 or 2' });

  const event = await Event.findById(eventId);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const bookedCount = await Booking.countDocuments({ event: eventId, status: 'Confirmed' });
  if (bookedCount + seats > event.capacity) {
    return res.status(400).json({ message: 'Not enough seats available' });
  }

  const existingBooking = await Booking.findOne({ user: req.user._id, event: eventId, status: 'Confirmed' });
  if (existingBooking) return res.status(400).json({ message: 'You already booked this event' });

  const booking = await Booking.create({
    user: req.user._id,
    event: eventId,
    seats
  });

  res.status(201).json({ success: true, booking });
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('event', 'title date location eventId')
    .sort({ bookedAt: -1 });
  res.json(bookings);
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking || booking.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (booking.status === 'Cancelled') return res.status(400).json({ message: 'Already cancelled' });

  const event = await Event.findById(booking.event);
  const eventDate = new Date(event.date);
  if (eventDate < new Date()) return res.status(400).json({ message: 'Cannot cancel past event' });

  booking.status = 'Cancelled';
  await booking.save();
  res.json({ message: 'Booking cancelled successfully' });
};
