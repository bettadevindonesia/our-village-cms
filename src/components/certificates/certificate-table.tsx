"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
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
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import type { Certificate } from "@/lib/certificate";

interface CertificateTableProps {
  certificates: Certificate[];
}

export function CertificateTable({ certificates }: CertificateTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const success = await deleteCertificate(id);
      if (success) {
        toast.success("Certificate deleted successfully.");
      } else {
        toast.error("Failed to delete certificate.");
      }
    } catch (err) {
      console.error("Unexpected error deleting certificate:", err);
      toast.error("An unexpected error occurred.");
    } finally {
      setDeletingId(null);
    }
  };

  const getTypeLabel = (type: string | null | undefined) => {
    switch (type) {
      case 'surat_keterangan_usaha': return 'Ket. Usaha';
      case 'surat_keterangan_tidak_mampu': return 'Tidak Mampu';
      case 'surat_keterangan_pengantar': return 'Pengantar';
      default: return type || 'Unknown';
    }
  };

  const getTypeVariant = (type: string | null | undefined) => {
    switch (type) {
      case 'surat_keterangan_usaha': return 'default';
      case 'surat_keterangan_tidak_mampu': return 'destructive';
      case 'surat_keterangan_pengantar': return 'secondary';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID'); // Use Indonesian locale
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Doc. No.</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Applicant</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.map((cert) => (
            <TableRow key={cert.id}>
              <TableCell className="font-medium">{cert.id}</TableCell>
              <TableCell className="font-medium max-w-xs truncate">{cert.documentNumber}</TableCell>
              <TableCell>
                <Badge variant={getTypeVariant(cert.certificateType)}>
                  {getTypeLabel(cert.certificateType)}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{cert.applicantName}</TableCell>
              <TableCell>{formatDate(cert.createdAt)}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="ghost" size="icon">
                  <Link href={`/dashboard/certificates/${cert.id}`}> {/* View Detail (optional page) */}
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Link>
                </Button>
                {/* Edit might not be necessary if generated */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the certificate &quot;{cert.documentNumber}&quot; for {cert.applicantName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(cert.id)}
                        disabled={deletingId === cert.id}
                      >
                        {deletingId === cert.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
          {certificates.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                No certificates found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
