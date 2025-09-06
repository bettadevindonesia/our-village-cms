"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteEvent } from "@/lib/event"; // Import delete action
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have sonner or similar for toasts

// Import the Event type
import type { Event } from "@/lib/event";

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteEvent(id);
      if (success) {
        toast.success("Event deleted successfully.");
        // The page will revalidate due to revalidatePath in the action
      } else {
        toast.error("Failed to delete event.");
      }
    } catch (err) {
      console.error("Unexpected error deleting event:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to format date (adjust format as needed)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(); // Or use a library like date-fns for more control
  };

  // Helper function to format time
  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return 'N/A';
    return timeString; // You might want to format this differently
  };

  // Helper function to get badge variant based on published status
  const getPublishedVariant = (isPublished: number | boolean | null | undefined) => {
    const isPub = typeof isPublished === 'number' ? isPublished === 1 : isPublished === true;
    return isPub ? 'default' : 'secondary';
  };

  // Helper function to get badge variant based on category
  const getCategoryVariant = (category: string | null | undefined) => {
    switch (category?.toLowerCase()) {
      case 'community': return 'default';
      case 'cultural': return 'secondary';
      case 'sports': return 'outline';
      case 'meeting': return 'destructive'; // Or another variant
      default: return 'outline';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.id}</TableCell>
              <TableCell className="font-medium max-w-md truncate">{event.title}</TableCell>
              <TableCell>
                {event.category ? (
                  <Badge variant={getCategoryVariant(event.category)}>
                    {event.category}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>{formatDate(event.eventDate)}</TableCell>
              <TableCell>{formatTime(event.eventTime)}</TableCell>
              <TableCell className="max-w-xs truncate">{event.location}</TableCell>
              <TableCell>
                <Badge variant={getPublishedVariant(event.isPublished)}>
                  {typeof event.isPublished === 'number'
                    ? event.isPublished === 1 ? 'Yes' : 'No'
                    : event.isPublished ? 'Yes' : 'No'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the event &quot;{event.title}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                      >
                        {deletingId === event.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No events found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
