import { I18nReady } from "@/components/i18n-loader";
import { CurrentSessionProps, getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import Providers from "../providers";
import DashboardLayoutClient from "./layout-client";
import { DashboardSkeleton } from "@/components/dashboard-skeleton";

export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: CurrentSessionProps | null = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <I18nReady fallback={<DashboardSkeleton />}>
      <DashboardLayoutClient user={user}>
        <Providers>{children}</Providers>
      </DashboardLayoutClient>
    </I18nReady>
  );
}
