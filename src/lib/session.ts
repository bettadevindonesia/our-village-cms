import { and, eq, gt, lt } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users, userSessions } from "db/schema";
import { cookies } from "next/headers";
import { db } from "./db";

// Define types based on the schema for better type safety
export type UserSession = InferSelectModel<typeof userSessions>;
export type NewUserSession = InferInsertModel<typeof userSessions>;

export interface CurrentSessionProps {
    id: number;
    role: 'admin' | 'official' | 'staff' | 'user' | null;
    fullName: string;
    email: string;
    username: string;
    createdAt?: string;
}

/**
 * Generates a cryptographically secure random session token.
 * @returns A secure random string suitable for session tokens.
 */
export function generateSessionToken(): string {
    // Use crypto.getRandomValues for generating secure tokens
    const array = new Uint8Array(32); // 256 bits of randomness
    crypto.getRandomValues(array);
    // Convert the byte array to a hexadecimal string
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a new user session in the database.
 *
 * @param dbClient - The Drizzle ORM database client instance.
 * @param sessionData - The data for the new session, including userId, token, and expiresAt.
 * @returns A promise that resolves to the created session object.
 * @throws Will throw an error if the session creation fails.
 */
export async function createSession(
    dbClient: LibSQLDatabase<Record<string, never>>, // Type for the drizzle client
    sessionData: NewUserSession // Type for the data to insert
): Promise<UserSession> {
    try {
        // Insert the new session into the user_sessions table
        const result = await dbClient.insert(userSessions).values(sessionData).returning();
        // Returning the first (and should be only) inserted record
        return result[0];
    } catch (error) {
        console.error("Error creating session:", error);
        throw new Error("Failed to create user session.");
    }
}

/**
 * Deletes a user session by its token.
 *
 * @param token - The session token to delete.
 * @returns A promise that resolves when the session is deleted.
 */
export async function deleteSession(
    token: string
): Promise<void> {
    try {
        await db.delete(userSessions).where(eq(userSessions.id, token)); // 'id' is the token
    } catch (error) {
        console.error("Error deleting session:", error);
        throw new Error("Failed to delete user session.");
    }
}

/**
 * Retrieves the currently authenticated user based on the session cookie.
 * @returns A promise that resolves to the user object or null if not authenticated.
 */
export async function getCurrentUser(): Promise<CurrentSessionProps | null> {
    try {
        // 1. Get the session token from cookies
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;

        if (!sessionToken) {
            return null; // No session token found
        }

        // 2. Validate session against the database
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);

        const sessionResult = await db
            .select({
                userId: userSessions.userId,
                role: users.role,
                fullName: users.fullName,
                email: users.email,
                username: users.username,
                isActive: users.isActive,
                // Add other user fields you want to display
            })
            .from(userSessions)
            .innerJoin(users, eq(userSessions.userId, users.id))
            .where(
                and(
                    eq(userSessions.id, sessionToken),
                    gt(userSessions.expiresAt, currentTimeInSeconds) // Check if not expired
                )
            )
            .limit(1);

        const session = sessionResult[0];

        // 3. Check if session is valid and user is active
        if (!session || !session.isActive) {
            return null; // Invalid or inactive session/user
        }

        // 4. Return user details
        return {
            id: session.userId,
            role: session.role,
            fullName: session.fullName,
            email: session.email,
            username: session.username,
            // Include other relevant fields
        };
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null; // Return null on error
    }
}
