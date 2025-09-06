// src/app/dashboard/certificates/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CertificateTable } from '@/components/certificates/certificate-table'; // We'll create this
import { getAllCertificates } from '@/lib/certificate'; // We'll create this data fetching utility

// Server Component to fetch certificates
export default async function CertificatesPage() {
  const certificates = await getAllCertificates(); // Fetch data server-side

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Certificates</CardTitle>
              <CardDescription>Manage generated certificates.</CardDescription>
            </div>
            {/* Add actions like "Generate New" if integrated directly, or just view/manage */}
            {/* <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/certificates/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Generate New</span>
              </Link>
            </Button> */}
          </div>
        </CardHeader>
        <CardContent>
          <CertificateTable certificates={certificates} />
        </CardContent>
      </Card>
    </div>
  );
}
