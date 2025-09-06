"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn, slugify } from '@/lib/utils';
import { updateEvent } from '@/lib/event'; // Import update action
import Link from 'next/link';
import { toast } from 'sonner'; // Assuming you have sonner or similar for toasts
import type { Event } from '@/lib/event';

// Define the type for the event prop (with Date object for eventDate)
type EditableEvent = Omit<Event, 'eventDate'> & {
  eventDate?: Date | null; // Make it optional and Date type for the form
};

export default function EditEventForm({ event }: { event: EditableEvent }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [eventDate, setEventDate] = useState<Date | undefined>(event.eventDate ?? undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string || null;
    const additionalInfo = formData.get('additional_info') as string || null;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string || null;
    const contactInfo = formData.get('contact_info') as string || null;
    const eventTime = formData.get('event_time') as string || null; // Get time as string
    // Handle eventDate date
    const eventDateStr = eventDate ? eventDate.toISOString().split('T')[0] : null; // Format as YYYY-MM-DD
    // Handle isPublished switch (value is "on" if checked)
    const isPublishedRaw = formData.get('is_published');
    const isPublished = isPublishedRaw === 'on'; // Use boolean as required by updateEvent

    // Basic validation
    if (!title.trim() || !location.trim() || !eventDateStr) {
      toast.error("Title, location, and event date are required.");
      return;
    }

    startTransition(async () => {
      try {
        const updatedData = {
          title,
          description,
          additionalInfo,
          location,
          category,
          contactInfo,
          eventTime, // Send time string
          eventDate: eventDateStr, // Send date string
          isPublished, // Use boolean value
          slug: slugify(title), // Update slug from title
        };

        const result = await updateEvent(event.id, updatedData);
        if (result) {
          toast.success("Event updated successfully.");
          router.push('/dashboard/events'); // Redirect on success
          router.refresh(); // Optional: refresh cache
        } else {
          toast.error("Failed to update event.");
        }
      } catch (err) {
        console.error("Unexpected error during event update:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={event.id} /> {/* Hidden ID field */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Event Title"
          required
          defaultValue={event.title}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Event description..."
          rows={4}
          defaultValue={event.description ?? ''}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="additional_info">Additional Info</Label>
        <Textarea
          id="additional_info"
          name="additional_info"
          placeholder="Additional information..."
          rows={2}
          defaultValue={event.additionalInfo ?? ''}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            placeholder="Event location"
            required
            defaultValue={event.location}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={event.category ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_time">Event Time</Label>
          <Input
            id="event_time"
            name="event_time"
            type="time"
            defaultValue={event.eventTime ?? ''}
          />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="event_date">Event Date *</Label>
          {/* Hidden input to send the date string */}
          <input type="hidden" name="event_date" value={eventDate ? eventDate.toISOString().split('T')[0] : ''} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !eventDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={eventDate}
                onSelect={setEventDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center space-x-2 pt-6">
          <Switch
            id="is_published"
            name="is_published"
            defaultChecked={
              typeof event.isPublished === 'number'
                ? event.isPublished === 1
                : event.isPublished === true
            }
          />
          <Label htmlFor="is_published">Publish</Label>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_info">Contact Information</Label>
        <Input
          id="contact_info"
          name="contact_info"
          placeholder="Contact info (email, phone)"
          defaultValue={event.contactInfo ?? ''}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/events">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update Event'}
        </Button>
      </div>
    </form>
  );
}
