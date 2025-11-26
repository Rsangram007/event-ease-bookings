import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookingsAPI } from '@/services/api';
import type { Booking } from '@/types';

interface BookingsState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  'bookings/fetchMy',
  async (_, { rejectWithValue }) => {
    try {
      const bookings = await bookingsAPI.getMy();
      return bookings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/create',
  async (data: { event: string; seats: number }, { rejectWithValue }) => {
    try {
      const booking = await bookingsAPI.create(data);
      return booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      await bookingsAPI.cancel(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookings.unshift(action.payload);
      })
      .addCase(cancelBooking.fulfilled, (state, action: PayloadAction<string>) => {
        const booking = state.bookings.find(b => b._id === action.payload);
        if (booking) {
          booking.status = 'Cancelled';
        }
      });
  },
});

export const { clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
