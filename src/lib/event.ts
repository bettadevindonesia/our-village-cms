"use server";

import { db } from "@/lib/db";
import { events } from "db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

/**
 * Fetches all events from the database.
 * @returns A promise that resolves to an array of events.
 */
export async function getAllEvents(): Promise<Event[]> {
  try {
    const result = await db
      .select()
      .from(events)
      .orderBy(desc(events.eventDate));
    return result;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Fetches a single event by its ID.
 * @param id The ID of the event to fetch.
 * @returns A promise that resolves to the event or null if not found.
 */
export async function getEventById(id: number): Promise<Event | null> {
  try {
    const result = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
    return null;
  }
}

/**
 * Creates a new event in the database.
 * @param newEvent The data for the new event.
 * @returns A promise that resolves to the created event or null on error.
 */
export async function createEvent(newEvent: NewEvent): Promise<Event | null> {
  try {
    const result = await db.insert(events).values(newEvent).returning();
    revalidatePath("/dashboard/events");
    return result[0];
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}

/**
 * Updates an existing event in the database.
 * @param id The ID of the event to update.
 * @param updatedEvent The data to update the event with.
 * @returns A promise that resolves to the updated event or null on error.
 */
export async function updateEvent(
  id: number,
  updatedEvent: Partial<NewEvent>
): Promise<Event | null> {
  try {
    const result = await db
      .update(events)
      .set(updatedEvent)
      .where(eq(events.id, id))
      .returning();
    revalidatePath("/dashboard/events");

    return result[0] || null;
  } catch (error) {
    console.error(`Error updating event with ID ${id}:`, error);
    return null;
  }
}

/**
 * Deletes an event from the database.
 * @param id The ID of the event to delete.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
export async function deleteEvent(id: number): Promise<boolean> {
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath("/dashboard/events");
    return true;
  } catch (error) {
    console.error(`Error deleting event with ID ${id}:`, error);

    return false;
  }
}
