import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/session'; // Assuming you have this
import { announcements, certificates, events, officials, users } from 'db/schema';
import { count, desc } from 'drizzle-orm';
import Link from 'next/link';
import { redirect } from 'next/navigation';

// Example function to fetch counts (place in lib or actions if reused)
async function getDashboardStats() {
  try {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [eventCount] = await db.select({ count: count() }).from(events);
    const [announcementCount] = await db.select({ count: count() }).from(announcements);
    const [officialCount] = await db.select({ count: count() }).from(officials);
    const [certificateCount] = await db.select({ count: count() }).from(certificates);

    // Example: Fetch recent events
    const recentEvents = await db.select().from(events).orderBy(desc(events.createdAt)).limit(5);

    return {
      stats: {
        users: userCount.count,
        events: eventCount.count,
        announcements: announcementCount.count,
        officials: officialCount.count,
        certificates: certificateCount.count,
      },
      recentEvents,
      // Add other fetched data (recent announcements, etc.) here
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    // Return default/empty values or handle error as appropriate
    return {
      stats: { users: 0, events: 0, announcements: 0, officials: 0, certificates: 0 },
      recentEvents: [],
    };
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser(); // Protect the route

  if (!user) {
    redirect('/'); // Or /login
  }

  const { stats, recentEvents } = await getDashboardStats();

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.fullName}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Events" value={stats.events} />
        <StatCard title="Total Announcements" value={stats.announcements} />
        <StatCard title="Total Officials" value={stats.officials} />
        <StatCard title="Certificates Generated" value={stats.certificates} />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest events added</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <ul className="space-y-2">
                {recentEvents.map((event) => (
                  <li key={event.id} className="flex items-center justify-between">
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No recent events.</p>
            )}
             <Button variant="link" className="p-0 h-auto mt-2" asChild>
                <Link href="/dashboard/events">View All Events</Link>
             </Button>
          </CardContent>
        </Card>

        {/* Add more cards for Recent Announcements, etc. */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to management sections</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/events">Manage Events</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/announcements">Manage Announcements</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/officials">Manage Officials</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/certificates">View Certificates</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">Edit Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Simple component for stat cards
function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* You could add an icon here */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
