import EventHeader from "@/components/events/event-header";
import { EventTable } from "@/components/events/event-table";
import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";
import { getAllEvents } from "@/lib/event";

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <EventHeader />
        </CardHeader>
        <CardContent>
          <EventTable events={events} />
        </CardContent>
      </Card>
    </div>
  );
}
