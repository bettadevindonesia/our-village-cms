"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createSetting } from '@/lib/setting'; // Import create action
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner'; // Assuming you have sonner or similar for toasts

export default function NewSettingPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const settingKey = formData.get('setting_key') as string;
    const settingValue = formData.get('setting_value') as string || null;
    const description = formData.get('description') as string || null;

    // Basic validation
    if (!settingKey.trim()) {
      toast.error("Setting key is required.");
      return;
    }

    startTransition(async () => {
      try {
        const newSetting = {
          settingKey,
          settingValue,
          description,
          // updatedAt is handled by default CURRENT_TIMESTAMP
        };

        const result = await createSetting(newSetting);
        if (result) {
          toast.success("Setting created successfully.");
          router.push('/dashboard/settings'); // Redirect on success
          router.refresh(); // Optional: refresh cache
        } else {
          // Should not happen due to throw in lib
          toast.error("Failed to create setting.");
        }
      } catch (err) {
        console.error("Error during setting creation:", err);
        if (err instanceof Error) {
            setError(err.message);
            toast.error(err.message);
        } else {
            setError("An unexpected error occurred.");
            toast.error("An unexpected error occurred.");
        }
      }
    });
  };

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Setting</CardTitle>
          <CardDescription>Enter details for the new application setting.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="setting_key">Setting Key *</Label>
              <Input id="setting_key" name="setting_key" placeholder="Unique setting key (e.g., site_name)" required />
              <p className="text-xs text-muted-foreground">Must be unique.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="setting_value">Setting Value</Label>
              <Input id="setting_value" name="setting_value" placeholder="Value for the setting" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Brief description of the setting..." rows={3} />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/settings">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Setting'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
