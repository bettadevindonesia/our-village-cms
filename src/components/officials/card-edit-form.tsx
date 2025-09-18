"use client";

import { Official } from "@/lib/official";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import EditOfficialForm from "./edit-official-form";
import { useTranslation } from "react-i18next";

export default function CardEditOfficial({ official }: { official: Official }) {
  const { t } = useTranslation("official");
  return (
    <div className="grid gap-6 w-1/2 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.editCardTitle")}</CardTitle>
          <CardDescription>
            {t("form.editCardDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditOfficialForm official={official} />
        </CardContent>
      </Card>
    </div>
  );
}
