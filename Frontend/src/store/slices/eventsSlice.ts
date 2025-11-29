import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { eventsAPI, adminAPI } from "@/services/api";
import type { Event, User, Attendee } from "@/types";

interface EventsState {
  events: Event[];
  currentEvent: Event | null;
  attendees: Attendee[];
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  };
}

const initialState: EventsState = {
  events: [],
  currentEvent: null,
  attendees: [],
  loading: false,
  error: null,
  filters: {},
};

export const fetchEvents = createAsyncThunk(
  "events/fetchAll",
  async (filters: EventsState["filters"] | undefined, { rejectWithValue }) => {
    try {
      const events = await eventsAPI.getAll(filters);
      return events;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch events"
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  "events/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const event = await eventsAPI.getById(id);
      return event;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch event"
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  "events/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const event = await adminAPI.createEvent(data);
      return event;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  "events/update",
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const event = await adminAPI.updateEvent(id, data);
      return event;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update event"
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "events/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await adminAPI.deleteEvent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete event"
      );
    }
  }
);

export const fetchEventAttendees = createAsyncThunk(
  "events/fetchAttendees",
  async (eventId: string, { rejectWithValue }) => {
    try {
      const attendees = await adminAPI.getEventAttendees(eventId);
      return attendees;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch attendees"
      );
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<EventsState["filters"]>) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEvents.fulfilled,
        (state, action: PayloadAction<Event[]>) => {
          state.loading = false;
          state.events = action.payload;
        }
      )
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEventById.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loading = false;
          state.currentEvent = action.payload;
        }
      )
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.unshift(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.currentEvent?._id === action.payload._id) {
          state.currentEvent = action.payload;
        }
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.events = state.events.filter((e) => e._id !== action.payload);
        }
      )
      .addCase(
        fetchEventAttendees.fulfilled,
        (state, action: PayloadAction<Attendee[]>) => {
          state.attendees = action.payload;
        }
      );
  },
});

export const { setFilters, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;
