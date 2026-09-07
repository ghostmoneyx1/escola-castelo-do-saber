"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Campo de busca para usar na prop `header` do SelectContent.
// O Select do Base UI escuta teclado no popup para typeahead e navegação por
// setas; sem parar a propagação, digitar aqui pulava a lista em vez de filtrar.
export function SelectSearch({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      <Input
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== "Escape" && e.key !== "Tab") e.stopPropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.focus();
        }}
        className="h-8 pl-8"
      />
    </div>
  );
}
