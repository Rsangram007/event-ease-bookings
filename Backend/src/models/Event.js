import mongoose from "mongoose";
import { generateEventId } from "../utils/generateEventId.js";

const eventSchema = new mongoose.Schema(
  {
    eventId: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    locationType: {
      type: String,
      enum: ["Online", "In-Person"],
      default: "In-Person",
    },
    category: { type: String, required: true },
    capacity: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed"],
      default: "Upcoming",
    },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

eventSchema.pre("save", function () {
  if (!this.eventId) {
    this.eventId = generateEventId();
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(this.date);
  eventDate.setHours(0, 0, 0, 0);

  if (eventDate > today) this.status = "Upcoming";
  else if (eventDate.getTime() === today.getTime()) this.status = "Ongoing";
  else this.status = "Completed";
});

export default mongoose.model("Event", eventSchema);
