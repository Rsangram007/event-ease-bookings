import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seats: { type: Number, required: true, min: 1, max: 2 },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  bookedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
