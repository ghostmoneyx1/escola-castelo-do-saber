import { cn } from "@/lib/utils";

const statusConfig = {
  Ativo:       { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Pago:        { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Emitido:     { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Ativa:       { dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
  Pendente:    { dot: "bg-amber-500",   text: "text-amber-700",   bg: "bg-amber-50" },
  Atrasado:    { dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50" },
  Inativo:     { dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50" },
  Cancelada:   { dot: "bg-red-500",     text: "text-red-700",     bg: "bg-red-50" },
  Transferido: { dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50" },
  Transferida: { dot: "bg-blue-500",    text: "text-blue-700",    bg: "bg-blue-50" },
};

const defaultConfig = { dot: "bg-gray-400", text: "text-gray-600", bg: "bg-gray-50" };

export function StatusBadge({ status }) {
  const config = statusConfig[status] || defaultConfig;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold",
        config.bg,
        config.text
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />
      {status}
    </span>
  );
}
