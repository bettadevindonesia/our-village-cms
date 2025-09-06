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
import { deleteAnnouncement } from "@/lib/announcement"; // Import delete action
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have sonner or similar for toasts

// Import the Announcement type
import type { Announcement } from "@/lib/announcement";

interface AnnouncementTableProps {
  announcements: Announcement[];
}

export function AnnouncementTable({ announcements }: AnnouncementTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteAnnouncement(id);
      if (success) {
        toast.success("Announcement deleted successfully.");
        // The page will revalidate due to revalidatePath in the action
      } else {
        toast.error("Failed to delete announcement.");
      }
    } catch (err) {
      console.error("Unexpected error deleting announcement:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to format date (adjust format as needed)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(); // Or use a library like date-fns for more control
  };

  // Helper function to get badge variant based on priority
  const getPriorityVariant = (priority: string | null | undefined) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default"; // Or 'warning' if you have it
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Helper function to get badge variant based on category
  const getCategoryVariant = (category: string | null | undefined) => {
    switch (category?.toLowerCase()) {
      case "urgent":
        return "destructive";
      case "event":
        return "default";
      case "maintenance":
        return "secondary";
      case "official":
        return "default"; // Or a specific variant
      default:
        return "outline";
    }
  };

  // Helper function to get badge variant based on published status
  const getPublishedVariant = (
    isPublished: number | boolean | null | undefined
  ) => {
    const isPub =
      typeof isPublished === "number"
        ? isPublished === 1
        : isPublished === true;
    return isPub ? "default" : "secondary";
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {announcements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell className="font-medium">{announcement.id}</TableCell>
              <TableCell className="font-medium max-w-md truncate">
                {announcement.title}
              </TableCell>
              <TableCell>
                {announcement.category ? (
                  <Badge variant={getCategoryVariant(announcement.category)}>
                    {announcement.category}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>
                {announcement.priority ? (
                  <Badge variant={getPriorityVariant(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getPublishedVariant(announcement.isPublished)}>
                  {typeof announcement.isPublished === "number"
                    ? announcement.isPublished === 1
                      ? "Yes"
                      : "No"
                    : announcement.isPublished
                    ? "Yes"
                    : "No"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(announcement.publishedAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link
                    href={`/dashboard/announcements/${announcement.id}/edit`}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {/* The Button is now a child, not a prop */}
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the announcement &quot;{announcement.title}
                        &quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        onClick={() => handleDelete(announcement.id)}
                        disabled={deletingId === announcement.id}
                        variant="destructive"
                      >
                        {deletingId === announcement.id
                          ? "Deleting..."
                          : "Delete"}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {announcements.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground py-8"
              >
                No announcements found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
