"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, Check, ExternalLink, QrCode } from "lucide-react";

const FERRAMENTAS = [
  {
    id: "mensalidades",
    nome: "Consulta de Mensalidades",
    descricao:
      "O responsável digita o nome da criança e os 4 últimos dígitos do telefone, vê os meses em aberto e paga pelo link da InfinitePay. Lê as parcelas do contrato.",
    caminho: "/mensalidades",
    icon: Wallet,
  },
];

function FerramentaCard({ ferramenta, origem }) {
  const [copiado, setCopiado] = useState(false);
  const url = origem ? `${origem}${ferramenta.caminho}` : ferramenta.caminho;

  async function copiar() {
    await navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const Icon = ferramenta.icon;

  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <Icon className="h-[18px] w-[18px] text-primary" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold font-heading text-foreground">{ferramenta.nome}</p>
          <p className="text-sm text-muted-foreground mt-1">{ferramenta.descricao}</p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
          Link público
        </p>
        <div className="flex items-center gap-2">
          <code className="flex-1 min-w-0 truncate bg-muted rounded-[10px] px-3 h-10 flex items-center text-sm text-foreground">
            {url}
          </code>
          <Button variant="outline" size="sm" onClick={copiar} className="h-10 shrink-0 gap-1.5">
            {copiado ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copiado ? "Copiado" : "Copiar"}
          </Button>
          <Button asChild size="sm" className="h-10 shrink-0 gap-1.5">
            <a href={ferramenta.caminho} target="_blank" rel="noopener noreferrer">
              Abrir
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Sem login. Pode mandar no grupo de WhatsApp dos responsáveis.
        </p>
      </div>

      <div className="mt-5 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/api/mensalidades/qr"
          alt="QR Code da consulta de mensalidades"
          width={120}
          height={120}
          className="shrink-0 border border-border rounded-lg"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <QrCode className="h-4 w-4" />
            QR para o mural
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Imprime e cola na recepção ou no portão. O responsável aponta a câmera e cai direto na
            consulta.
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3">
            <a href="/api/mensalidades/qr?download=1" download="qr-mensalidades.svg">
              Baixar QR
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FerramentasClient() {
  const [origem, setOrigem] = useState("");

  useEffect(() => setOrigem(window.location.origin), []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ferramentas"
        subtitle="Páginas públicas que a escola pode compartilhar com responsáveis"
      />

      <div className="grid grid-cols-1 gap-4">
        {FERRAMENTAS.map((f) => (
          <FerramentaCard key={f.id} ferramenta={f} origem={origem} />
        ))}
      </div>
    </div>
  );
}
