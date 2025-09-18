import CardEditOfficial from "@/components/officials/card-edit-form";
import { getOfficialById } from "@/lib/official";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditOfficialPage({ params }: PageProps) {
  const { id: idString } = await params;

  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound();
  }

  const official = await getOfficialById(id);
  if (!official) {
    notFound();
  }

  return <CardEditOfficial official={official} />;
}
