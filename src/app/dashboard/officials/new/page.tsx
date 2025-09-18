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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createOfficial } from "@/lib/official";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function NewOfficialPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslation("official");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const position = formData.get("position") as string;
    const description = (formData.get("description") as string) || null;

    const isActiveRaw = formData.get("is_active");
    const isActive = isActiveRaw === "on";

    if (!name.trim() || !position.trim()) {
      toast.error(t("form.error.requiredFields"));
      return;
    }

    startTransition(async () => {
      try {
        const newOfficial = {
          name,
          position,
          description,
          isActive,
        };

        const result = await createOfficial(newOfficial);
        if (result) {
          toast.success(t("form.success.officialCreated"));
          router.push("/dashboard/officials");
          router.refresh();
        } else {
          toast.error(t("form.error.failedToCreateOfficial"));
        }
      } catch (err) {
        console.error("Unexpected error during official creation:", err);
        toast.error(t("form.error.unexpected"));
      }
    });
  };

  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.cardTitle")}</CardTitle>
          <CardDescription>
            {t("form.cardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t("form.name")} *</Label>
              <Input id="name" name="name" placeholder={t("form.namePlaceholder")} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">{t("form.position")} *</Label>
              <Input
                id="position"
                name="position"
                placeholder={t("form.positionPlaceholder")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("form.description")}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("form.descriptionPlaceholder")}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" name="is_active" defaultChecked />
              <Label htmlFor="is_active">{t("form.isActive")}</Label>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/officials">{t("form.cancel")}</Link>
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("form.creating") : t("form.createOfficial")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
// ...existing code...
