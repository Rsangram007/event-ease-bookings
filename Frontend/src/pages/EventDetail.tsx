import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEventById } from "@/store/slices/eventsSlice";
import { createBooking } from "@/store/slices/bookingsSlice";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, Ticket } from "lucide-react";
import { formatEventDate, getEventStatus } from "@/utils/dateFormat";
import { toast } from "sonner";

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentEvent, loading } = useAppSelector((state) => state.events);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
  }, [dispatch, id]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to book tickets");
      navigate("/auth?mode=login");
      return;
    }

    if (!currentEvent) return;

    try {
      await dispatch(
        createBooking({ event: currentEvent._id, seats })
      ).unwrap();
      toast.success("Booking confirmed!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error || "Booking failed");
    }
  };

  if (loading || !currentEvent) {
    return (
      <div className='min-h-screen'>
        <Navbar />
        <div className='container mx-auto px-4 py-12 text-center'>
          <p className='text-muted-foreground'>Loading event details...</p>
        </div>
      </div>
    );
  }

  const status = getEventStatus(currentEvent.date);
  const availableSeats = currentEvent.capacity - currentEvent.bookedSeats;
  const canBook = status === "Upcoming" && availableSeats > 0;

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Event Image Header */}
          {currentEvent.imageUrl ? (
            <div className='w-full h-96 rounded-lg overflow-hidden mb-8'>
              <img
                src={currentEvent.imageUrl}
                alt={currentEvent.title}
                className='w-full h-full object-cover'
              />
            </div>
          ) : (
            <div className='w-full h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-8'>
              <span className='text-muted-foreground text-2xl'>
                No Image Available
              </span>
            </div>
          )}

          <div className='mb-8'>
            <div className='flex flex-wrap items-center gap-3 mb-4'>
              <Badge
                className={
                  status === "Upcoming"
                    ? "bg-primary"
                    : status === "Ongoing"
                    ? "bg-accent"
                    : "bg-muted"
                }
              >
                {status}
              </Badge>
              <Badge variant='outline'>{currentEvent.category}</Badge>
            </div>

            <h1 className='text-4xl font-bold mb-4'>{currentEvent.title}</h1>
            <p className='text-lg text-muted-foreground'>
              {currentEvent.description}
            </p>
          </div>

          <div className='grid lg:grid-cols-3 gap-8'>
            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='flex items-start gap-4 p-4 bg-muted/50 rounded-lg'>
                  <Calendar className='h-6 w-6 text-primary mt-1 flex-shrink-0' />
                  <div>
                    <p className='font-semibold text-lg'>Date & Time</p>
                    <p className='text-muted-foreground'>
                      {formatEventDate(currentEvent.date)}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 bg-muted/50 rounded-lg'>
                  <MapPin className='h-6 w-6 text-primary mt-1 flex-shrink-0' />
                  <div>
                    <p className='font-semibold text-lg'>Location</p>
                    <p className='text-muted-foreground'>
                      {currentEvent.location}
                    </p>
                    <Badge variant='secondary' className='mt-2'>
                      {currentEvent.locationType || "In-Person"}
                    </Badge>
                  </div>
                </div>

                <div className='flex items-start gap-4 p-4 bg-muted/50 rounded-lg'>
                  <Users className='h-6 w-6 text-primary mt-1 flex-shrink-0' />
                  <div>
                    <p className='font-semibold text-lg'>Availability</p>
                    <p className='text-muted-foreground'>
                      <span className='font-medium'>{availableSeats}</span> of{" "}
                      <span className='font-medium'>
                        {currentEvent.capacity}
                      </span>{" "}
                      seats available
                    </p>
                    <div className='mt-2 w-full bg-secondary rounded-full h-2'>
                      <div
                        className='bg-primary h-2 rounded-full'
                        style={{
                          width: `${
                            ((currentEvent.capacity - availableSeats) /
                              currentEvent.capacity) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book Your Spot</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {canBook ? (
                  <>
                    <div className='space-y-2'>
                      <label className='block text-sm font-medium'>
                        Number of Seats
                      </label>
                      <select
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className='w-full border border-input rounded-md px-3 py-2 bg-background'
                      >
                        {[...Array(Math.min(10, availableSeats)).keys()].map(
                          (i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1} {i + 1 === 1 ? "Seat" : "Seats"}
                            </option>
                          )
                        )}
                      </select>
                      <p className='text-sm text-muted-foreground'>
                        Maximum {availableSeats} seats available
                      </p>
                    </div>

                    <div className='bg-muted/50 p-4 rounded-lg'>
                      <div className='flex justify-between mb-2'>
                        <span>Total Seats:</span>
                        <span className='font-medium'>{seats}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Status:</span>
                        <Badge variant='outline'>{status}</Badge>
                      </div>
                    </div>

                    <Button
                      onClick={handleBooking}
                      className='w-full'
                      size='lg'
                    >
                      <Ticket className='h-5 w-5 mr-2' />
                      Book Now - {seats} {seats === 1 ? "Seat" : "Seats"}
                    </Button>
                  </>
                ) : (
                  <div className='text-center py-8'>
                    <div className='bg-muted/50 p-6 rounded-lg'>
                      <p className='text-muted-foreground text-lg'>
                        {status === "Completed"
                          ? "This event has ended"
                          : "No seats available for this event"}
                      </p>
                      <p className='text-sm text-muted-foreground mt-2'>
                        {status === "Completed"
                          ? "Thank you for your interest!"
                          : "Please check back later or look for other events"}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
