"use client";

import { useSidebar } from "./sidebar-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Topbar({ title, subtitle }) {
  const { collapsed, openMobile } = useSidebar();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between h-14 sm:h-16 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6 transition-all duration-300",
        // Desktop: offset by sidebar width; mobile: no offset
        "ml-0",
        collapsed ? "lg:ml-[64px]" : "lg:ml-[240px]"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile only */}
        <button
          onClick={openMobile}
          className="lg:hidden p-2 -ml-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 sm:gap-3 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-muted-foreground">Diretoria</p>
            </div>
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/20">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                AD
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
