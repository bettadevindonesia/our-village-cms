// src/app/dashboard/layout-wrapper.tsx
import { CurrentSessionProps, getCurrentUser } from '@/lib/session'; // Import your utility function
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './layout-client';

// This is a Server Component
export default async function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch user data server-side
  const user: CurrentSessionProps | null = await getCurrentUser();

  // 2. Redirect if not authenticated (good practice, though middleware should also handle this)
  if (!user) {
    redirect('/login');
  }

  // 3. Pass the user data as a prop to the Client Component layout
  // Note: The user object needs to be serializable to be passed as a prop.
  return <DashboardLayoutClient user={user}>{children}</DashboardLayoutClient>;
}