"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/app/i18n";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n: i18nextInstance } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18nextInstance.language === "en" ? "id" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <Button onClick={toggleLanguage} variant="outline" size="default" className={className}>
      <Languages className="mr-2 h-4 w-4" />
      {i18nextInstance.language === "en" ? "ID" : "EN"}
    </Button>
  );
}
