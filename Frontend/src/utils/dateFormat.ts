import { format, parseISO, isBefore, isToday, isAfter } from 'date-fns';

export const formatEventDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd-MMM-yyyy');
};

export const formatEventDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd-MMM-yyyy hh:mm a');
};

export const getEventStatus = (eventDate: string | Date): 'Upcoming' | 'Ongoing' | 'Completed' => {
  const dateObj = typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;
  const now = new Date();
  
  if (isToday(dateObj)) {
    return 'Ongoing';
  } else if (isBefore(dateObj, now)) {
    return 'Completed';
  } else {
    return 'Upcoming';
  }
};

export const canCancelBooking = (eventDate: string | Date): boolean => {
  const dateObj = typeof eventDate === 'string' ? parseISO(eventDate) : eventDate;
  const now = new Date();
  return isAfter(dateObj, now);
};
