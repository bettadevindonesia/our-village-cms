"use client";

import { Setting } from "@/lib/setting";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

import { useTranslation } from "react-i18next";
import { SettingTable } from "./setting-table";

export default function CardSetting({ settings }: { settings: Setting[] }) {
  const { t } = useTranslation("setting");
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>
                {t("description")}
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/settings/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t("add")}
                </span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SettingTable settings={settings} />
        </CardContent>
      </Card>
    </div>
  );
}
