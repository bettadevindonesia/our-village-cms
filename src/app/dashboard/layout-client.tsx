"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "@/components/user-preferences";
import { CurrentSessionProps } from "@/lib/session";
import { ReactNode } from 'react';

// This is now a Client Component that receives props
export default function DashboardLayoutClient({
  children,
  user, // Receive the user prop
}: {
  children: ReactNode;
  user: CurrentSessionProps | null
}) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="sticky top-0 bg-background p-2 border-b z-10 flex justify-between items-center"> {/* Added items-center */}
          <SidebarTrigger />
          <div>
            {/* Pass the user prop to UserDropdown */}
            <UserDropdown userInfo={user} />
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}