"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface CertificateDetailClientProps {
  certificate: any;
}

export default function CertificateDetailClient({ certificate }: CertificateDetailClientProps) {
  const { t } = useTranslation("certificate");

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return t("table.na");
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  const getTypeLabel = (type: string | null | undefined) => {
    if (!type) return t("typeLabel.unknown");
    return t(`typeLabel.${type}`);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("detail.title")}</CardTitle>
              <CardDescription>
                {t("detail.documentNumber", { documentNumber: certificate.documentNumber })}
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/dashboard/certificates">{t("detail.backToList")}</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem label={t("table.type")}
              value={getTypeLabel(certificate.certificateType)}
            />
            <DetailItem label={t("detail.applicantName")} value={certificate.applicantName} />
            <DetailItem label={t("detail.placeOfBirth")} value={certificate.placeOfBirth} />
            <DetailItem label={t("detail.dateOfBirth")} value={formatDate(certificate.dateOfBirth)} />
            <DetailItem label={t("detail.occupation")} value={certificate.occupation} />
            <DetailItem label={t("detail.address")} value={certificate.address} />
            <DetailItem label={t("detail.rtRwLetterNumber")} value={certificate.rtRwLetterNumber} />
            <DetailItem label={t("detail.rtRwLetterDate")} value={formatDate(certificate.rtRwLetterDate)} />

            {/* Conditional fields based on type */}
            {certificate.certificateType === "surat_keterangan_usaha" && (
              <>
                <DetailItem label={t("detail.businessName")} value={certificate.businessName || t("table.na")} />
                <DetailItem label={t("detail.businessType")} value={certificate.businessType || t("table.na")} />
                <DetailItem label={t("detail.businessAddress")} value={certificate.businessAddress || t("table.na")} />
                <DetailItem label={t("detail.businessYears")} value={certificate.businessYears || t("table.na")} />
              </>
            )}

            {(certificate.certificateType === "surat_keterangan_tidak_mampu" ||
              certificate.certificateType === "surat_keterangan_pengantar") && (
              <>
                <DetailItem label={t("detail.gender")} value={certificate.gender || t("table.na")} />
                <DetailItem label={t("detail.religion")} value={certificate.religion || t("table.na")} />
                <DetailItem label={t("detail.purpose")} value={certificate.purpose || t("table.na")} />
              </>
            )}

            {certificate.certificateType === "surat_keterangan_pengantar" && (
              <>
                <DetailItem label={t("detail.nationality")} value={certificate.nationality || t("table.na")} />
                <DetailItem label={t("detail.familyCardNumber")} value={certificate.familyCardNumber || t("table.na")} />
                <DetailItem label={t("detail.nik")} value={certificate.nationalIdNumber || t("table.na")} />
                <DetailItem label={t("detail.validFromDate")} value={formatDate(certificate.validFromDate)} />
                <DetailItem label={t("detail.remarks")} value={certificate.remarks || t("table.na")} />
              </>
            )}

            <DetailItem label={t("detail.createdAt")} value={formatDate(certificate.createdAt)} />
            <DetailItem label={t("detail.updatedAt")} value={formatDate(certificate.updatedAt)} />
            {/* Add createdBy if you track it */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-base">{value || "-"}</p>
    </div>
  );
}