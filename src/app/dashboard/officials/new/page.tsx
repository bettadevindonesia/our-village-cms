"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { createOfficial } from '@/lib/official'; // Import create action
import Link from 'next/link';
import { toast } from 'sonner'; // Assuming you have sonner or similar for toasts

export default function NewOfficialPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const description = formData.get('description') as string || null;
    // Handle isActive switch (value is "on" if checked)
    const isActiveRaw = formData.get('is_active');
    const isActive = isActiveRaw === 'on'; // Use boolean for isActive

    // Basic validation
    if (!name.trim() || !position.trim()) {
      toast.error("Name and position are required.");
      return;
    }

    startTransition(async () => {
      try {
        const newOfficial = {
          name,
          position,
          description,
          isActive, // Use boolean value
          // createdAt is handled by default CURRENT_TIMESTAMP
        };

        const result = await createOfficial(newOfficial);
        if (result) {
          toast.success("Official created successfully.");
          router.push('/dashboard/officials'); // Redirect on success
          router.refresh(); // Optional: refresh cache
        } else {
          toast.error("Failed to create official.");
        }
      } catch (err) {
        console.error("Unexpected error during official creation:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Official</CardTitle>
          <CardDescription>Enter details for the new village official.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" placeholder="Full Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input id="position" name="position" placeholder="Official Position" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Brief description or bio..." rows={3} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" name="is_active" defaultChecked />
              <Label htmlFor="is_active">Active</Label>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/officials">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Official'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
