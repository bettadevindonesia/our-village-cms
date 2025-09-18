import CardEditSettingForm from "@/components/settings/form-edit";
import { getSettingById } from "@/lib/setting";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditSettingPage({ params }: PageProps) {
  const { id: idString } = await params;

  const id = parseInt(idString, 10);
  if (isNaN(id)) {
    notFound();
  }

  const setting = await getSettingById(id);
  if (!setting) {
    notFound();
  }

  return <CardEditSettingForm setting={setting} />;
}
