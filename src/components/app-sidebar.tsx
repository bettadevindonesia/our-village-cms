import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import { Calendar, Home, Mail, Medal, Paperclip, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Events",
    url: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Announcements",
    url: "/dashboard/announcements",
    icon: Paperclip,
  },
  {
    title: "Officials",
    url: "/dashboard/officials",
    icon: Medal,
  },
  {
    title: "Certificates",
    url: "/dashboard/certificates",
    icon: Mail,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const pathname = usePathname()
  
  const { t } = useTranslation('sidebar');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="p-1">
              <h1 className={open ? "font-bold text-center" : "hidden"}>DESA DERMOLO</h1>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;
                const title = t(`sidebar.${item.title.toLowerCase()}`, { ns: 'sidebar' }) || (t(`sidebar.${item.title.toLowerCase()}`));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <a href={item.url}>
                        <item.icon />
                        <span suppressHydrationWarning>{title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
