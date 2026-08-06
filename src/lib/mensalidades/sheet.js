import { createHmac } from "node:crypto";
import { MONTHS } from "@/lib/constants";

const CACHE_TTL_MS = 60_000;

let cache = { at: 0, rows: null };

/** Remove acento e caixa pra comparar nome digitado com nome da planilha. */
export function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function somenteDigitos(texto) {
  return String(texto || "").replace(/\D/g, "");
}

/**
 * Telefone da planilha -> número E.164 pro wa.me.
 * Parte dos números está no formato antigo, sem o 9 de celular
 * ("71 8344-5644"). Insere o 9 e marca como suspeito pra secretaria conferir
 * antes de mandar mensagem.
 */
export function normalizarWhatsapp(bruto) {
  let d = somenteDigitos(bruto);
  if (d.startsWith("55") && d.length > 11) d = d.slice(2);

  if (d.length === 11) return { numero: `55${d}`, suspeito: false };
  if (d.length === 10) return { numero: `55${d.slice(0, 2)}9${d.slice(2)}`, suspeito: true };
  return { numero: null, suspeito: true };
}

/**
 * Código curto e estável de um aluno, usado no link direto
 * (/mensalidades?a=<codigo>). HMAC pra não ser derivável do nome — quem não
 * recebeu o link da escola não consegue montar um.
 */
export function codigoDoAluno(aluno, telefone) {
  const segredo = process.env.MENSALIDADES_LINK_SECRET || "";
  return createHmac("sha256", segredo)
    .update(`${normalizar(aluno)}|${somenteDigitos(telefone)}`)
    .digest("hex")
    .slice(0, 12);
}

/** Parser CSV RFC4180 — a planilha tem vírgula em valores ("R$ 1.200,00"). */
function parseCsv(texto) {
  const linhas = [];
  let campo = "";
  let linha = [];
  let dentroDeAspas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];

    if (dentroDeAspas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; }
        else dentroDeAspas = false;
      } else campo += c;
      continue;
    }

    if (c === '"') dentroDeAspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  linha.push(campo);
  if (linha.some(v => v.trim() !== "")) linhas.push(linha);

  return linhas;
}

/** "R$ 1.200,50" | "300,00" | "300" -> 1200.5 | 300 | 300 */
function parseValor(bruto) {
  const limpo = String(bruto || "").replace(/[^\d,.-]/g, "").trim();
  if (!limpo) return null;
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;
  const n = Number(normalizado);
  return Number.isFinite(n) ? n : null;
}

const MESES_NORMALIZADOS = MONTHS.map(normalizar);

/**
 * Descobre onde estão as colunas a partir da linha de cabeçalho.
 * Aceita variação de acento/caixa nos títulos.
 */
function mapearColunas(cabecalho) {
  const col = { aluno: -1, responsavel: -1, telefone: -1, serie: -1, valor: -1, meses: {} };

  cabecalho.forEach((titulo, i) => {
    const t = normalizar(titulo);
    if (t === "aluno") col.aluno = i;
    else if (t === "responsavel") col.responsavel = i;
    else if (t === "telefone") col.telefone = i;
    else if (t === "serie") col.serie = i;
    else if (t === "valor") col.valor = i;
    else {
      const mes = MESES_NORMALIZADOS.indexOf(t);
      if (mes !== -1) col.meses[mes + 1] = i;
    }
  });

  return col;
}

/**
 * Célula de mês da planilha:
 *   "PAGO"                -> quitado, some da lista
 *   "https://invoice..."  -> em aberto, com link de pagamento
 *   "DEVE" / "À VENCER"   -> em aberto, link ainda não gerado
 *   ""                    -> mês não cobrado desse aluno (ignora)
 */
function lerCelulaMes(bruto) {
  const texto = String(bruto || "").trim();
  if (!texto) return null;

  const t = normalizar(texto);
  if (t === "pago" || t === "paga" || t === "quitado" || t === "isento") return null;

  if (/^https?:\/\//i.test(texto)) return { link: texto, situacao: "Em aberto" };
  if (t === "deve" || t === "atrasado") return { link: null, situacao: "Em atraso" };
  return { link: null, situacao: "A vencer" };
}

async function carregarLinhas() {
  const url = process.env.MENSALIDADES_SHEET_CSV_URL;
  if (!url) throw new Error("MENSALIDADES_SHEET_CSV_URL não configurada");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Planilha respondeu ${res.status}`);

  const linhas = parseCsv(await res.text());
  const iCabecalho = linhas.findIndex(l => l.some(c => normalizar(c) === "aluno"));
  if (iCabecalho === -1) throw new Error("Cabeçalho ALUNO não encontrado na planilha");

  const col = mapearColunas(linhas[iCabecalho]);
  if (col.aluno === -1 || col.telefone === -1) {
    throw new Error("Colunas ALUNO / TELEFONE não encontradas na planilha");
  }

  return linhas.slice(iCabecalho + 1).flatMap(linha => {
    const aluno = String(linha[col.aluno] || "").trim();
    if (!aluno) return [];

    const valorMensal = col.valor === -1 ? null : parseValor(linha[col.valor]);

    const pendentes = [];
    for (const [mes, i] of Object.entries(col.meses)) {
      const celula = lerCelulaMes(linha[i]);
      if (!celula) continue;
      pendentes.push({
        mes: MONTHS[Number(mes) - 1],
        valor: valorMensal,
        link: celula.link,
        situacao: celula.situacao,
      });
    }

    const telefone = String(linha[col.telefone] || "").trim();
    const { numero: whatsapp, suspeito: telefoneSuspeito } = normalizarWhatsapp(telefone);

    return [{
      aluno,
      alunoNormalizado: normalizar(aluno),
      responsavel: col.responsavel === -1 ? null : String(linha[col.responsavel] || "").trim() || null,
      serie: col.serie === -1 ? null : String(linha[col.serie] || "").trim() || null,
      telefone,
      telefone4: somenteDigitos(telefone).slice(-4),
      whatsapp,
      telefoneSuspeito,
      codigo: codigoDoAluno(aluno, telefone),
      valorMensal,
      pendentes,
      total: pendentes.reduce((soma, p) => soma + (p.valor || 0), 0) || null,
      mesesAtrasados: pendentes.filter(p => p.situacao === "Em atraso").length,
      mesesEmAberto: pendentes.filter(p => p.situacao === "Em aberto").length,
    }];
  });
}

/** Linhas da planilha com cache curto — evita bater no Google a cada tecla. */
export async function obterLinhas({ forcarAtualizacao = false } = {}) {
  const agora = Date.now();
  if (!forcarAtualizacao && cache.rows && agora - cache.at < CACHE_TTL_MS) {
    return cache.rows;
  }
  const rows = await carregarLinhas();
  cache = { at: agora, rows };
  return rows;
}

/** Formato devolvido pela rota pública — sem telefone nem código. */
function paraResponsavel(l) {
  return {
    aluno: l.aluno,
    responsavel: l.responsavel,
    serie: l.serie,
    pendentes: l.pendentes,
    total: l.total,
  };
}

/**
 * Busca por nome parcial da criança + 4 últimos dígitos do telefone
 * do responsável. Mesma regra da planilha atual.
 */
export async function buscarMensalidades(nome, tel4) {
  const alvo = normalizar(nome);
  const linhas = await obterLinhas();

  return linhas
    .filter(l => l.telefone4 === tel4 && l.alunoNormalizado.includes(alvo))
    .map(paraResponsavel);
}

/** Link direto que a escola manda pronto: /mensalidades?a=<codigo>. */
export async function buscarPorCodigo(codigo) {
  const linhas = await obterLinhas();
  return linhas.filter(l => l.codigo === codigo).map(paraResponsavel);
}

/**
 * Casa um aluno do Supabase com a linha da planilha. Os dois cadastros foram
 * digitados em momentos diferentes, então o nome quase nunca é idêntico:
 * tenta exato, depois contido, e por fim devolve sugestões por sobrenome
 * em comum pra secretaria decidir.
 */
export async function casarAlunoDaPlanilha(nomeSupabase) {
  const alvo = normalizar(nomeSupabase);
  if (!alvo) return { situacao: "sem-nome", aluno: null, sugestoes: [] };

  const linhas = await obterLinhas();

  const exato = linhas.find(l => l.alunoNormalizado === alvo);
  if (exato) return { situacao: "exato", aluno: exato, sugestoes: [] };

  const contidos = linhas.filter(
    l => l.alunoNormalizado.includes(alvo) || alvo.includes(l.alunoNormalizado)
  );
  if (contidos.length === 1) return { situacao: "aproximado", aluno: contidos[0], sugestoes: [] };
  if (contidos.length > 1) return { situacao: "ambiguo", aluno: null, sugestoes: contidos };

  const tokensAlvo = new Set(alvo.split(" ").filter(t => t.length > 2));
  const sugestoes = linhas
    .map(l => {
      const tokens = l.alunoNormalizado.split(" ").filter(t => t.length > 2);
      return { linha: l, pontos: tokens.filter(t => tokensAlvo.has(t)).length };
    })
    .filter(s => s.pontos >= 2)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 3)
    .map(s => s.linha);

  return { situacao: sugestoes.length ? "sugestao" : "ausente", aluno: null, sugestoes };
}

/**
 * Visão da secretaria: todo mundo da planilha + agregados de inadimplência.
 * Inclui telefone e código, por isso só pode ser usada em rota autenticada.
 */
export async function obterCobranca() {
  const linhas = await obterLinhas();

  const alunos = linhas
    .map(l => ({
      aluno: l.aluno,
      responsavel: l.responsavel,
      serie: l.serie,
      telefone: l.telefone,
      whatsapp: l.whatsapp,
      telefoneSuspeito: l.telefoneSuspeito,
      codigo: l.codigo,
      valorMensal: l.valorMensal,
      pendentes: l.pendentes,
      total: l.total,
      mesesAtrasados: l.mesesAtrasados,
      mesesEmAberto: l.mesesEmAberto,
    }))
    .sort((a, b) => b.mesesAtrasados - a.mesesAtrasados || (b.total || 0) - (a.total || 0));

  const soma = (filtro) =>
    alunos.reduce(
      (t, a) => t + a.pendentes.filter(filtro).reduce((s, p) => s + (p.valor || 0), 0),
      0
    );

  return {
    alunos,
    resumo: {
      totalAlunos: alunos.length,
      emDia: alunos.filter(a => a.pendentes.length === 0).length,
      comAtraso: alunos.filter(a => a.mesesAtrasados > 0).length,
      semTelefoneConfiavel: alunos.filter(a => a.telefoneSuspeito).length,
      totalAtrasado: soma(p => p.situacao === "Em atraso"),
      totalEmAberto: soma(p => p.situacao === "Em aberto"),
      totalAVencer: soma(p => p.situacao === "A vencer"),
    },
  };
}
