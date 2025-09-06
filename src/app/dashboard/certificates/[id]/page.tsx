import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCertificateById } from '@/lib/certificate';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Server Component to fetch certificate data
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getTypeLabel = (type: string | null | undefined) => {
    switch (type) {
      case 'surat_keterangan_usaha': return 'Surat Keterangan Usaha';
      case 'surat_keterangan_tidak_mampu': return 'Surat Keterangan Tidak Mampu';
      case 'surat_keterangan_pengantar': return 'Surat Keterangan Pengantar';
      default: return type || 'Unknown';
    }
  };


  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certificate Details</CardTitle>
              <CardDescription>Document Number: {certificate.documentNumber}</CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/certificates">Back to List</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label="Type" value={getTypeLabel(certificate.certificateType)} />
            <DetailItem label="Applicant Name" value={certificate.applicantName} />
            <DetailItem label="Place of Birth" value={certificate.placeOfBirth} />
            <DetailItem label="Date of Birth" value={formatDate(certificate.dateOfBirth)} />
            <DetailItem label="Occupation" value={certificate.occupation} />
            <DetailItem label="Address" value={certificate.address} />
            <DetailItem label="RT/RW Letter No." value={certificate.rtRwLetterNumber} />
            <DetailItem label="RT/RW Letter Date" value={formatDate(certificate.rtRwLetterDate)} />

            {/* Conditional fields based on type */}
            {certificate.certificateType === 'surat_keterangan_usaha' && (
              <>
                <DetailItem label="Business Name" value={certificate.businessName || 'N/A'} />
                <DetailItem label="Business Type" value={certificate.businessType || 'N/A'} />
                <DetailItem label="Business Address" value={certificate.businessAddress || 'N/A'} />
                <DetailItem label="Business Years" value={certificate.businessYears || 'N/A'} />
              </>
            )}

            {(certificate.certificateType === 'surat_keterangan_tidak_mampu' || certificate.certificateType === 'surat_keterangan_pengantar') && (
              <>
                <DetailItem label="Gender" value={certificate.gender || 'N/A'} />
                <DetailItem label="Religion" value={certificate.religion || 'N/A'} />
                <DetailItem label="Purpose" value={certificate.purpose || 'N/A'} />
              </>
            )}

            {certificate.certificateType === 'surat_keterangan_pengantar' && (
              <>
                <DetailItem label="Nationality" value={certificate.nationality || 'N/A'} />
                <DetailItem label="Family Card No." value={certificate.familyCardNumber || 'N/A'} />
                <DetailItem label="NIK" value={certificate.nationalIdNumber || 'N/A'} />
                <DetailItem label="Valid From" value={formatDate(certificate.validFromDate)} />
                <DetailItem label="Remarks" value={certificate.remarks || 'N/A'} />
              </>
            )}

            <DetailItem label="Created At" value={formatDate(certificate.createdAt)} />
            <DetailItem label="Updated At" value={formatDate(certificate.updatedAt)} />
            {/* Add createdBy if you track it */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for consistent detail display
function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || '-'}</p>
    </div>
  );
}
