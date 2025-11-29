import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Event } from "@/types";
import { formatEventDate, getEventStatus } from "@/utils/dateFormat";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const status = getEventStatus(event.date);
  const availableSeats = event.capacity - event.bookedSeats;

  const statusColors = {
    Upcoming: "bg-primary text-primary-foreground",
    Ongoing: "bg-accent text-accent-foreground",
    Completed: "bg-muted text-muted-foreground",
  };

  return (
    <Card className='shadow-card hover:shadow-elegant transition-all duration-300 animate-fade-in overflow-hidden'>
      {event.imageUrl ? (
        <div className='w-full h-48 overflow-hidden'>
          <img
            src={event.imageUrl}
            alt={event.title}
            className='w-full h-full object-cover'
          />
        </div>
      ) : (
        <div className='w-full h-48 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center'>
          <span className='text-muted-foreground'>No Image</span>
        </div>
      )}

      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between gap-2'>
          <CardTitle className='text-xl line-clamp-2'>{event.title}</CardTitle>
          <Badge className={statusColors[status]}>{status}</Badge>
        </div>
        <Badge variant='outline' className='w-fit'>
          {event.category}
        </Badge>
      </CardHeader>

      <CardContent className='space-y-3 pb-2'>
        <p className='text-sm text-muted-foreground line-clamp-2'>
          {event.description}
        </p>

        <div className='space-y-2'>
          <div className='flex items-center gap-2 text-sm'>
            <Calendar className='h-4 w-4 text-primary flex-shrink-0' />
            <span>{formatEventDate(event.date)}</span>
          </div>

          <div className='flex items-center gap-2 text-sm'>
            <MapPin className='h-4 w-4 text-primary flex-shrink-0' />
            <span className='truncate'>{event.location}</span>
            {event.locationType && (
              <Badge variant='secondary' className='text-xs'>
                {event.locationType}
              </Badge>
            )}
          </div>

          <div className='flex items-center gap-2 text-sm'>
            <Users className='h-4 w-4 text-primary flex-shrink-0' />
            <span>{availableSeats} seats available</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className='pt-2'>
        <Link to={`/events/${event._id}`} className='w-full'>
          <Button
            className='w-full'
            disabled={status === "Completed" || availableSeats === 0}
          >
            {status === "Completed"
              ? "Event Ended"
              : availableSeats === 0
              ? "Fully Booked"
              : "View Details"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
