"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSetting } from "@/lib/setting";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function NewSettingPage() {
  
  const { t } = useTranslation("setting");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
        const newSetting = {
          settingKey,
          settingValue,
          description,
        };

        const result = await createSetting(newSetting);
        if (result) {
          toast.success(t("success.created"));
          router.push("/dashboard/settings");
          router.refresh();
        } else {
          toast.error(t("error.create"));
        }
      } catch (err) {
        console.error("Error during setting creation:", err);
        if (err instanceof Error) {
          setError(err.message);
          toast.error(err.message);
        } else {
          setError(t("error.unexpected"));
          toast.error(t("error.unexpected"));
        }
      }
    });
  };

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.createTitle")}</CardTitle>
          <CardDescription>
            {t("form.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="setting_key">{t("form.keyLabel")}</Label>
              <Input
                id="setting_key"
                name="setting_key"
                placeholder={t("form.keyPlaceholder")}
                required
              />
              <p className="text-xs text-muted-foreground">{t("form.keyHelp")}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="setting_value">{t("form.valueLabel")}</Label>
              <Input
                id="setting_value"
                name="setting_value"
                placeholder={t("form.valuePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("form.descriptionLabel")}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("form.descriptionPlaceholder")}
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/settings">{t("form.cancel")}</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.creating") : t("form.createButton")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
