"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSidebar } from "./sidebar-context";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BookOpen,
  FileText,
  Receipt as ReceiptIcon,
  CalendarCheck,
  Wallet,
  GraduationCap,
  BarChart3,
  ClipboardCheck,
  UserCheck,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  PlusCircle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard",  href: "/dashboard",            icon: LayoutDashboard },
  { name: "Alunos",     href: "/dashboard/alunos",      icon: Users },
  { name: "Matrículas", href: "/dashboard/matriculas",  icon: ClipboardList },
  { name: "Turmas",     href: "/dashboard/turmas",      icon: GraduationCap },
  { name: "Boletins",   href: "/dashboard/boletins",    icon: BookOpen },
  { name: "Frequência", href: "/dashboard/frequencia",  icon: CalendarCheck },
  { name: "Documentos", href: "/dashboard/documentos",  icon: FileText },
  { name: "Financeiro", href: "/dashboard/financeiro",  icon: Wallet },
  { name: "Contratos",  href: "/dashboard/contratos",   icon: ReceiptIcon },
  { name: "Relatórios",    href: "/dashboard/relatorios",             icon: BarChart3 },
  { name: "Semestral",   href: "/dashboard/relatorios-trimestrais", icon: ClipboardCheck },
  { name: "Colaboradores", href: "/dashboard/colaboradores",         icon: UserCheck },
];

const bottomNav = [
  { name: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
];

function NavItem({ item, collapsed, isActive, onClose }) {
  const content = (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "group flex items-center gap-3 rounded-lg text-[13px] font-medium transition-colors duration-150",
        collapsed ? "justify-center p-2.5 mx-2" : "px-3 py-2.5 mx-3",
        isActive
          ? "bg-white/[0.08] text-white"
          : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
      )}
    >
      <div className="relative flex items-center justify-center">
        {isActive && (
          <span className="absolute -left-[19px] w-[3px] h-4 rounded-r-full bg-amber-400" />
        )}
        <item.icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 transition-colors",
            isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-400"
          )}
          strokeWidth={isActive ? 2 : 1.75}
        />
      </div>
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="text-xs font-medium">
          {item.name}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleSidebar, mobileOpen, closeMobile } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobile();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function isActive(href) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  // On mobile: never collapse (always show full)
  const isCollapsed = collapsed && !isMobile;

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeMobile}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen flex flex-col bg-[#0c1222] transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden",
          // Mobile: drawer slide-in
          "w-[240px]",
          isMobile
            ? mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
            : cn("translate-x-0", collapsed ? "lg:w-[64px]" : "lg:w-[240px]")
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center shrink-0 h-16",
            isCollapsed ? "justify-center px-2" : "gap-3 px-5"
          )}
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
            <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold tracking-tight text-white font-heading leading-tight">
                Castelo do Saber
              </span>
            </div>
          )}
          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={closeMobile}
              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* CTA Nova Matrícula */}
        <div className={cn("mt-2 mb-4", isCollapsed ? "px-2" : "px-3")}>
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/matriculas/nova"
                  className="flex items-center justify-center w-full p-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <PlusCircle className="h-[18px] w-[18px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs font-medium">
                Nova Matrícula
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              href="/dashboard/matriculas/nova"
              onClick={closeMobile}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-primary text-white text-[13px] font-semibold hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Nova Matrícula
            </Link>
          )}
        </div>

        <div className="mx-4 mb-2 border-t border-white/[0.06]" />

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-0.5 py-1">
          {navigation.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={isCollapsed}
              isActive={isActive(item.href)}
              onClose={closeMobile}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] py-2">
          {bottomNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={isCollapsed}
              isActive={isActive(item.href)}
              onClose={closeMobile}
            />
          ))}

          {/* Collapse toggle — desktop only */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "flex items-center gap-3 text-[13px] font-medium w-full transition-colors duration-150 text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] rounded-lg",
                isCollapsed ? "justify-center p-2.5 mx-2" : "px-3 py-2.5 mx-3"
              )}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              ) : (
                <>
                  <PanelLeftClose className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
                  <span className="truncate">Recolher</span>
                </>
              )}
            </button>
          )}

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className={cn(
                "flex items-center gap-3 text-[13px] font-medium w-full transition-colors duration-150 text-slate-500 hover:text-red-400 hover:bg-white/[0.04] rounded-lg",
                isCollapsed ? "justify-center p-2.5 mx-2" : "px-3 py-2.5 mx-3"
              )}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              {!isCollapsed && <span className="truncate">Sair</span>}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
