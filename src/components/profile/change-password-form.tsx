"use client";

import { changePasswordAction } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ChangePasswordFormProps {
  userId: number;
}

export function ChangePasswordForm({ userId }: ChangePasswordFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await changePasswordAction({
          userId,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Password changed successfully!");
          setFormData({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
        }
      } catch (err) {
        console.error("Unexpected error changing password:", err);
        toast.error("An unexpected error occurred.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
        <Input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}
