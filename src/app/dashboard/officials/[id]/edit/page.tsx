import EditOfficialForm from '@/components/officials/edit-official-form'; // We'll create this client component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOfficialById } from '@/lib/official'; // Import get and update actions
import { notFound } from 'next/navigation';

// Server Component to fetch official data
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOfficialPage({ params }: PageProps) {
  // 1. Await the params Promise to get the actual values
  const { id: idString } = await params;

  // 2. Validate and parse the ID
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound(); // Trigger the 404 page if ID is invalid
  }

  // 3. Fetch the official data using the ID
  const official = await getOfficialById(id);
  if (!official) {
    notFound(); // Trigger the 404 page if official not found
  }

  // 5. Render the page with the fetched data
  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Official</CardTitle>
          <CardDescription>Update the details for this official.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass data to the client component */}
          <EditOfficialForm official={official} />
        </CardContent>
      </Card>
    </div>
  );
}
