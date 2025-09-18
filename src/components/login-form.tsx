"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
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
import { loginAction } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./language-switcher";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation("login");

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await loginAction(formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setError(null);
        redirect("/dashboard");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle suppressHydrationWarning>{t("login.title")}</CardTitle>
          <CardDescription suppressHydrationWarning>
            {t("login.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email" suppressHydrationWarning>
                {t("login.email")}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-3">
              <div className="flex items-center">
                <Label htmlFor="password" suppressHydrationWarning>
                  {t("login.password")}
                </Label>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <span suppressHydrationWarning>
                    {t("login.buttonLoading")}
                  </span>
                ) : (
                  <span suppressHydrationWarning>{t("login.button")}</span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <LanguageSwitcher className="fixed top-4 right-4" />
    </div>
  );
}
