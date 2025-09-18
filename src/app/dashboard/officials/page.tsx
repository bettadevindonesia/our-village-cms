import CardOfficial from "@/components/officials/card-official";
import { getAllOfficials } from "@/lib/official";

export default async function OfficialsPage() {
  const officials = await getAllOfficials();

  return <CardOfficial officials={officials} />;
}
