"use server";

import { db } from '@/lib/db';
import { announcements } from 'db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Define a type for the announcement data based on the schema
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

/**
 * Fetches all announcements from the database.
 * @returns A promise that resolves to an array of announcements.
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  try {
    // Fetch announcements, ordered by ID descending (newest first) or by published date
    const result = await db.select().from(announcements).orderBy(desc(announcements.id));
    return result;
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches a single announcement by its ID.
 * @param id The ID of the announcement to fetch.
 * @returns A promise that resolves to the announcement or null if not found.
 */
export async function getAnnouncementById(id: number): Promise<Announcement | null> {
  try {
    const result = await db.select().from(announcements).where(eq(announcements.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching announcement with ID ${id}:`, error);
    return null;
  }
}

/**
 * Creates a new announcement in the database.
 * @param newAnnouncement The data for the new announcement.
 * @returns A promise that resolves to the created announcement or null on error.
 */
export async function createAnnouncement(newAnnouncement: NewAnnouncement): Promise<Announcement | null> {
  try {
    const result = await db.insert(announcements).values(newAnnouncement).returning();
    revalidatePath('/dashboard/announcements'); // Refresh the announcements list page
    return result[0];
  } catch (error) {
    console.error("Error creating announcement:", error);
    return null;
  }
}

/**
 * Updates an existing announcement in the database.
 * @param id The ID of the announcement to update.
 * @param updatedAnnouncement The data to update the announcement with.
 * @returns A promise that resolves to the updated announcement or null on error.
 */
export async function updateAnnouncement(id: number, updatedAnnouncement: Partial<NewAnnouncement>): Promise<Announcement | null> {
  try {
    const result = await db.update(announcements).set(updatedAnnouncement).where(eq(announcements.id, id)).returning();
    revalidatePath('/dashboard/announcements'); // Refresh the announcements list page
    // Optionally, revalidate the specific announcement page if you have one: revalidatePath(`/dashboard/announcements/${id}`);
    return result[0] || null;
  } catch (error) {
    console.error(`Error updating announcement with ID ${id}:`, error);
    return null;
  }
}

/**
 * Deletes an announcement from the database.
 * @param id The ID of the announcement to delete.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function deleteAnnouncement(id: number): Promise<boolean> {
  try {
    await db.delete(announcements).where(eq(announcements.id, id));
    revalidatePath('/dashboard/announcements'); // Refresh the announcements list page
    return true;
  } catch (error) {
    console.error(`Error deleting announcement with ID ${id}:`, error);
    // Handle foreign key constraints if announcement is referenced elsewhere (unlikely for announcements)
    // if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
    //     // return { error: 'Cannot delete announcement: It is associated with other data.' };
    // }
    return false;
  }
}
