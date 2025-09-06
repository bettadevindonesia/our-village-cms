// src/components/officials/edit-official-form.tsx
"use client";

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { updateOfficial } from '@/lib/official'; // Import update action
import Link from 'next/link';
import { toast } from 'sonner'; // Assuming you have sonner or similar for toasts
import type { Official } from '@/lib/official';

export default function EditOfficialForm({ official }: { official: Official }) {
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
    const isActive = isActiveRaw === 'on' ? 1 : 0; // Map to SQLite integer boolean

    // Basic validation
    if (!name.trim() || !position.trim()) {
      toast.error("Name and position are required.");
      return;
    }

    startTransition(async () => {
      try {
        const updatedData = {
          name,
          position,
          description,
          isActive, // Use the integer value
          // updatedAt is handled by default CURRENT_TIMESTAMP
        };

        const result = await updateOfficial(official.id, updatedData);
        if (result) {
          toast.success("Official updated successfully.");
          router.push('/dashboard/officials'); // Redirect on success
          router.refresh(); // Optional: refresh cache
        } else {
          toast.error("Failed to update official.");
        }
      } catch (err) {
        console.error("Unexpected error during official update:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={official.id} /> {/* Hidden ID field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Full Name"
          required
          defaultValue={official.name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">Position *</Label>
        <Input
          id="position"
          name="position"
          placeholder="Official Position"
          required
          defaultValue={official.position}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description or bio..."
          rows={3}
          defaultValue={official.description ?? ''}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          name="is_active"
          defaultChecked={
            typeof official.isActive === 'number'
              ? official.isActive === 1
              : official.isActive === true
          }
        />
        <Label htmlFor="is_active">Active</Label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/officials">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Updating...' : 'Update Official'}
        </Button>
      </div>
    </form>
  );
}
