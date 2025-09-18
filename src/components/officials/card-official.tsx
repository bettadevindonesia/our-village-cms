"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { PlusCircle } from "lucide-react";
import { OfficialTable, OfficialTableProps } from "./official-table";
import { useTranslation } from "react-i18next";

export default function CardOfficial({ officials }: { officials: OfficialTableProps["officials"] }) {
  const { t } = useTranslation("official");
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
              <Link href="/dashboard/officials/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {t("addOfficial")}
                </span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <OfficialTable officials={officials} />
        </CardContent>
      </Card>
    </div>
  );
}