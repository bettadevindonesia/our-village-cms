"use server";

import { db } from '@/lib/db';
import { settings } from 'db/schema';
import { asc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Define a type for the setting data based on the schema
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

/**
 * Fetches all settings from the database.
 * @returns A promise that resolves to an array of settings.
 */
export async function getAllSettings(): Promise<Setting[]> {
  try {
    // Fetch settings, ordered by ID or key
    const result = await db.select().from(settings).orderBy(asc(settings.settingKey));
    return result;
  } catch (error: unknown) {
    console.error("Error fetching settings:", error);
    return []; // Return empty array on error
  }
}

/**
 * Fetches a single setting by its ID.
 * @param id The ID of the setting to fetch.
 * @returns A promise that resolves to the setting or null if not found.
 */
export async function getSettingById(id: number): Promise<Setting | null> {
  try {
    const result = await db.select().from(settings).where(eq(settings.id, id)).limit(1);
    return result[0] || null;
  } catch (error: unknown) {
    console.error(`Error fetching setting with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a single setting by its key.
 * @param key The key of the setting to fetch.
 * @returns A promise that resolves to the setting or null if not found.
 */
export async function getSettingByKey(key: string): Promise<Setting | null> {
  try {
    const result = await db.select().from(settings).where(eq(settings.settingKey, key)).limit(1);
    return result[0] || null;
  } catch (error: unknown) {
    console.error(`Error fetching setting with key ${key}:`, error);
    return null;
  }
}


/**
 * Creates a new setting in the database.
 * @param newSetting The data for the new setting.
 * @returns A promise that resolves to the created setting or null on error.
 */
export async function createSetting(newSetting: NewSetting): Promise<Setting | null> {
  try {
    // Check if a setting with the same key already exists
    const existingSetting = await getSettingByKey(newSetting.settingKey);
    if (existingSetting) {
        throw new Error(`Setting with key '${newSetting.settingKey}' already exists.`);
    }

    const result = await db.insert(settings).values(newSetting).returning();
    revalidatePath('/dashboard/settings'); // Refresh the settings list page
    return result[0];
  } catch (error: unknown) {
    console.error("Error creating setting:", error);
    // Re-throw to handle in the action/component
    throw error;
  }
}

/**
 * Updates an existing setting in the database.
 * @param id The ID of the setting to update.
 * @param updatedSetting The data to update the setting with.
 * @returns A promise that resolves to the updated setting or null on error.
 */
export async function updateSetting(id: number, updatedSetting: Partial<NewSetting>): Promise<Setting | null> {
  try {
    // Check if updating the key and if the new key already exists for another setting
    if (updatedSetting.settingKey) {
        const existingSetting = await getSettingByKey(updatedSetting.settingKey);
        if (existingSetting && existingSetting.id !== id) {
             throw new Error(`Setting with key '${updatedSetting.settingKey}' already exists.`);
        }
    }

    const result = await db.update(settings).set(updatedSetting).where(eq(settings.id, id)).returning();
    revalidatePath('/dashboard/settings'); // Refresh the settings list page
    // Optionally, revalidate the specific setting page if you have one: revalidatePath(`/dashboard/settings/${id}`);
    return result[0] || null;
  } catch (error: unknown) {
    console.error(`Error updating setting with ID ${id}:`, error);
     // Re-throw to handle in the action/component
    throw error;
  }
}

/**
 * Deletes a setting from the database.
 * @param id The ID of the setting to delete.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function deleteSetting(id: number): Promise<boolean> {
  try {
    await db.delete(settings).where(eq(settings.id, id));
    revalidatePath('/dashboard/settings'); // Refresh the settings list page
    return true;
  } catch (error: unknown) {
    console.error(`Error deleting setting with ID ${id}:`, error);
    // Handle foreign key constraints if setting is referenced elsewhere (unlikely for settings)
    // if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
    //     // return { error: 'Cannot delete setting: It is associated with other data.' };
    // }
    return false;
  }
}
