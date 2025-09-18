"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Setting } from "@/lib/setting";
import { updateSetting } from "@/lib/setting";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function EditSettingForm({ setting }: { setting: Setting }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation("setting");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const settingKey = formData.get("setting_key") as string;
    const settingValue = (formData.get("setting_value") as string) || null;
    const description = (formData.get("description") as string) || null;

    if (!settingKey.trim()) {
      toast.error(t("form.keyRequired"));
      return;
    }

    startTransition(async () => {
      try {
        const updatedData = {
          settingKey,
          settingValue,
          description,
        };

        const result = await updateSetting(setting.id, updatedData);
        if (result) {
          toast.success(t("form.updateSuccess"));
          router.push("/dashboard/settings");
          router.refresh();
        } else {
          toast.error(t("form.updateError"));
        }
      } catch (err) {
        console.error("Error during setting update:", err);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={setting.id} />{" "}
      {/* Hidden ID field */}
      <div className="space-y-2">
        <Label htmlFor="setting_key">{t("form.keyLabel")}</Label>
        <Input
          id="setting_key"
          name="setting_key"
          placeholder={t("form.keyPlaceholder")}
          required
          defaultValue={setting.settingKey}
          readOnly
        />
        <p className="text-xs text-muted-foreground">
          {t("form.keyHelp")} {t("form.keyReadOnly", "Key is usually read-only after creation.")}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="setting_value">{t("form.valueLabel")}</Label>
        <Input
          id="setting_value"
          name="setting_value"
          placeholder={t("form.valuePlaceholder")}
          defaultValue={setting.settingValue ?? ""}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("form.descriptionLabel")}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t("form.descriptionPlaceholder")}
          rows={3}
          defaultValue={setting.description ?? ""}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/settings">{t("form.cancel")}</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t("form.updating") : t("form.updateButton")}
        </Button>
      </div>
    </form>
  );
}
