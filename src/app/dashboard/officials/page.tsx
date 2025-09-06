import { OfficialTable } from '@/components/officials/official-table'; // We'll create this
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllOfficials } from '@/lib/official'; // We'll create this data fetching utility
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

// Server Component to fetch officials
export default async function OfficialsPage() {
  const officials = await getAllOfficials(); // Fetch data server-side

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Officials</CardTitle>
              <CardDescription>Manage village officials here.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/officials/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Official</span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OfficialTable officials={officials} />
        </CardContent>
      </Card>
    </div>
  );
}
