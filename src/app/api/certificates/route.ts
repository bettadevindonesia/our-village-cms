import { db } from "@/lib/db";
import { certificates, documentSequences } from "db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CertificateSchema = z.object({
  certificateType: z
    .enum([
      "surat_keterangan_usaha",
      "surat_keterangan_tidak_mampu",
      "surat_keterangan_pengantar",
    ])
    .nullable(),
  applicantName: z.string().min(1),
  placeOfBirth: z.string().min(1),
  dateOfBirth: z.string(),
  occupation: z.string().min(1),
  address: z.string().min(1),
  businessName: z.string().nullable().optional(),
  businessType: z.string().nullable().optional(),
  businessAddress: z.string().nullable().optional(),
  businessYears: z.string().nullable().optional(),
  rtRwLetterNumber: z.string().min(1),
  rtRwLetterDate: z.string(),
  gender: z.string().nullable().optional(),
  religion: z.string().nullable().optional(),
  purpose: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  familyCardNumber: z.string().nullable().optional(),
  nationalIdNumber: z.string().nullable().optional(),
  validFromDate: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
  documentNumber: z.string().min(1),
});

type ValidatedCertificateData = z.infer<typeof CertificateSchema>;

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1];

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (token !== process.env.API_TOKEN) {
      return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();

    const validatedData: ValidatedCertificateData =
      CertificateSchema.parse(body);

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

    const result = await db
      .insert(certificates)
      .values(certificateDataToInsert)
      .returning({ id: certificates.id });
    await db
      .update(documentSequences)
      .set({ currentNumber: result[0].id })
      .where(
        eq(
          documentSequences.certificateType,
          validatedData.certificateType || "unknown"
        )
      );

    return NextResponse.json(
      { message: "Certificate saved successfully", id: result[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error saving certificate:", error);

    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid request data",
          details: (error as z.ZodError).issues,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error && error.message.includes("Database")) {
      return new NextResponse(
        JSON.stringify({ error: "Database error", details: error.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
