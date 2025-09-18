import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAnnouncementById } from "@/lib/announcement";
import { notFound } from "next/navigation";
import EditAnnouncementForm from "@/components/announcements/edit-announcement-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAnnouncementPage({ params }: PageProps) {
  const { id: idString } = await params;

  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound();
  }

  const announcement = await getAnnouncementById(id);
  if (!announcement) {
    notFound();
  }

  const formattedPublishedAt = announcement.publishedAt
    ? new Date(announcement.publishedAt)
    : undefined;

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Announcement</CardTitle>
          <CardDescription>
            Update the details for this announcement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass data to the client component */}
          <EditAnnouncementForm
            announcement={{
              ...announcement,
              publishedAt: formattedPublishedAt,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
