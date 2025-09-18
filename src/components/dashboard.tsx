"use client";

import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CurrentSessionProps } from "@/lib/session";

export function DashboardClient({
  user,
  stats,
  recentEvents,
}: {
  user: CurrentSessionProps | null;
  stats: {
    users: number;
    events: number;
    announcements: number;
    officials: number;
    certificates: number;
  };
  recentEvents: Array<{
    id: number;
    title: string;
    description: string | null;
    additionalInfo: string | null;
    eventDate: string;
    eventTime: string | null;
    location: string;
    category: string | null;
    contactInfo: string | null;
    isPublished: boolean | null;
    createdAt: string | null;
    createdBy: number | null;
    slug: string | null;
  }>;
}) {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("subtitle").replace("{name}", user?.fullName || "User")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard title={t("stats.totalUsers")} value={stats.users} />
        <StatCard title={t("stats.totalEvents")} value={stats.events} />
        <StatCard
          title={t("stats.totalAnnouncements")}
          value={stats.announcements}
        />
        <StatCard title={t("stats.totalOfficials")} value={stats.officials} />
        <StatCard
          title={t("stats.totalCertificates")}
          value={stats.certificates}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("recentEvents")}</CardTitle>
            <CardDescription>{t("recentEventsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <ul className="space-y-2">
                {recentEvents.map((event) => (
                  <li
                    key={event.id}
                    className="flex items-center justify-between"
                  >
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {event.createdAt
                        ? new Date(event.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                {t("dashboard.noRecentEvents")}
              </p>
            )}
            <Button variant="link" className="p-0 h-auto mt-2" asChild>
              <Link href="/dashboard/events">{t("viewAll")}</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Add more cards for Recent Announcements, etc. */}
        <Card>
          <CardHeader>
            <CardTitle>{t("quickActions.title")}</CardTitle>
            <CardDescription>{t("quickActions.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/dashboard/events">
                {t("quickActions.actions.manageEvents")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/announcements">
                {t("quickActions.actions.manageAnnouncements")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/officials">
                {t("quickActions.actions.manageOfficials")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/certificates">
                {t("quickActions.actions.viewCertificates")}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">
                {t("quickActions.actions.editSettings")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
