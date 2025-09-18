"use server";

import { db } from "@/lib/db";
import { certificates } from "db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type Certificate = typeof certificates.$inferSelect;
export type NewCertificate = typeof certificates.$inferInsert;

/**
 * Fetches all certificates from the database.
 * @returns A promise that resolves to an array of certificates.
 */
export async function getAllCertificates(): Promise<Certificate[]> {
  try {
    const result = await db
      .select()
      .from(certificates)
      .orderBy(desc(certificates.createdAt));
    return result;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return [];
  }
}

/**
 * Fetches a single certificate by its ID.
 * @param id The ID of the certificate to fetch.
 * @returns A promise that resolves to the certificate or null if not found.
 */
export async function getCertificateById(
  id: number
): Promise<Certificate | null> {
  try {
    const result = await db
      .select()
      .from(certificates)
      .where(eq(certificates.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching certificate with ID ${id}:`, error);
    return null;
  }
}

/**
 * Deletes a certificate from the database.
 * @param id The ID of the certificate to delete.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function deleteCertificate(id: number): Promise<boolean> {
  try {
    await db.delete(certificates).where(eq(certificates.id, id));
    revalidatePath("/dashboard/certificates");
    return true;
  } catch (error) {
    console.error(`Error deleting certificate with ID ${id}:`, error);
    return false;
  }
}
