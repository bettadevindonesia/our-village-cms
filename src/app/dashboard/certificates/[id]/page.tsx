
import CertificateDetailClient from "@/components/certificates/certificate-detail-client";
import { getCertificateById } from "@/lib/certificate";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CertificateDetailPage({ params }: PageProps) {
  const { id: idString } = await params;
  const id = parseInt(idString, 10);

  if (isNaN(id)) {
    notFound();
  }

  const certificate = await getCertificateById(id);
  if (!certificate) {
    notFound();
  }

  return <CertificateDetailClient certificate={certificate} />;
}
