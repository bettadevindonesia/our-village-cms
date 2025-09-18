"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AnnouncementTable, AnnouncementTableProps } from "./announcement-table";
import { useTranslation } from "node_modules/react-i18next";

export default function AnnouncementCard({ announcements }: AnnouncementTableProps) {
    const { t } = useTranslation("announcement");

    return (
        <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("description")}</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/announcements/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t("button.add")}
                </span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <AnnouncementTable announcements={announcements} />
        </CardContent>
      </Card>
    </div>
    );
}