"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { users, userSessions } from "db/schema";
import { and, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// --- Update Profile Action ---
interface UpdateProfileData {
  fullName: string;
  email: string;
  username: string;
}

export async function updateProfileAction(data: UpdateProfileData) {
  // 1. Get User ID from Session (Server-side)
  // This is a simplified way. You might have a more robust getCurrentUserServerAction helper.
  // Or pass userId explicitly if validating ownership elsewhere.
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { error: "Unauthorized: No session token found." };
  }

  try {
    // 2. Validate session and get user ID (simplified)
    // In practice, you'd validate the session against the DB like in middleware/getCurrentUser
    // For brevity, let's assume session is valid and get user ID.
    // A better approach is to pass userId from the client component after verifying it matches the session user,
    // or have a robust getCurrentUser helper for server actions.
    // Let's fetch the user ID based on the session token.
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const sessionResult = await db
      .select({ userId: userSessions.userId })
      .from(userSessions)
      .where(
        and(
          eq(userSessions.id, sessionToken),
          gt(userSessions.expiresAt, currentTimeInSeconds)
        )
      )
      .limit(1);

    const session = sessionResult[0];
    if (!session) {
      return { error: "Unauthorized: Invalid or expired session." };
    }
    const userId = session.userId;

    // 3. Update user data in the database
    await db
      .update(users)
      .set({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        // updatedAt will be updated by default CURRENT_TIMESTAMP
      })
      .where(eq(users.id, userId));

    // 4. Revalidate relevant paths
    revalidatePath("/dashboard/profile");
    // If fullName is displayed elsewhere and cached, revalidate those paths too

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

// --- Change Password Action ---
interface ChangePasswordData {
  userId: number; // Expecting the user ID, ideally verified server-side
  currentPassword: string;
  newPassword: string;
}

export async function changePasswordAction(data: ChangePasswordData) {
  const { userId, currentPassword, newPassword } = data;

  // 1. Basic validation (server-side)
  if (!userId || !currentPassword || !newPassword) {
    return { error: "Missing required fields." };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long." };
  }

  try {
    // 2. Fetch the user's current password hash from the database
    const userResult = await db
      .select({ passwordHash: users.passwordHash, email: users.email }) // Get email for potential error message context
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];
    if (!user || !user.passwordHash) {
      return { error: "User not found or password not set." }; // Shouldn't happen for logged-in users
    }

    // 3. Verify the provided current password against the stored hash
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    // 4. Hash the new password
    const saltRounds = 10; // Use the same salt rounds as signup
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // 5. Update the password hash in the database
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        // updatedAt will be updated by default CURRENT_TIMESTAMP
      })
      .where(eq(users.id, userId));

    // 6. Optional: Invalidate all existing sessions for this user for security
    // This forces the user to log in again on all devices.
    // await db.delete(userSessions).where(eq(userSessions.userId, userId));
    // Then, you would typically redirect them to login or create a new session.
    // For simplicity, we'll just update the password.

    // 7. Revalidate relevant paths
    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password. Please try again." };
  }
}
