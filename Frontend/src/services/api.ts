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
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
  createEvent: async (data: {
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    capacity: number;
  }): Promise<Event> => {
    const response = await api.post<Event>("/admin/events", data);
    return response.data;
  },

  updateEvent: async (id: string, data: Partial<Event>): Promise<Event> => {
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
