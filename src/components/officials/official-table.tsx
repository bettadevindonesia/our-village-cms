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
import { deleteOfficial } from "@/lib/official"; // Import delete action
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have sonner or similar for toasts

// Import the Official type
import type { Official } from "@/lib/official";

interface OfficialTableProps {
  officials: Official[];
}

export function OfficialTable({ officials }: OfficialTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteOfficial(id);
      if (success) {
        toast.success("Official deleted successfully.");
        // The page will revalidate due to revalidatePath in the action
      } else {
        // Check if it was a FK constraint error handled in the action
        toast.error("Failed to delete official. They might be associated with other data.");
      }
    } catch (err) {
      console.error("Unexpected error deleting official:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to get badge variant based on active status
  const getActiveVariant = (isActive: number | boolean | null | undefined) => {
    const isActiveBool = typeof isActive === 'number' ? isActive === 1 : isActive === true;
    return isActiveBool ? 'default' : 'secondary';
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officials.map((official) => (
            <TableRow key={official.id}>
              <TableCell className="font-medium">{official.id}</TableCell>
              <TableCell className="font-medium">{official.name}</TableCell>
              <TableCell>{official.position}</TableCell>
              <TableCell className="max-w-xs truncate">{official.description || '-'}</TableCell>
              <TableCell>
                <Badge variant={getActiveVariant(official.isActive)}>
                  {typeof official.isActive === 'number'
                    ? official.isActive === 1 ? 'Yes' : 'No'
                    : official.isActive ? 'Yes' : 'No'}
                </Badge>
              </TableCell>
              <TableCell>
                 {official.createdAt ? new Date(official.createdAt).toLocaleDateString() : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/officials/${official.id}/edit`}>
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
                        This action cannot be undone. This will permanently delete the official &quot;{official.name}&quot;.
                        {/* Optionally, add a warning if they are referenced */}
                        {/* <br /><strong className="text-destructive">Warning: This official is associated with announcements/events/certificates.</strong> */}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(official.id)}
                        disabled={deletingId === official.id}
                      >
                        {deletingId === official.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {officials.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No officials found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
