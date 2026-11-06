"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ANOS_LETIVOS, anoLetivo } from "@/lib/constants";

/** Seletor de ano letivo; grava em `?ano=` pra página (Server ou Client) reler. */
export function AnoLetivoSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const ano = anoLetivo(params.get("ano"));

  function trocar(valor) {
    const novo = new URLSearchParams(params);
    novo.set("ano", String(valor));
    router.push(`${pathname}?${novo}`);
  }

  return (
    <Select value={String(ano)} onValueChange={trocar}>
      <SelectTrigger className="w-[170px]">
        <CalendarDays className="h-4 w-4 text-muted-foreground" />
        <SelectValue>{`Ano letivo ${ano}`}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ANOS_LETIVOS.map(a => (
          <SelectItem key={a} value={String(a)}>{`Ano letivo ${a}`}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
