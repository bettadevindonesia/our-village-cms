"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { Official } from "@/lib/official";
import { updateOfficial } from "@/lib/official";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function EditOfficialForm({ official }: { official: Official }) {
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
        const updatedData = {
          name,
          position,
          description,
          isActive,
        };

        const result = await updateOfficial(official.id, updatedData);
        if (result) {
          toast.success(t("form.success.officialUpdated"));
          router.push("/dashboard/officials");
          router.refresh();
        } else {
          toast.error(t("form.error.failedToUpdateOfficial"));
        }
      } catch (err) {
        console.error("Unexpected error during official update:", err);
        toast.error(t("form.error.unexpected"));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="id" value={official.id} />
      {/* Hidden ID field */}
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.name")} *</Label>
        <Input
          id="name"
          name="name"
          placeholder={t("form.namePlaceholder")}
          required
          defaultValue={official.name}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="position">{t("form.position")} *</Label>
        <Input
          id="position"
          name="position"
          placeholder={t("form.positionPlaceholder")}
          required
          defaultValue={official.position}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("form.description")}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t("form.descriptionPlaceholder")}
          rows={3}
          defaultValue={official.description ?? ""}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          name="is_active"
          defaultChecked={
            typeof official.isActive === "number"
              ? official.isActive === 1
              : official.isActive === true
          }
        />
        <Label htmlFor="is_active">{t("form.isActive")}</Label>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" asChild>
          <Link href="/dashboard/officials">{t("form.cancel")}</Link>
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t("form.updating") : t("form.updateOfficial")}
        </Button>
      </div>
    </form>
  );
}
