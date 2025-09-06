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
import { updateAnnouncement } from '@/lib/announcement'; // Import update action
import Link from 'next/link';
import { toast } from 'sonner'; // Assuming you have sonner or similar for toasts
import type { Announcement } from '@/lib/announcement';

// Define the type for the announcement prop (with Date object for publishedAt)
type EditableAnnouncement = Omit<Announcement, 'publishedAt'> & {
  publishedAt?: Date | null; // Make it optional and Date type for the form
};

export default function EditAnnouncementForm({ announcement }: { announcement: EditableAnnouncement }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(announcement.publishedAt ?? undefined);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const rawCategory = formData.get('category');
    const category = (rawCategory === null || rawCategory === "") ? null : rawCategory as "general" | "event" | "maintenance" | "official" | "urgent";
    const rawPriority = formData.get('priority');
    const priority = (rawPriority === null || rawPriority === "") ? null : rawPriority as "high" | "medium" | "low";
    const notes = formData.get('notes') as string || null;
    // Handle publishedAt date
    const publishedAtStr = publishedAt ? publishedAt.toISOString() : null;
    // Handle isPublished switch (value is "on" if checked)
    const isPublishedRaw = formData.get('is_published');
    const isPublished = isPublishedRaw === 'on'; // Use boolean for compatibility

    // Basic validation
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required.");
      return;
    }

    startTransition(async () => {
      try {
        const updatedData = {
          title,
          content,
          category,
          priority,
          notes,
          publishedAt: publishedAtStr,
          isPublished, // Now a boolean
          slug: slugify(title), // Update slug from title
        };

        const result = await updateAnnouncement(announcement.id, updatedData);
        if (result) {
          toast.success("Announcement updated successfully.");
          router.push('/dashboard/announcements'); // Redirect on success
          router.refresh(); // Optional: refresh cache
        } else {
          toast.error("Failed to update announcement.");
        }
      } catch (err) {
        console.error("Unexpected error during announcement update:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={announcement.id} /> {/* Hidden ID field */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="Announcement Title"
          required
          defaultValue={announcement.title}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content *</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Announcement content..."
          required
          rows={6}
          defaultValue={announcement.content}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={announcement.category ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="official">Official</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue={announcement.priority ?? undefined}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="published_at">Publish Date</Label>
          {/* Hidden input to send the date string */}
          <input type="hidden" name="published_at" value={publishedAt?.toISOString() || ''} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !publishedAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {publishedAt ? format(publishedAt, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={publishedAt}
                onSelect={setPublishedAt}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional notes..."
          rows={3}
          defaultValue={announcement.notes ?? ''}
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_published"
            name="is_published"
            defaultChecked={
              typeof announcement.isPublished === 'number'
                ? announcement.isPublished === 1
                : announcement.isPublished === true
            }
          />
          <Label htmlFor="is_published">Publish</Label>
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/announcements">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update Announcement'}
        </Button>
      </div>
    </form>
  );
}
