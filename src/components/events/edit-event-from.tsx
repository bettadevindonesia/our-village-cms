"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Event } from "@/lib/event";
import { updateEvent } from "@/lib/event";
import { cn, slugify } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useTranslation } from "node_modules/react-i18next";

type EditableEvent = Omit<Event, "eventDate"> & {
  eventDate?: Date | null;
};

export default function EditEventForm({ event }: { event: EditableEvent }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [eventDate, setEventDate] = useState<Date | undefined>(
    event.eventDate ?? undefined
  );

  const { t } = useTranslation("event");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = (formData.get("description") as string) || null;
    const additionalInfo = (formData.get("additional_info") as string) || null;
    const location = formData.get("location") as string;
    const category = (formData.get("category") as string) || null;
    const contactInfo = (formData.get("contact_info") as string) || null;
    const eventTime = (formData.get("event_time") as string) || null;

    const eventDateStr = eventDate
      ? eventDate.toISOString().split("T")[0]
      : null;

    const isPublishedRaw = formData.get("is_published");
    const isPublished = isPublishedRaw === "on";

    if (!title.trim() || !location.trim() || !eventDateStr) {
      toast.error(t("error.requiredFields"));
      return;
    }

    startTransition(async () => {
      try {
        const updatedData = {
          title,
          description,
          additionalInfo,
          location,
          category,
          contactInfo,
          eventTime,
          eventDate: eventDateStr,
          isPublished,
          slug: slugify(title),
        };

        const result = await updateEvent(event.id, updatedData);
        if (result) {
          toast.success(t("success.eventUpdated"));
          router.push("/dashboard/events");
          router.refresh();
        } else {
          toast.error(t("error.failedToUpdateEvent"));
        }
      } catch (err) {
        console.error("Unexpected error during event update:", err);
        toast.error(t("error.unexpected"));
      }
    });
  };

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.cardEditTitle")}</CardTitle>
          <CardDescription>{t("form.cardEditDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={event.id} />{" "}
            {/* Hidden ID field */}
            <div className="space-y-2">
              <Label htmlFor="title">{t("form.title")} *</Label>
              <Input
                id="title"
                name="title"
                placeholder={t("form.titlePlaceholder")}
                required
                defaultValue={event.title}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("form.description")}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("form.descriptionPlaceholder")}
                rows={4}
                defaultValue={event.description ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional_info">{t("form.additionalInfo")}</Label>
              <Textarea
                id="additional_info"
                name="additional_info"
                placeholder={t("form.additionalInfoPlaceholder")}
                rows={2}
                defaultValue={event.additionalInfo ?? ""}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">{t("form.location")} *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder={t("form.locationPlaceholder")}
                  required
                  defaultValue={event.location}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t("form.category")}</Label>
                <Select
                  name="category"
                  defaultValue={event.category ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("form.categoryPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="community">{t("form.categoryCommunity")}</SelectItem>
                    <SelectItem value="culture">{t("form.categoryCulture")}</SelectItem>
                    <SelectItem value="sports">{t("form.categorySports")}</SelectItem>
                    <SelectItem value="government">{t("form.categoryGovernment")}</SelectItem>
                    <SelectItem value="other">{t("form.categoryOther")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_time">{t("form.eventTime")}</Label>
                <Input
                  id="event_time"
                  name="event_time"
                  type="time"
                  defaultValue={event.eventTime ?? ""}
                />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="event_date">{t("form.eventDate")}</Label>
                <input
                  type="hidden"
                  name="event_date"
                  value={eventDate ? eventDate.toISOString().split("T")[0] : ""}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {eventDate ? (
                        format(eventDate, "PPP")
                      ) : (
                        <span>{t("form.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={eventDate}
                      onSelect={setEventDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  id="is_published"
                  name="is_published"
                  defaultChecked={
                    typeof event.isPublished === "number"
                      ? event.isPublished === 1
                      : event.isPublished === true
                  }
                />
                <Label htmlFor="is_published">{t("form.published")}</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_info">{t("form.contact")}</Label>
              <Input
                id="contact_info"
                name="contact_info"
                placeholder={t("form.contactPlaceholder")}
                defaultValue={event.contactInfo ?? ""}
              />
            </div>
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/events">{t("form.cancel")}</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.updating") : t("form.updateEvent")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
