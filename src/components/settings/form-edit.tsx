"use client";

import { Setting } from "@/lib/setting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import EditSettingForm from "./edit-setting-form";
import { useTranslation } from "react-i18next";

export default function CardEditSettingForm({ setting }: { setting: Setting }) {
    const { t } = useTranslation("setting");
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.updateTitle")}</CardTitle>
          <CardDescription>
            {t("form.updateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pass data to the client component */}
          <EditSettingForm setting={setting} />
        </CardContent>
      </Card>
    </div>
  );
}
