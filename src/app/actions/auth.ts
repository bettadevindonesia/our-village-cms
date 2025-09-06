"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs"; // Example hashing library
import { cookies } from "next/headers"; // For setting session cookie
import { users, userSessions } from "db/schema";
import { createSession, generateSessionToken } from "@/lib/session";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    // 1. Find user by email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    const user = userResult[0];

    if (!user || !user.passwordHash) {
      // Assuming passwordHash column exists
      return { error: "Invalid credentials" };
    }

    // 2. Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { error: "Invalid credentials" };
    }

    // 3. Create Session (Example using hypothetical helpers)
    const sessionToken = generateSessionToken(); // Generate a secure random token
    const sessionExpiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 1 week from now, for example

    await createSession(db, {
      userId: user.id,
      expiresAt: sessionExpiry,
      id: sessionToken,
    });

    // 4. Set Session Cookie
    (await cookies()).set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 24 * 7, // Match session expiry
      path: "/",
      sameSite: "lax",
    });

    // 5. Redirect on Success
    return { success: true };
  } catch (error: unknown) {
    // Change 'any' to 'unknown'
    console.error("Specific error message:", error);
    // Type guard to safely access error properties
    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error instanceof Error) {
      // Check if it's an Error instance
      // Now you can safely access 'error.message'
      errorMessage = error.message;
      // Example: Handle specific database errors
      // if (error.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
      //   errorMessage = "A user with this email or username already exists.";
      // }
    }
    // Return the specific error message
    return { error: errorMessage };
  }
}

export async function signupAction(formData: FormData) {
  const fullName = formData.get("full_name") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation (you can add more)
  if (!fullName || !username || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  try {
    // 1. Check if user already exists (email or username)
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

    // 2. Hash the password
    const saltRounds = 10; // You might want to make this configurable via env var
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 3. Insert the new user into the database
    // Default role is 'user' as per schema, isActive is true, emailVerified is false
    const newUserResult = await db
      .insert(users)
      .values({
        fullName,
        username,
        email,
        passwordHash, // Store the hashed password
        role: "admin", // role defaults to 'user'
        // isActive defaults to true
        emailVerified: true, // emailVerified defaults to false
        // createdAt and updatedAt are handled by default CURRENT_TIMESTAMP
      })
      .returning({ id: users.id }); // Get the ID of the newly created user

    const newUserId = newUserResult[0].id;

    // 4. (Optional) Create a session immediately after signup
    // This allows the user to be logged in automatically after signing up.
    // Alternatively, you could redirect to login or require email verification first.
    const sessionToken = generateSessionToken();
    const sessionExpiryInSeconds = Math.floor(
      (Date.now() + 1000 * 60 * 60 * 24 * 7) / 1000
    ); // 1 week

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

    // 5. Return success or redirect
    // Returning success allows the client component to handle UI updates
    // Redirecting would navigate the user immediately
    // Choose one approach. Here, we return success.
    return { success: true };
    // Or redirect immediately: return redirect("/dashboard");
  } catch (error: unknown) {
    // Change 'any' to 'unknown'
    console.error("Specific error message:", error);
    // Type guard to safely access error properties
    let errorMessage = "An unexpected error occurred. Please try again.";
    if (error instanceof Error) {
      // Check if it's an Error instance
      // Now you can safely access 'error.message'
      errorMessage = error.message;
      // Example: Handle specific database errors
      // if (error.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
      //   errorMessage = "A user with this email or username already exists.";
      // }
    }
    // Return the specific error message
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

  // Optional: Delete the session record from the database
  if (sessionToken) {
    try {
      await db.delete(userSessions).where(eq(userSessions.id, sessionToken));
      // console.log("Session deleted from DB");
    } catch (error: unknown) {
      // Change 'any' to 'unknown'
      console.error("Specific error message:", error);
      // Type guard to safely access error properties
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error instanceof Error) {
        // Check if it's an Error instance
        // Now you can safely access 'error.message'
        errorMessage = error.message;
        // Example: Handle specific database errors
        // if (error.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
        //   errorMessage = "A user with this email or username already exists.";
        // }
      }
      // Return the specific error message
      return { error: errorMessage };
    }
  }

  // Clear the session cookie by setting it with an expired maxAge
  cookieStore.set("session_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire the cookie immediately
    path: "/",
    sameSite: "lax",
  });

  // Redirect to the login page (or home page '/')
  return redirect("/");
}
