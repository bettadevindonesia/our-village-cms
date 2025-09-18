"use client";

import { Skeleton } from "./ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 p-4 border-r space-y-4">
        <Skeleton className="h-10 w-40" /> {/* logo */}
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-8 w-1/2" />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Top bar */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-10 rounded-full" /> {/* avatar */}
        </div>

        {/* Dashboard cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>

        {/* Table/list placeholder */}
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
