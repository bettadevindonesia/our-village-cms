"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { deleteEvent } from "@/lib/event";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import type { Event } from "@/lib/event";
import { useTranslation } from "react-i18next";

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { t } = useTranslation("event");

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteEvent(id);
      if (success) {
        toast.success(t("success.eventDeleted"));
      } else {
        toast.error(t("error.failedToDeleteEvent"));
      }
    } catch (err) {
      console.error("Unexpected error deleting event:", err);
      toast.error(t("error.unexpected"));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const getPublishedVariant = (
    isPublished: number | boolean | null | undefined
  ) => {
    const isPub =
      typeof isPublished === "number"
        ? isPublished === 1
        : isPublished === true;
    return isPub ? "default" : "secondary";
  };

  const getCategoryVariant = (category: string | null | undefined) => {
    switch (category?.toLowerCase()) {
      case "community":
        return "default";
      case "cultural":
        return "secondary";
      case "sports":
        return "outline";
      case "meeting":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("table.id")}</TableHead>
            <TableHead>{t("table.title")}</TableHead>
            <TableHead>{t("table.category")}</TableHead>
            <TableHead>{t("table.date")}</TableHead>
            <TableHead>{t("table.time")}</TableHead>
            <TableHead>{t("table.location")}</TableHead>
            <TableHead>{t("table.published")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.id}</TableCell>
              <TableCell className="font-medium max-w-md truncate">
                {event.title}
              </TableCell>
              <TableCell>
                {event.category ? (
                  <Badge variant={getCategoryVariant(event.category)}>
                    {t(`form.category${event.category.charAt(0).toUpperCase() + event.category.slice(1)}`)}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>{formatDate(event.eventDate)}</TableCell>
              <TableCell>{formatTime(event.eventTime)}</TableCell>
              <TableCell className="max-w-xs truncate">
                {event.location}
              </TableCell>
              <TableCell>
                <Badge variant={getPublishedVariant(event.isPublished)}>
                  {typeof event.isPublished === "number"
                    ? event.isPublished === 1
                      ? t("yes", "Yes")
                      : t("no", "No")
                    : event.isPublished
                    ? t("yes", "Yes")
                    : t("no", "No")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t("edit", "Edit")}</span>
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
                      <AlertDialogTitle>{t("form.deleteAlert.title", "Are you sure?")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("form.deleteAlert.description", { eventTitle: event.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("form.deleteAlert.cancel", "Cancel")}</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(event.id)}
                        disabled={deletingId === event.id}
                      >
                        {deletingId === event.id ? t("deleting", "Deleting...") : t("form.deleteAlert.delete", "Delete")}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {events.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-8"
              >
                {t("form.eventNotFound")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
