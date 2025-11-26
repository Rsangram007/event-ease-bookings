import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { bookingLogger } from '../middlewares/bookingLogger.js';

const router = express.Router();
router.use(protect, bookingLogger);
router.post('/', createBooking);
router.get('/my', getMyBookings);
router.delete('/:id', cancelBooking);

export default router;
