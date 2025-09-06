import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnnouncementById } from '@/lib/announcement'; // Import get action
import { notFound } from 'next/navigation';
import EditAnnouncementForm from '@/components/announcements/edit-announcement-form'; // Import the client component

// Server Component to fetch announcement data
// Correctly type and await params
interface PageProps {
  params: Promise<{ id: string }>;
  // searchParams is also a Promise if you use it
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditAnnouncementPage({ params }: PageProps) {
  // 1. Await the params Promise to get the actual values
  const { id: idString } = await params;
  
  // 2. Validate and parse the ID
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound(); // Trigger the 404 page if ID is invalid
  }

  // 3. Fetch the announcement data using the ID
  const announcement = await getAnnouncementById(id);
  if (!announcement) {
    notFound(); // Trigger the 404 page if announcement not found
  }

  // 4. Format date for the calendar component if needed
  // Ensure publishedAt is a Date object for the client-side form component
  const formattedPublishedAt = announcement.publishedAt ? new Date(announcement.publishedAt) : undefined;

  // 5. Render the page with the fetched data
  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Announcement</CardTitle>
          <CardDescription>Update the details for this announcement.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass data to the client component */}
          <EditAnnouncementForm
            announcement={{
              ...announcement,
              publishedAt: formattedPublishedAt, // Pass the Date object
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}