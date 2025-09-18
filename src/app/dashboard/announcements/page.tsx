import AnnouncementCard from "@/components/announcements/announcement-card";
import { getAllAnnouncements } from "@/lib/announcement";

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return <AnnouncementCard announcements={announcements} />;
}
