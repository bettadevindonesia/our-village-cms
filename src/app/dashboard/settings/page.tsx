import { SettingTable } from '@/components/settings/setting-table'; // We'll create this
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllSettings } from '@/lib/setting'; // We'll create this data fetching utility
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Server Component to fetch settings
export default async function SettingsPage() {
  const settings = await getAllSettings(); // Fetch data server-side

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage application settings here.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/settings/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Setting</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SettingTable settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
