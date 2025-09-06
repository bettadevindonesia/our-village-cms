import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EventTable } from '@/components/events/event-table'; // We'll create this
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllEvents } from '@/lib/event'; // We'll create this data fetching utility

// Server Component to fetch events
export default async function EventsPage() {
  const events = await getAllEvents(); // Fetch data server-side

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Events</CardTitle>
              <CardDescription>Manage your events here.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/events/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Event</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <EventTable events={events} />
        </CardContent>
      </Card>
    </div>
  );
}