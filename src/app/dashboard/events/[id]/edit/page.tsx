import EditEventForm from "@/components/events/edit-event-from";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEventById } from "@/lib/event";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id: idString } = await params;

  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound();
  }

  const event = await getEventById(id);
  if (!event) {
    notFound();
  }

  const formattedEventDate = event.eventDate
    ? new Date(event.eventDate)
    : undefined;

  return (
    <EditEventForm
      event={{
        ...event,
        eventDate: formattedEventDate,
      }}
    />
  );
}
