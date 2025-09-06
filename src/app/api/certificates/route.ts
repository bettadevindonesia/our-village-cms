import { db } from '@/lib/db'; // Import your Drizzle DB instance
import { certificates, documentSequences } from 'db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define a Zod schema for request validation (adjust based on your form data structure)
// This should match the structure sent by your external generator app
const CertificateSchema = z.object({
  certificateType: z.enum(['surat_keterangan_usaha', 'surat_keterangan_tidak_mampu', 'surat_keterangan_pengantar']).nullable(), // Allow null/undefined if not always sent
  applicantName: z.string().min(1),
  placeOfBirth: z.string().min(1),
  dateOfBirth: z.string(), // Assuming ISO date string from input type="date"
  occupation: z.string().min(1),
  address: z.string().min(1),
  businessName: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  businessAddress: z.string().nullable().optional(),
  businessYears: z.string().nullable().optional(), // Keep as string if that's how it's sent
  rtRwLetterNumber: z.string().min(1),
  rtRwLetterDate: z.string(), // Assuming ISO date string
  gender: z.string().nullable().optional(),
  religion: z.string().nullable().optional(),
  purpose: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  familyCardNumber: z.string().nullable().optional(),
  nationalIdNumber: z.string().nullable().optional(),
  validFromDate: z.string().nullable().optional(), // Assuming ISO date string
  remarks: z.string().nullable().optional(),
  documentNumber: z.string().min(1), // The generated document number
  // Add other fields if necessary, like createdBy if you want to track the user
});

// Type for the validated data
type ValidatedCertificateData = z.infer<typeof CertificateSchema>;

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate the request (Optional but recommended)
    const authorization = request.headers.get('Authorization'); // Example: Bearer token
    const token = authorization?.split(' ')[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (token !== process.env.API_TOKEN) { // Use a secure method to validate the token
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Parse JSON body
    const body = await request.json();

    // 3. Validate the request body
    const validatedData: ValidatedCertificateData = CertificateSchema.parse(body);

    // 4. Prepare data for insertion matching the Drizzle schema
    //    Map the incoming keys (camelCase from JS) to the schema keys (snake_case in DB)
    const certificateDataToInsert = {
      certificateType: validatedData.certificateType,
      applicantName: validatedData.applicantName,
      placeOfBirth: validatedData.placeOfBirth,
      dateOfBirth: validatedData.dateOfBirth,
      occupation: validatedData.occupation ?? "Unemployed",
      address: validatedData.address,
      businessName: validatedData.businessName ?? null,
      businessType: validatedData.businessType ?? null,
      businessAddress: validatedData.businessAddress ?? null,
      businessYears: validatedData.businessYears ?? null,
      rtRwLetterNumber: validatedData.rtRwLetterNumber,
      rtRwLetterDate: validatedData.rtRwLetterDate,
      gender: validatedData.gender ?? null,
      religion: validatedData.religion ?? null,
      purpose: validatedData.purpose ?? null,
      nationality: validatedData.nationality ?? null,
      familyCardNumber: validatedData.familyCardNumber ?? null,
      nationalIdNumber: validatedData.nationalIdNumber ?? null,
      validFromDate: validatedData.validFromDate ?? null,
      remarks: validatedData.remarks ?? null,
      documentNumber: validatedData.documentNumber,
    };

    // 5. Insert into the database
    const result = await db.insert(certificates).values(certificateDataToInsert).returning({ id: certificates.id });
    await db.update(documentSequences).set({ currentNumber: result[0].id }).where(eq(documentSequences.certificateType, validatedData.certificateType || 'unknown'));

    // 6. Return success response
    return NextResponse.json({ message: 'Certificate saved successfully', id: result[0].id }, { status: 201 });

  } catch (error) {
    console.error("API Error saving certificate:", error);

    // 7. Handle validation errors
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request data', details: (error as z.ZodError).issues }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 8. Handle database errors
    if (error instanceof Error && error.message.includes('Database')) {
      return new NextResponse(JSON.stringify({ error: 'Database error', details: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 9. Return generic error
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// export const GET = async () => new NextResponse('Method Not Allowed', { status: 405 });
// export const OPTIONS = async () => new NextResponse(null, { status: 204 });
// export const PUT = async () => new NextResponse('Method Not Allowed', { status: 405 });
// export const DELETE = async () => new NextResponse('Method Not Allowed', { status: 405 });