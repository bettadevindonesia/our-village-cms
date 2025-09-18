"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { CardDescription, CardTitle } from "../ui/card";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function EventHeader() {
  const { t } = useTranslation("event");

  return (
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </div>
      <Button asChild size="sm" className="ml-auto gap-1">
        <Link href="/dashboard/events/new">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {t("addEvent")}
          </span>
        </Link>
      </Button>
    </div>
  );
}
