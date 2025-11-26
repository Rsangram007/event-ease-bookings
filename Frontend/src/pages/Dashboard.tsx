import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyBookings, cancelBooking } from '@/store/slices/bookingsSlice';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, X } from 'lucide-react';
import { formatEventDate, canCancelBooking } from '@/utils/dateFormat';
import type { Booking, Event } from '@/types';
import { toast } from 'sonner';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading } = useAppSelector((state) => state.bookings);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = async (bookingId: string, event: Event) => {
    if (!canCancelBooking(event.date)) {
      toast.error('Cannot cancel booking for past events');
      return;
    }

    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await dispatch(cancelBooking(bookingId)).unwrap();
        toast.success('Booking cancelled successfully');
      } catch (error: any) {
        toast.error(error || 'Failed to cancel booking');
      }
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-xl text-muted-foreground mb-4">No bookings yet</p>
              <Button onClick={() => window.location.href = '/events'}>
                Browse Events
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const event = booking.event as Event;
              return (
                <Card key={booking._id} className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{event.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={event.status === 'Upcoming' ? 'bg-primary' : 'bg-muted'}>
                            {event.status}
                          </Badge>
                          <Badge variant={booking.status === 'Confirmed' ? 'default' : 'destructive'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                      {booking.status === 'Confirmed' && canCancelBooking(event.date) && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancel(booking._id, event)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{formatEventDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span>{booking.seats} {booking.seats === 1 ? 'seat' : 'seats'} booked</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Booked on: {formatEventDate(booking.bookedAt)}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
