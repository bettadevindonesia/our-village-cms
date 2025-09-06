import EditEventForm from '@/components/events/edit-event-from';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getEventById } from '@/lib/event'; // Import get and update actions
import { notFound } from 'next/navigation';

// Server Component to fetch event data
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  // 1. Await the params Promise to get the actual values
  const { id: idString } = await params;

  // 2. Validate and parse the ID
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound(); // Trigger the 404 page if ID is invalid
  }

  // 3. Fetch the event data using the ID
  const event = await getEventById(id);
  if (!event) {
    notFound(); // Trigger the 404 page if event not found
  }

  // 4. Format date for the calendar component if needed
  // Ensure eventDate is a Date object for the client-side form component
  const formattedEventDate = event.eventDate ? new Date(event.eventDate) : undefined;

  // 5. Render the page with the fetched data
  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Event</CardTitle>
          <CardDescription>Update the details for this event.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass data to the client component */}
          <EditEventForm
            event={{
              ...event,
              eventDate: formattedEventDate, // Pass the Date object
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
