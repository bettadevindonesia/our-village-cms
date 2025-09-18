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
import { deleteAnnouncement } from "@/lib/announcement";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import type { Announcement } from "@/lib/announcement";
import { useTranslation } from "react-i18next";

export interface AnnouncementTableProps {
  announcements: Announcement[];
}

export function AnnouncementTable({ announcements }: AnnouncementTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { t } = useTranslation("announcement");

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteAnnouncement(id);
      if (success) {
        toast.success(t("successDelete"));
      } else {
        toast.error(t("errorDelete"));
      }
    } catch (err) {
      console.error("Unexpected error deleting announcement:", err);
      toast.error(t("errorUnexpected"));
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityVariant = (priority: string | null | undefined) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getCategoryVariant = (category: string | null | undefined) => {
    switch (category?.toLowerCase()) {
      case "urgent":
        return "destructive";
      case "event":
        return "default";
      case "maintenance":
        return "secondary";
      case "official":
        return "default";
      default:
        return "outline";
    }
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>{t("table.header.title")}</TableHead>
            <TableHead>{t("table.header.category")}</TableHead>
            <TableHead>{t("table.header.priority")}</TableHead>
            <TableHead>{t("table.header.published")}</TableHead>
            <TableHead>{t("table.header.publishedAt")}</TableHead>
            <TableHead className="text-right">{t("table.header.actions")}</TableHead>
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
                    {t(`categoryOption.${announcement.category}`)}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>
                {announcement.priority ? (
                  <Badge variant={getPriorityVariant(announcement.priority)}>
                    {t(`priorityOption.${announcement.priority}`)}
                  </Badge>
                ) : (
                  <span>-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getPublishedVariant(announcement.isPublished)}>
                  {typeof announcement.isPublished === "number"
                    ? announcement.isPublished === 1
                      ? t("yes")
                      : t("no")
                    : announcement.isPublished
                    ? t("yes")
                    : t("no")}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(announcement.publishedAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link
                    href={`/dashboard/announcements/${announcement.id}/edit`}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t("edit")}</span>
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
                      <AlertDialogTitle>{t("confirmDeleteTitle", "Are you sure?")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("confirmDelete", { title: announcement.title })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                      <Button
                        onClick={() => handleDelete(announcement.id)}
                        disabled={deletingId === announcement.id}
                        variant="destructive"
                      >
                        {deletingId === announcement.id
                          ? t("deleting")
                          : t("delete")}
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
                {t("table.noData")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
