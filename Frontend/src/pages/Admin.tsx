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
import { Plus, Edit, Trash, Users, Loader2 } from "lucide-react";
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
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    locationType: "In-Person",
    category: "Tech",
    capacity: 100,
    imageUrl: "",
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
      imageUrl: "",
    });
  };

  const handleCreate = async (data: any, imageFile: File | null) => {
    setIsCreating(true);
    try {
      // Create FormData object
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(data).forEach((key) => {
        if (key !== "imageUrl" || data[key]) {
          // Skip empty imageUrl
          formData.append(key, data[key]);
        }
      });

      // Append image file if present
      if (imageFile) {
        console.log("Appending image file to FormData:", imageFile.name);
        formData.append("image", imageFile);
      } else {
        console.log("No image file to append");
      }

      await dispatch(createEvent(formData)).unwrap();
      toast.success("Event created successfully");
      setIsCreateOpen(false);
      resetForm();
    } catch (error: any) {
      // Extract error message properly to avoid React child object error
      const errorMessage =
        error?.message || error?.data?.message || "Failed to create event";
      toast.error(errorMessage);
    } finally {
      setIsCreating(false);
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
      imageUrl: event.imageUrl || "",
    });
    setIsEditOpen(true);
  };

  const handleUpdate = async (data: any, imageFile: File | null) => {
    if (!selectedEvent) return;
    setIsUpdating(true);

    try {
      // Create FormData object
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(data).forEach((key) => {
        if (key !== "imageUrl" || data[key]) {
          // Skip empty imageUrl
          formData.append(key, data[key]);
        }
      });

      // Append image file if present
      if (imageFile) {
        console.log(
          "Appending image file to FormData for update:",
          imageFile.name
        );
        formData.append("image", imageFile);
      } else {
        console.log("No image file to append for update");
      }

      await dispatch(
        updateEvent({ id: selectedEvent._id, data: formData })
      ).unwrap();
      toast.success("Event updated successfully");
      setIsEditOpen(false);
      setSelectedEvent(null);
      resetForm();
    } catch (error: any) {
      toast.error(error || "Failed to update event");
    } finally {
      setIsUpdating(false);
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
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription id='create-event-description'>
                  Fill in the event details below. Required fields are marked
                  with an asterisk (*).
                </DialogDescription>
              </DialogHeader>
              <EventForm
                onSubmit={handleCreate}
                buttonText='Create Event'
                isLoading={isCreating}
              />
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
          <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription id='edit-event-description'>
                Update the event details below.
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <EventForm
                initialData={{
                  title: selectedEvent.title,
                  description: selectedEvent.description,
                  date: selectedEvent.date.split("T")[0],
                  location: selectedEvent.location,
                  locationType: selectedEvent.locationType || "In-Person",
                  category: selectedEvent.category,
                  capacity: selectedEvent.capacity,
                  imageUrl: selectedEvent.imageUrl || "",
                }}
                onSubmit={handleUpdate}
                buttonText='Update Event'
                isLoading={isUpdating}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this event? This action cannot
                be undone.
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

        {/* Attendees Dialog */}
        <Dialog open={isAttendeesOpen} onOpenChange={setIsAttendeesOpen}>
          <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
              <DialogTitle>Event Attendees</DialogTitle>
              <DialogDescription>
                {selectedEvent?.title} - {attendees.length} confirmed attendees
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              {attendees.length > 0 ? (
                attendees.map((attendee) => (
                  <div
                    key={attendee.user._id}
                    className='flex items-center justify-between p-4 border rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>{attendee.user.name}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm text-muted-foreground'>
                        {new Date(attendee.bookedAt).toLocaleDateString()}
                      </p>
                      <p className='text-sm font-medium'>
                        {attendee.seats} seat(s)
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-center text-muted-foreground py-4'>
                  No attendees found for this event.
                </p>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setIsAttendeesOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
