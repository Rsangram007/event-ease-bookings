import axios from "axios";
import type {
  AuthResponse,
  Event,
  Booking,
  User,
  Attendee,
  ApiError,
} from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For FormData requests, let the browser set the Content-Type header
    if (config.data instanceof FormData) {
      console.log("FormData detected, removing Content-Type header");
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },
};

export const eventsAPI = {
  getAll: async (filters?: {
    category?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Event[]> => {
    const response = await api.get<Event[]>("/events", { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },
};

export const bookingsAPI = {
  create: async (data: { event: string; seats: number }): Promise<Booking> => {
    const response = await api.post<Booking>("/bookings", data);
    return response.data;
  },

  getMy: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>("/bookings/my");
    return response.data;
  },

  cancel: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};

export const adminAPI = {
  createEvent: async (data: FormData): Promise<Event> => {
    console.log("Sending create event request to /admin/events");
    const response = await api.post<Event>("/admin/events", data);
    return response.data;
  },

  updateEvent: async (id: string, data: FormData): Promise<Event> => {
    console.log(`Sending update event request to /admin/events/${id}`);
    const response = await api.put<Event>(`/admin/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/events/${id}`);
    return response.data;
  },

  getEventAttendees: async (eventId: string): Promise<Attendee[]> => {
    const response = await api.get<Attendee[]>(
      `/admin/events/${eventId}/attendees`
    );
    return response.data;
  },
};
