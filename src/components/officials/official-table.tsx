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
import { deleteOfficial } from "@/lib/official";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import type { Official } from "@/lib/official";
import { useTranslation } from "react-i18next";

export interface OfficialTableProps {
  officials: Official[];
}

export function OfficialTable({ officials }: OfficialTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { t } = useTranslation("official");

  const handleDelete = async (id: number, name: string) => {
    setDeletingId(id);
    try {
      const success = await deleteOfficial(id);
      if (success) {
        toast.success(t("form.success.officialDeleted"));
      } else {
        toast.error(t("form.error.failedToDeleteOfficial"));
      }
    } catch (err) {
      console.error("Unexpected error deleting official:", err);
      toast.error(t("form.error.unexpected"));
    } finally {
      setDeletingId(null);
    }
  };

  const getActiveVariant = (isActive: number | boolean | null | undefined) => {
    const isActiveBool =
      typeof isActive === "number" ? isActive === 1 : isActive === true;
    return isActiveBool ? "default" : "secondary";
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("table.id")}</TableHead>
            <TableHead>{t("table.name")}</TableHead>
            <TableHead>{t("table.position")}</TableHead>
            <TableHead>{t("table.description")}</TableHead>
            <TableHead>{t("table.isActive")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {officials.map((official) => (
            <TableRow key={official.id}>
              <TableCell className="font-medium">{official.id}</TableCell>
              <TableCell className="font-medium max-w-md truncate">
                {official.name}
              </TableCell>
              <TableCell>{official.position}</TableCell>
              <TableCell>{official.description}</TableCell>
              <TableCell>
                <Badge variant={getActiveVariant(official.isActive)}>
                  {typeof official.isActive === "number"
                    ? official.isActive === 1
                      ? t("yes", "Yes")
                      : t("no", "No")
                    : official.isActive
                    ? t("yes", "Yes")
                    : t("no", "No")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/officials/${official.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t("edit", "Edit")}</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("delete", "Delete")}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("form.deleteAlert.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("form.deleteAlert.description", { officialName: official.name })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("form.deleteAlert.cancel")}</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(official.id, official.name)}
                        disabled={deletingId === official.id}
                      >
                        {deletingId === official.id ? t("deleting", "Deleting...") : t("form.deleteAlert.delete")}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {officials.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                {t("form.officialNotFound")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
