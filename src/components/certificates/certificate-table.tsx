"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCertificate } from "@/lib/certificate";
import { useTranslation } from "react-i18next";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import type { Certificate } from "@/lib/certificate";

export interface CertificateTableProps {
  certificates: Certificate[];
}

export function CertificateTable({ certificates }: CertificateTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { t } = useTranslation("certificate");

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteCertificate(id);
      if (success) {
        toast.success(t("delete.successTitle"));
      } else {
        toast.error(t("delete.errorTitle"));
      }
    } catch (err) {
      console.error("Unexpected error deleting certificate:", err);
      toast.error(t("delete.errorUnexpected"));
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeLabel = (type: string | null | undefined) => {
    if (!type) return t("typeLabel.unknown");
    return t(`typeLabel.${type}`);
  };

  const getTypeVariant = (type: string | null | undefined) => {
    switch (type) {
      case "surat_keterangan_usaha":
        return "default";
      case "surat_keterangan_tidak_mampu":
        return "destructive";
      case "surat_keterangan_pengantar":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return t("table.na");
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("table.id")}</TableHead>
            <TableHead>{t("table.documentNumber")}</TableHead>
            <TableHead>{t("table.type")}</TableHead>
            <TableHead>{t("table.applicant")}</TableHead>
            <TableHead>{t("table.created")}</TableHead>
            <TableHead className="text-right">{t("table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell className="font-medium">{cert.id}</TableCell>
              <TableCell className="font-medium max-w-xs truncate">
                {cert.documentNumber}
              </TableCell>
              <TableCell>
                <Badge variant={getTypeVariant(cert.certificateType)}>
                  {getTypeLabel(cert.certificateType)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {cert.applicantName}
              </TableCell>
              <TableCell>{formatDate(cert.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/certificates/${cert.id}`}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">{t("table.view")}</span>
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("table.delete")}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t("delete.description", { documentNumber: cert.documentNumber, applicantName: cert.applicantName })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("delete.cancel")}</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(cert.id)}
                        disabled={deletingId === cert.id}
                      >
                        {deletingId === cert.id ? t("delete.deleting") : t("delete.confirm")}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {certificates.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-8"
              >
                {t("table.empty")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
