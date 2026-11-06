"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

const PAGINA_WHATSAPP = "/dashboard/cobranca/whatsapp";
const INTERVALO_MS = 2 * 60_000;

// Ligando é passageiro (dura segundos); só vale alarme o que precisa de gente.
const PASSAGEIROS = new Set(["ready", "initializing", "starting"]);

const MOTIVO = {
  qr_ready: "está esperando a leitura do QR",
  disconnected: "está desconectado",
  failed: "caiu e não conseguiu reconectar",
};

/**
 * Faixa no topo do painel quando o chip da cobrança não está conectado:
 * enquanto isso nenhum aviso automático sai.
 */
export function WhatsappRadar() {
  const pathname = usePathname();
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    let vivo = true;
    async function conferir() {
      try {
        const res = await fetch("/api/whatsapp/sessao", { cache: "no-store" });
        // 503 = WhatsApp não configurado neste ambiente; 401 = sem login.
        if (res.status === 503 || res.status === 401) return vivo && setAlerta(null);
        if (!res.ok) return vivo && setAlerta("O servidor do WhatsApp não está respondendo");
        const { status } = await res.json();
        if (!vivo) return;
        setAlerta(PASSAGEIROS.has(status) ? null : `O WhatsApp da cobrança ${MOTIVO[status] || `está fora do ar (${status})`}`);
      } catch {
        // Sem internet no navegador não é queda do chip.
      }
    }
    conferir();
    const timer = setInterval(conferir, INTERVALO_MS);
    window.addEventListener("focus", conferir);
    return () => { vivo = false; clearInterval(timer); window.removeEventListener("focus", conferir); };
  }, []);

  if (!alerta) return null;

  return (
    <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 flex-wrap">
      <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
      <div className="text-sm flex-1 min-w-[200px]">
        <p className="font-semibold text-red-800">{alerta}</p>
        <p className="text-red-700/80">Nenhum aviso de mensalidade sai enquanto isso.</p>
      </div>
      {pathname !== PAGINA_WHATSAPP && (
        <Link href={PAGINA_WHATSAPP} className={buttonVariants({ variant: "outline", size: "sm" })}>
          Reconectar
        </Link>
      )}
    </div>
  );
}
