import { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents, setFilters } from "@/store/slices/eventsSlice";
import Navbar from "@/components/Navbar";
import EventCard from "@/components/EventCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const categories = [
  "All",
  "Music",
  "Tech",
  "Business",
  "Sports",
  "Art",
  "Education",
];
const locations = ["All", "Online", "In-Person"];

const Events = () => {
  const dispatch = useAppDispatch();
  const { events, loading, filters } = useAppSelector((state) => state.events);

  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchEvents(undefined));
  }, [dispatch]);

  const handleApplyFilters = () => {
    const newFilters: any = {};
    if (category !== "All") newFilters.category = category;
    if (location !== "All") newFilters.location = location;

    dispatch(setFilters(newFilters));
    dispatch(fetchEvents(newFilters));
  };

  // Memoize filtered events to prevent unnecessary re-renders
  const filteredEvents = useMemo(() => {
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        event.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
    );
  }, [events, debouncedSearchTerm]);

  // Handle search input change with proper focus retention
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Browse Events</h1>
          <p className='text-muted-foreground'>
            Discover amazing events happening around you
          </p>
        </div>

        {/* Filters */}
        <div className='bg-card rounded-lg p-6 shadow-card mb-8'>
          <div className='flex items-center gap-2 mb-4'>
            <Filter className='h-5 w-5 text-primary' />
            <h2 className='text-xl font-semibold'>Filters</h2>
          </div>

          <div className='grid md:grid-cols-4 gap-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search events...'
                value={searchTerm}
                onChange={handleSearchChange}
                className='pl-10'
              />
            </div>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <Select value={location} onValueChange={setLocation}>
              <SelectTrigger>
                <SelectValue placeholder='Location' />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Button onClick={handleApplyFilters}>Apply Filters</Button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No events found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
