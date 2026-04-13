"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const routeNames = {
  "/dashboard": "Dashboard",
  "/dashboard/alunos": "Alunos",
  "/dashboard/matriculas": "Matrículas",
  "/dashboard/matriculas/nova": "Nova Matrícula",
  "/dashboard/turmas": "Turmas",
  "/dashboard/boletins": "Boletins",
  "/dashboard/frequencia": "Frequência",
  "/dashboard/documentos": "Documentos",
  "/dashboard/financeiro": "Financeiro",
  "/dashboard/relatorios": "Relatórios",
  "/dashboard/configuracoes": "Configurações",
};

export function PageHeader({ title, subtitle, children }) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((_, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    return { name: routeNames[path] || segments[i], path };
  });

  return (
    <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        {breadcrumbs.length > 1 && (
          <nav className="flex items-center gap-1.5 text-[13px] mb-1.5 text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-border">/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-foreground font-medium">{crumb.name}</span>
                ) : (
                  <Link href={crumb.path} className="hover:text-foreground transition-colors">
                    {crumb.name}
                  </Link>
                )}
              </span>
            ))}
          </nav>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-foreground font-heading">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </header>
  );
}
