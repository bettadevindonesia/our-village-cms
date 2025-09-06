import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { logoutAction } from "../actions/auth";
import { Button } from "@/components/ui/button";

export default async function Page() {
    const user = await getCurrentUser();

    // 1. Check if user is authenticated
    if (!user) {
        // Redirect to login if not authenticated
        redirect('/');
    }

    return (
        <div className="min-h-screen bg-background p-6 md:p-10">
            <div className="mx-auto max-w-4xl space-y-2">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                <form action={logoutAction}>
                    <Button type="submit" variant="outline"> {/* Use appropriate variant */}
                        Logout
                    </Button>
                </form>
                <div className="bg-card border rounded-lg shadow-sm p-6">
                    <h2 className="text-2xl font-semibold mb-4">Welcome, {user.fullName}!</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-muted-foreground">Username</p>
                            <p className="font-medium">{user.username}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Email</p>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Role</p>
                            <p className="font-medium capitalize">{user.role}</p> {/* Capitalize role for better display */}
                        </div>
                        <div>
                            <p className="text-muted-foreground">User ID</p>
                            <p className="font-medium">{user.id}</p>
                        </div>
                        {/* Add more user details here if needed */}
                    </div>
                </div>
                {/* Add more dashboard content here */}
            </div>
        </div>
    );
}
