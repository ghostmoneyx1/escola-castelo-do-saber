import { createClient } from "@/lib/supabase/server";
import { RITMO_PADRAO } from "@/lib/mensalidades/disparo-whatsapp";
import { configuracaoOpenwa } from "@/lib/openwa/client";
import { WhatsappClient } from "./whatsapp-client";

export const dynamic = "force-dynamic";

function numeroDaEnv(nome, padrao) {
  const n = Number.parseInt(process.env[nome] || "", 10);
  return Number.isFinite(n) && n >= 0 ? n : padrao;
}

export default async function WhatsappPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("whatsapp_messages")
    .select("id, stage, phone, body, status, error, created_at, sent_at, students(name)")
    .order("created_at", { ascending: false })
    .limit(150);

  const mensagens = (data || []).map(m => ({
    id: m.id,
    estagio: m.stage,
    telefone: m.phone,
    texto: m.body,
    status: m.status,
    erro: m.error,
    criadoEm: m.created_at,
    enviadoEm: m.sent_at,
    aluno: m.students?.name || null,
  }));

  return (
    <WhatsappClient
      mensagens={mensagens}
      erroMensagens={error?.message || null}
      configurado={Boolean(configuracaoOpenwa())}
      ativo={process.env.WHATSAPP_COBRANCA_ATIVA === "true"}
      ritmo={{
        porRodada: numeroDaEnv("WHATSAPP_POR_RODADA", RITMO_PADRAO.porRodada),
        porDia: numeroDaEnv("WHATSAPP_POR_DIA", RITMO_PADRAO.porDia),
        horaInicio: RITMO_PADRAO.horaInicio,
        horaFim: RITMO_PADRAO.horaFim,
      }}
    />
  );
}
