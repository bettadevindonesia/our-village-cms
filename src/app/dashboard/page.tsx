import { DashboardClient } from "@/components/dashboard";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import {
  announcements,
  certificates,
  events,
  officials,
  users,
} from "db/schema";
import { count, desc } from "drizzle-orm";
import { redirect } from "next/navigation";

async function getDashboardStats() {
  try {
    const [userCount] = await db.select({ count: count() }).from(users);
    const [eventCount] = await db.select({ count: count() }).from(events);
    const [announcementCount] = await db
      .select({ count: count() })
      .from(announcements);
    const [officialCount] = await db.select({ count: count() }).from(officials);
    const [certificateCount] = await db
      .select({ count: count() })
      .from(certificates);

    const recentEvents = await db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt))
      .limit(5);

    return {
      stats: {
        users: userCount.count,
        events: eventCount.count,
        announcements: announcementCount.count,
        officials: officialCount.count,
        certificates: certificateCount.count,
      },
      recentEvents,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return {
      stats: {
        users: 0,
        events: 0,
        announcements: 0,
        officials: 0,
        certificates: 0,
      },
      recentEvents: [],
    };
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const { stats, recentEvents } = await getDashboardStats();

  return (
    <DashboardClient user={user} stats={stats} recentEvents={recentEvents} />
  );
}
