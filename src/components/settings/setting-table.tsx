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
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteSetting } from "@/lib/setting";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import type { Setting } from "@/lib/setting";
import { Input } from "../ui/input";

interface SettingTableProps {
  settings: Setting[];
}

export function SettingTable({ settings }: SettingTableProps) {
  const { t } = useTranslation("setting");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteSetting(id);
      if (success) {
        toast.success(t("success.deleted"));
      } else {
        toast.error(t("error.delete"));
      }
    } catch (err) {
      console.error("Unexpected error deleting setting:", err);
      if (err instanceof Error) {
        toast.error(err.message || t("error.unexpected"));
      } else {
        toast.error(t("error.unexpected"));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return t("table.na");
    return new Date(dateString).toLocaleDateString();
  };

  const filteredSettings = useMemo(() => {
    return settings.filter((setting) =>
      setting.settingKey.toLowerCase().includes(search.toLowerCase()) ||
      (setting.settingValue || "").toLowerCase().includes(search.toLowerCase()) ||
      (setting.description || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [settings, search]);

  const totalPages = Math.ceil(filteredSettings.length / pageSize);
  const paginatedSettings = filteredSettings.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
        <Input
          type="text"
          placeholder={t("search.placeholder")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input input-bordered w-full sm:w-64"
        />
        <div className="flex gap-2 items-center">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            {t("pagination.prev")}
          </Button>
          <span>
            {t("pagination.page", { page, totalPages: totalPages || 1 })}
          </span>
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            {t("pagination.next")}
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("table.id")}</TableHead>
            <TableHead>{t("table.key")}</TableHead>
            <TableHead>{t("table.value")}</TableHead>
            <TableHead>{t("table.description")}</TableHead>
            <TableHead>{t("table.updatedAt")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSettings.map((setting) => (
            <TableRow key={setting.id}>
              <TableCell className="font-medium">{setting.id}</TableCell>
              <TableCell className="font-mono text-sm">
                {setting.settingKey}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {setting.settingValue || (
                  <span className="text-muted-foreground italic">{t("table.null")}</span>
                )}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {setting.description || (
                  <span className="text-muted-foreground italic">
                    {t("table.noDescription")}
                  </span>
                )}
              </TableCell>
              <TableCell>{formatDate(setting.updatedAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/settings/${setting.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">{t("table.edit")}</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("table.delete")}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("delete.description", { key: setting.settingKey })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(setting.id)}
                        disabled={deletingId === setting.id}
                      >
                        {deletingId === setting.id ? t("delete.deleting") : t("delete.confirm")}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {paginatedSettings.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                {t("table.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
