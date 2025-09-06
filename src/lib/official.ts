"use server";

import { db } from '@/lib/db';
import { officials } from 'db/schema';
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Define a type for the official data based on the schema
export type Official = typeof officials.$inferSelect;
export type NewOfficial = typeof officials.$inferInsert;

/**
 * Fetches all officials from the database.
 * @returns A promise that resolves to an array of officials.
 */
export async function getAllOfficials(): Promise<Official[]> {
  try {
    // Fetch officials, ordered by ID descending (newest first) or by name
    const result = await db.select().from(officials).orderBy(asc(officials.name)); // Order by name alphabetically
    return result;
  } catch (error: unknown) {
    console.error("Error fetching officials:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches a single official by its ID.
 * @param id The ID of the official to fetch.
 * @returns A promise that resolves to the official or null if not found.
 */
export async function getOfficialById(id: number): Promise<Official | null> {
  try {
    const result = await db.select().from(officials).where(eq(officials.id, id)).limit(1);
    return result[0] || null;
  } catch (error: unknown) {
    console.error(`Error fetching official with ID ${id}:`, error);
    return null;
  }
}

/**
 * Creates a new official in the database.
 * @param newOfficial The data for the new official.
 * @returns A promise that resolves to the created official or null on error.
 */
export async function createOfficial(newOfficial: NewOfficial): Promise<Official | null> {
  try {
    const result = await db.insert(officials).values(newOfficial).returning();
    revalidatePath('/dashboard/officials'); // Refresh the officials list page
    return result[0];
  } catch (error: unknown) {
    console.error("Error creating official:", error);
    return null;
  }
}

/**
 * Updates an existing official in the database.
 * @param id The ID of the official to update.
 * @param updatedOfficial The data to update the official with.
 * @returns A promise that resolves to the updated official or null on error.
 */
export async function updateOfficial(id: number, updatedOfficial: Partial<NewOfficial>): Promise<Official | null> {
  try {
    const result = await db.update(officials).set(updatedOfficial).where(eq(officials.id, id)).returning();
    revalidatePath('/dashboard/officials'); // Refresh the officials list page
    // Optionally, revalidate the specific official page if you have one: revalidatePath(`/dashboard/officials/${id}`);
    return result[0] || null;
  } catch (error: unknown) {
    console.error(`Error updating official with ID ${id}:`, error);
    return null;
  }
}

/**
 * Deletes an official from the database.
 * @param id The ID of the official to delete.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function deleteOfficial(id: number): Promise<boolean> {
  try {
    // Check if the official is referenced by other tables (announcements, events, certificates)
    // This requires checking foreign key constraints.
    // For simplicity, we'll attempt the delete and catch potential FK errors.
    // A more robust solution would involve checking related records first.

    await db.delete(officials).where(eq(officials.id, id));
    revalidatePath('/dashboard/officials'); // Refresh the officials list page
    return true;
  } catch (error: unknown) {
    console.error(`Error deleting official with ID ${id}:`, error);
    // Handle foreign key constraints if official is referenced elsewhere
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
        console.warn(`Cannot delete official ID ${id}: Referenced by other data.`);
        // You might want to return a specific error message to display in the UI
        // return { error: 'Cannot delete official: They are associated with announcements, events, or certificates.' };
        return false;
    }
    return false;
  }
}
