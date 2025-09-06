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
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { deleteSetting } from "@/lib/setting"; // Import delete action
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner"; // Assuming you have sonner or similar for toasts

// Import the Setting type
import type { Setting } from "@/lib/setting";

interface SettingTableProps {
  settings: Setting[];
}

export function SettingTable({ settings }: SettingTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteSetting(id);
      if (success) {
        toast.success("Setting deleted successfully.");
        // The page will revalidate due to revalidatePath in the action
      } else {
        toast.error("Failed to delete setting.");
      }
    } catch (err) {
      console.error("Unexpected error deleting setting:", err);
      if (err instanceof Error) {
         toast.error(err.message || "An unexpected error occurred.");
      } else {
         toast.error("An unexpected error occurred.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Helper function to format date (adjust format as needed)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(); // Or use a library like date-fns for more control
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell className="font-medium">{setting.id}</TableCell>
              <TableCell className="font-mono text-sm">{setting.settingKey}</TableCell>
              <TableCell className="max-w-xs truncate">{setting.settingValue || <span className="text-muted-foreground italic">null</span>}</TableCell>
              <TableCell className="max-w-xs truncate">{setting.description || <span className="text-muted-foreground italic">No description</span>}</TableCell>
              <TableCell>{formatDate(setting.updatedAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/settings/${setting.id}/edit`}>
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
                        This action cannot be undone. This will permanently delete the setting &quot;{setting.settingKey}&quot;.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(setting.id)}
                        disabled={deletingId === setting.id}
                      >
                        {deletingId === setting.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {settings.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No settings found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
