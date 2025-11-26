export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  date: string;
  location: string;
  locationType?: string; 
  category: string;
  capacity: number;
  bookedSeats: number;
  status: "Upcoming" | "Ongoing" | "Completed";
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  user: User | string;
  event: Event | string;
  seats: number;
  status: "Confirmed" | "Cancelled";
  bookedAt: string;
}

// Attendee type for when booking data is populated with full user details
export interface Attendee extends Booking {
  user: User; // When populated
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  error?: string;
}
