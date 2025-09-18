"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { users, userSessions } from "db/schema";
import { and, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface UpdateProfileData {
  fullName: string;
  email: string;
  username: string;
}

export async function updateProfileAction(data: UpdateProfileData) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return { error: "Unauthorized: No session token found." };
  }

  try {
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

    await db
      .update(users)
      .set({
        fullName: data.fullName,
        email: data.email,
        username: data.username,
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

interface ChangePasswordData {
  userId: number;
  currentPassword: string;
  newPassword: string;
}

export async function changePasswordAction(data: ChangePasswordData) {
  const { userId, currentPassword, newPassword } = data;

  if (!userId || !currentPassword || !newPassword) {
    return { error: "Missing required fields." };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters long." };
  }

  try {
    const userResult = await db
      .select({ passwordHash: users.passwordHash, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userResult[0];
    if (!user || !user.passwordHash) {
      return { error: "User not found or password not set." };
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );
    if (!isPasswordValid) {
      return { error: "Current password is incorrect." };
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
      })
      .where(eq(users.id, userId));

    revalidatePath("/dashboard/profile");

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password. Please try again." };
  }
}
