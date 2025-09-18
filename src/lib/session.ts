import { users, userSessions } from "db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { and, eq, gt } from "drizzle-orm";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { cookies } from "next/headers";
import { db } from "./db";

export type UserSession = InferSelectModel<typeof userSessions>;
export type NewUserSession = InferInsertModel<typeof userSessions>;

export interface CurrentSessionProps {
  id: number;
  role: "admin" | "official" | "staff" | "user" | null;
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
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
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
  dbClient: LibSQLDatabase<Record<string, never>>,
  sessionData: NewUserSession
): Promise<UserSession> {
  try {
    const result = await dbClient
      .insert(userSessions)
      .values(sessionData)
      .returning();

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
export async function deleteSession(token: string): Promise<void> {
  try {
    await db.delete(userSessions).where(eq(userSessions.id, token));
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
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    const sessionResult = await db
      .select({
        userId: userSessions.userId,
        role: users.role,
        fullName: users.fullName,
        email: users.email,
        username: users.username,
        isActive: users.isActive,
      })
      .from(userSessions)
      .innerJoin(users, eq(userSessions.userId, users.id))
      .where(
        and(
          eq(userSessions.id, sessionToken),
          gt(userSessions.expiresAt, currentTimeInSeconds)
        )
      )
      .limit(1);

    const session = sessionResult[0];

    if (!session || !session.isActive) {
      return null;
    }

    return {
      id: session.userId,
      role: session.role,
      fullName: session.fullName,
      email: session.email,
      username: session.username,
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
