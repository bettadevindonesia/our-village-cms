"use client";

import { updateProfileAction } from '@/app/actions/profile'; // We'll create this action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CurrentSessionProps } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner'; // Assuming you use sonner

interface UpdateProfileFormProps {
  user: CurrentSessionProps;
}

export function UpdateProfileForm({ user }: UpdateProfileFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;

    if (!fullName.trim() || !email.trim() || !username.trim()) {
      toast.error("All fields are required.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await updateProfileAction({ fullName, email, username });
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Profile updated successfully!");
          // Optionally, refresh the page or update context/state
          router.refresh(); // This might trigger a refetch of session data if getCurrentUser is called again
        }
      } catch (err) {
        console.error("Unexpected error updating profile:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" value={user.username} disabled />
        <p className="text-xs text-muted-foreground">Username cannot be changed.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" value={user.email} disabled />
        <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={user.fullName}
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
