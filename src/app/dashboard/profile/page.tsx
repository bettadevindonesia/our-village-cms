import { ChangePasswordForm } from "@/components/profile/change-password-form";
import { ProfileDetails } from "@/components/profile/profile-details";
import { UpdateProfileForm } from "@/components/profile/update-profile-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Manage your profile information and account settings.
        </p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProfileDetails user={user} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
              <CardDescription>
                Change your profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateProfileForm user={user} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your password.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm userId={user.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
