import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnnouncementTable } from '@/components/announcements/announcement-table';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getAllAnnouncements } from '@/lib/announcement'; // We'll create this data fetching utility

// Server Component to fetch announcements
export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements(); // Fetch data server-side

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Manage your announcements here.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/announcements/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Announcement</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnnouncementTable announcements={announcements} />
        </CardContent>
      </Card>
    </div>
  );
}