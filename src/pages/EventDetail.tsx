import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEventById } from '@/store/slices/eventsSlice';
import { createBooking } from '@/store/slices/bookingsSlice';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { formatEventDate, getEventStatus } from '@/utils/dateFormat';
import { toast } from 'sonner';

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
      toast.error('Please login to book tickets');
      navigate('/auth?mode=login');
      return;
    }

    if (!currentEvent) return;

    try {
      await dispatch(createBooking({ event: currentEvent._id, seats })).unwrap();
      toast.success('Booking confirmed!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error || 'Booking failed');
    }
  };

  if (loading || !currentEvent) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  const status = getEventStatus(currentEvent.date);
  const availableSeats = currentEvent.capacity - currentEvent.bookedSeats;
  const canBook = status === 'Upcoming' && availableSeats > 0;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={status === 'Upcoming' ? 'bg-primary' : status === 'Ongoing' ? 'bg-accent' : 'bg-muted'}>
                {status}
              </Badge>
              <Badge variant="outline">{currentEvent.category}</Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{currentEvent.title}</h1>
            <p className="text-lg text-muted-foreground">{currentEvent.description}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Date</p>
                    <p className="text-muted-foreground">{formatEventDate(currentEvent.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Location</p>
                    <p className="text-muted-foreground">{currentEvent.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Availability</p>
                    <p className="text-muted-foreground">
                      {availableSeats} of {currentEvent.capacity} seats available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Book Your Spot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {canBook ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Number of Seats</label>
                      <select
                        value={seats}
                        onChange={(e) => setSeats(Number(e.target.value))}
                        className="w-full border border-input rounded-md px-3 py-2 bg-background"
                      >
                        <option value={1}>1 Seat</option>
                        <option value={2}>2 Seats</option>
                      </select>
                    </div>
                    
                    <Button onClick={handleBooking} className="w-full" size="lg">
                      <Ticket className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      {status === 'Completed' ? 'This event has ended' : 'No seats available'}
                    </p>
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
