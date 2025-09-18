"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { users, userSessions } from "db/schema";
import { createSession, generateSessionToken } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = userResult[0];

    if (!user || !user.passwordHash) {
      return { error: "Invalid credentials" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    const sessionToken = generateSessionToken();
    const sessionExpiry = Date.now() + 1000 * 60 * 60 * 24 * 7;

    await createSession(db, {
      userId: user.id,
      expiresAt: sessionExpiry,
      id: sessionToken,
    });

    (await cookies()).set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Specific error message:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { error: errorMessage };
  }
}

export async function signupAction(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!fullName || !username || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    const existingUserResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUserResult.length > 0) {
      return { error: "An account with this email already exists." };
    }

    const existingUsernameResult = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsernameResult.length > 0) {
      return { error: "This username is already taken." };
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUserResult = await db
      .insert(users)
      .values({
        fullName,
        username,
        email,
        passwordHash,
        role: "admin",

        emailVerified: true,
      })
      .returning({ id: users.id });

    const newUserId = newUserResult[0].id;

    const sessionToken = generateSessionToken();
    const sessionExpiryInSeconds = Math.floor(
      (Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000
    );

    await createSession(db, {
      id: sessionToken,
      userId: newUserId,
      expiresAt: sessionExpiryInSeconds,
    });

    (await cookies()).set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Specific error message:", error);

    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return { error: errorMessage };
  }
}

/**
 * Server action to handle user logout.
 * Clears the session cookie and redirects to the login page.
 * Optionally deletes the session record from the database.
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (sessionToken) {
    try {
      await db.delete(userSessions).where(eq(userSessions.id, sessionToken));
    } catch (error: unknown) {
      console.error("Specific error message:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      return { error: errorMessage };
    }
  }

  cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });

  return redirect("/");
}
