"use client";

import { SidebarProvider, useSidebar } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

function DashboardContent({ children }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300 min-h-screen",
          // Mobile: no offset (sidebar is a drawer overlay)
          "ml-0",
          // Desktop: offset by sidebar width
          collapsed ? "lg:ml-[64px]" : "lg:ml-[240px]"
        )}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-[1440px]">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  );
}
