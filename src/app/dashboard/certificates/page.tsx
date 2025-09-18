import CertificateCard from "@/components/certificates/certificate-card";
import { getAllCertificates } from "@/lib/certificate";

export default async function CertificatesPage() {
  const certificates = await getAllCertificates();

  return <CertificateCard certificates={certificates} />;
}
