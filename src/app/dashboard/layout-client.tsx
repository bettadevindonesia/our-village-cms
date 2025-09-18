"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-preferences";
import { CurrentSessionProps } from "@/lib/session";
import { ReactNode } from "react";

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: ReactNode;
  user: CurrentSessionProps | null;
}) {
  return (
    <SidebarProvider suppressHydrationWarning>
      <AppSidebar />
      <main className="w-full">
        <div className="sticky top-0 bg-background p-2 border-b z-10 flex justify-between items-center">
          {" "}
          {/* Added items-center */}
          <SidebarTrigger />
          <div className="space-x-2">
            <UserDropdown userInfo={user} />
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
