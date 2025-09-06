import EditSettingForm from '@/components/settings/edit-setting-form'; // We'll create this client component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSettingById } from '@/lib/setting'; // Import get and update actions
import { notFound } from 'next/navigation';

// Server Component to fetch setting data
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSettingPage({ params }: PageProps) {
  // 1. Await the params Promise to get the actual values
  const { id: idString } = await params;

  // 2. Validate and parse the ID
  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound(); // Trigger the 404 page if ID is invalid
  }

  // 3. Fetch the setting data using the ID
  const setting = await getSettingById(id);
  if (!setting) {
    notFound(); // Trigger the 404 page if setting not found
  }

  // 5. Render the page with the fetched data
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Setting</CardTitle>
          <CardDescription>Update the details for this setting.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass data to the client component */}
          <EditSettingForm setting={setting} />
        </CardContent>
      </Card>
    </div>
  );
}
