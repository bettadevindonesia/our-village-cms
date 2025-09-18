"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn, slugify } from "@/lib/utils";
import { createAnnouncement } from "@/lib/announcement";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function NewAnnouncementPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [publishedAt, setPublishedAt] = useState<Date | undefined>(new Date());
  const { t } = useTranslation("announcement");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category =
      (formData.get("category") as
        | "general"
        | "event"
        | "maintenance"
        | "official"
        | "urgent") || null;
    const priority =
      (formData.get("priority") as "high" | "medium" | "low") || null;
    const notes = (formData.get("notes") as string) || null;

    const publishedAtStr = publishedAt ? publishedAt.toISOString() : null;

    const isPublishedRaw = formData.get("is_published");
    const isPublished = isPublishedRaw === "on";

    if (!title.trim() || !content.trim()) {
      toast.error(t("form.errorRequired"));
      return;
    }

    startTransition(async () => {
      try {
        const newAnnouncement = {
          title,
          content,
          category,
          priority,
          notes,
          publishedAt: publishedAtStr,
          isPublished,
          slug: slugify(title),
        };

        const result = await createAnnouncement(newAnnouncement);
        if (result) {
          toast.success(t("form.successCreate"));
          router.push("/dashboard/announcements");
          router.refresh();
        } else {
          toast.error(t("form.errorCreate"));
        }
      } catch (err) {
  console.error("Unexpected error during announcement creation:", err);
  toast.error(t("form.errorUnexpected"));
      }
    });
  };

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.createTitle")}</CardTitle>
          <CardDescription>
            {t("form.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t("form.title")} *</Label>
              <Input
                id="title"
                name="title"
                placeholder={t("form.titlePlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">{t("form.content")} *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder={t("form.contentPlaceholder")}
                required
                rows={6}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t("form.category")}</Label>
                <Select name="category">
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.categoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">{t("categoryOption.general")}</SelectItem>
                    <SelectItem value="event">{t("categoryOption.event")}</SelectItem>
                    <SelectItem value="maintenance">{t("categoryOption.maintenance")}</SelectItem>
                    <SelectItem value="official">{t("categoryOption.official")}</SelectItem>
                    <SelectItem value="urgent">{t("categoryOption.urgent")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">{t("form.priority")}</Label>
                <Select name="priority">
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.priorityPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">{t("priorityOption.high")}</SelectItem>
                    <SelectItem value="medium">{t("priorityOption.medium")}</SelectItem>
                    <SelectItem value="low">{t("priorityOption.low")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="published_at">{t("form.publishedAt")}</Label>
                <input
                  type="hidden"
                  name="published_at"
                  value={publishedAt?.toISOString() || ""}
                />
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
                      {publishedAt ? (
                        format(publishedAt, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
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
              <Label htmlFor="notes">{t("form.notes")}</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder={t("form.notesPlaceholder")}
                rows={3}
              />
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch id="is_published" name="is_published" defaultChecked />
                <Label htmlFor="is_published">{t("form.published")}</Label>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/announcements">{t("cancel")}</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("creating") : t("createAnnouncement")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
