"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CertificateTable, CertificateTableProps } from "./certificate-table";
import { useTranslation } from "react-i18next";

type CertificateCardProps = {
  certificates: CertificateTableProps["certificates"];
};

export default function CertificateCard({ certificates }: CertificateCardProps) {
  const { t } = useTranslation("certificate");
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CertificateTable certificates={certificates} />
        </CardContent>
      </Card>
    </div>
  );
}
