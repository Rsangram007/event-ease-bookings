import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMyBookings, cancelBooking } from "@/store/slices/bookingsSlice";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, MapPin, Users, X, Ticket } from "lucide-react";
import { formatEventDate, canCancelBooking } from "@/utils/dateFormat";
import type { Booking, Event } from "@/types";
import { toast } from "sonner";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.bookings);
  const { user } = useAppSelector((state) => state.auth);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<{
    bookingId: string;
    event: Event;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancelClick = (bookingId: string, event: Event) => {
    if (!canCancelBooking(event.date)) {
      toast.error("Cannot cancel booking for past events");
      return;
    }

    setSelectedBooking({ bookingId, event });
    setIsCancelOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedBooking) return;

    try {
      await dispatch(cancelBooking(selectedBooking.bookingId)).unwrap();
      toast.success("Booking cancelled successfully");
      setIsCancelOpen(false);
      setSelectedBooking(null);
    } catch (error: any) {
      toast.error(error || "Failed to cancel booking");
    }
  };

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>My Bookings</h1>
          <p className='text-muted-foreground'>Welcome back, {user?.name}!</p>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className='py-12 text-center'>
              <Calendar className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
              <p className='text-xl text-muted-foreground mb-4'>
                No bookings yet
              </p>
              <Button onClick={() => (window.location.href = "/events")}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className='grid grid-cols-1 gap-6'>
            {bookings.map((booking) => {
              const event =
                typeof booking.event === "object"
                  ? (booking.event as Event)
                  : null;

              // If event is missing, show a fallback UI
              if (!event) {
                return (
                  <Card key={booking._id} className='shadow-card'>
                    <CardContent className='py-8 text-center text-muted-foreground'>
                      Event details not available (possibly deleted)
                    </CardContent>
                  </Card>
                );
              }

              const availableSeats = event.capacity - event.bookedSeats;

              return (
                <Card
                  key={booking._id}
                  className='shadow-card hover:shadow-elegant transition-all duration-300 overflow-hidden border border-border rounded-xl'
                >
                  <div className='flex flex-col md:flex-row'>
                    {/* Event Image */}
                    <div className='md:w-1/3'>
                      {event.imageUrl ? (
                        <div className='h-48 md:h-full w-full'>
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      ) : (
                        <div className='h-48 md:h-full w-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center'>
                          <span className='text-muted-foreground text-lg'>
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className='md:w-2/3 p-6'>
                      <div className='flex flex-col h-full'>
                        <div className='flex-grow'>
                          <div className='flex flex-wrap items-start justify-between gap-3 mb-4'>
                            <CardTitle className='text-2xl'>
                              {event.title}
                            </CardTitle>
                            <div className='flex gap-2'>
                              <Badge
                                className={
                                  event.status === "Upcoming"
                                    ? "bg-primary"
                                    : event.status === "Ongoing"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                                }
                              >
                                {event.status}
                              </Badge>
                              <Badge
                                variant={
                                  booking.status === "Confirmed"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                          </div>

                          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                            <div className='flex items-start gap-3'>
                              <div className='mt-1 p-2 bg-primary/10 rounded-lg'>
                                <Calendar className='h-5 w-5 text-primary' />
                              </div>
                              <div>
                                <p className='font-semibold text-sm text-muted-foreground'>
                                  Date & Time
                                </p>
                                <p className='font-medium'>
                                  {formatEventDate(event.date)}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-start gap-3'>
                              <div className='mt-1 p-2 bg-primary/10 rounded-lg'>
                                <MapPin className='h-5 w-5 text-primary' />
                              </div>
                              <div>
                                <p className='font-semibold text-sm text-muted-foreground'>
                                  Location
                                </p>
                                <p className='font-medium'>{event.location}</p>
                              </div>
                            </div>

                            <div className='flex items-start gap-3'>
                              <div className='mt-1 p-2 bg-primary/10 rounded-lg'>
                                <Users className='h-5 w-5 text-primary' />
                              </div>
                              <div>
                                <p className='font-semibold text-sm text-muted-foreground'>
                                  Seats Booked
                                </p>
                                <p className='font-medium'>
                                  {booking.seats}{" "}
                                  {booking.seats === 1 ? "seat" : "seats"}
                                </p>
                              </div>
                            </div>

                            <div className='flex items-start gap-3'>
                              <div className='mt-1 p-2 bg-primary/10 rounded-lg'>
                                <Ticket className='h-5 w-5 text-primary' />
                              </div>
                              <div>
                                <p className='font-semibold text-sm text-muted-foreground'>
                                  Booking ID
                                </p>
                                <p className='font-medium font-mono text-sm'>
                                  {booking._id.substring(0, 8)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border'>
                          <p className='text-sm text-muted-foreground'>
                            Booked on: {formatEventDate(booking.bookedAt)}
                          </p>

                          {booking.status === "Confirmed" &&
                            canCancelBooking(event.date) && (
                              <Button
                                variant='outline'
                                className='border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground'
                                onClick={() =>
                                  handleCancelClick(booking._id, event)
                                }
                              >
                                <X className='h-4 w-4 mr-2' />
                                Cancel Booking
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Booking</DialogTitle>
              <DialogDescription id='cancel-booking-description'>
                Are you sure you want to cancel your booking for "
                {selectedBooking?.event.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsCancelOpen(false)}>
                No, keep booking
              </Button>
              <Button variant='destructive' onClick={handleCancelConfirm}>
                Yes, cancel booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
