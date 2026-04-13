import { cn } from "@/lib/utils";

export function EmptyState({ icon: Icon, title, description, children, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4", className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
          <Icon className="h-6 w-6 text-muted-foreground/60" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground font-heading">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
