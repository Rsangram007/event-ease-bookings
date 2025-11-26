import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventAttendees,
} from "@/store/slices/eventsSlice";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash, Users } from "lucide-react";
import { formatEventDate } from "@/utils/dateFormat";
import { toast } from "sonner";
import type { Event } from "@/types";
import EventForm from "@/components/EventForm";

const categories = ["Music", "Tech", "Business", "Sports", "Art", "Education"];

const Admin = () => {
  const dispatch = useAppDispatch();
  const { events, attendees, loading } = useAppSelector(
    (state) => state.events
  );

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAttendeesOpen, setIsAttendeesOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    locationType: "In-Person",
    category: "Tech",
    capacity: 100,
  });

  useEffect(() => {
    dispatch(fetchEvents(undefined));
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      location: "",
      locationType: "In-Person",
      category: "Tech",
      capacity: 100,
    });
  };

  const handleCreate = async (data: any) => {
    try {
      await dispatch(createEvent(data)).unwrap();
      toast.success("Event created successfully");
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      // Extract error message properly to avoid React child object error
      const errorMessage =
        error?.message || error?.data?.message || "Failed to create event";
      toast.error(errorMessage);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      locationType: event.locationType || "In-Person",
      category: event.category,
      capacity: event.capacity,
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: any) => {
    if (!selectedEvent) return;

    try {
      await dispatch(updateEvent({ id: selectedEvent._id, data })).unwrap();
      toast.success("Event updated successfully");
      setIsEditOpen(false);
      setSelectedEvent(null);
      resetForm();
    } catch (error: any) {
      toast.error(error || "Failed to update event");
    }
  };

  const handleDeleteClick = (event: Event) => {
    setSelectedEvent(event);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent) return;

    try {
      await dispatch(deleteEvent(selectedEvent._id)).unwrap();
      toast.success("Event deleted successfully");
      setIsDeleteOpen(false);
      setSelectedEvent(null);
    } catch (error: any) {
      toast.error(error || "Failed to delete event");
    }
  };

  const handleViewAttendees = async (event: Event) => {
    setSelectedEvent(event);
    await dispatch(fetchEventAttendees(event._id));
    setIsAttendeesOpen(true);
  };

  return (
    <div className='min-h-screen'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>Admin Panel</h1>
            <p className='text-muted-foreground'>
              Manage events and view attendees
            </p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size='lg'>
                <Plus className='h-4 w-4 mr-2' />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription id='create-event-description'>
                  Create a new event by filling in the form fields
                </DialogDescription>
              </DialogHeader>
              <EventForm onSubmit={handleCreate} buttonText='Create Event' />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading events...</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {events.map((event) => (
              <Card key={event._id} className='shadow-card'>
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <CardTitle className='text-2xl mb-2'>
                        {event.title}
                      </CardTitle>
                      <div className='flex gap-2'>
                        <Badge>{event.status}</Badge>
                        <Badge variant='outline'>{event.category}</Badge>
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleViewAttendees(event)}
                      >
                        <Users className='h-4 w-4 mr-2' />
                        Attendees
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => handleDeleteClick(event)}
                      >
                        <Trash className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <p className='text-sm text-muted-foreground'>
                    {event.description}
                  </p>
                  <p className='text-sm'>
                    <strong>Date:</strong> {formatEventDate(event.date)}
                  </p>
                  <p className='text-sm'>
                    <strong>Location:</strong> {event.location}
                  </p>
                  {event.locationType && (
                    <p className='text-sm'>
                      <strong>Location Type:</strong> {event.locationType}
                    </p>
                  )}
                  <p className='text-sm'>
                    <strong>Capacity:</strong> {event.bookedSeats}/
                    {event.capacity}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription id='edit-event-description'>
                Edit event details in the form
              </DialogDescription>
            </DialogHeader>
            <EventForm
              initialData={formData}
              onSubmit={handleUpdate}
              buttonText='Update Event'
            />
          </DialogContent>
        </Dialog>

        {/* Attendees Dialog */}
        <Dialog open={isAttendeesOpen} onOpenChange={setIsAttendeesOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Event Attendees - {selectedEvent?.title}
              </DialogTitle>
              <DialogDescription id='attendees-description'>
                List of attendees for the selected event
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-2 max-h-96 overflow-y-auto'>
              {attendees.length === 0 ? (
                <p className='text-muted-foreground text-center py-4'>
                  No attendees yet
                </p>
              ) : (
                attendees.map((attendee) => (
                  <div
                    key={attendee._id}
                    className='p-3 border border-border rounded-lg'
                  >
                    <p className='font-medium'>{attendee.user.name}</p>
                    <p className='text-sm text-muted-foreground'>
                      {attendee.user.email}
                    </p>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Event</DialogTitle>
              <DialogDescription id='delete-confirmation-description'>
                Are you sure you want to delete the event "
                {selectedEvent?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant='destructive' onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
