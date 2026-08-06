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

    return [{
      aluno,
      alunoNormalizado: normalizar(aluno),
      responsavel: col.responsavel === -1 ? null : String(linha[col.responsavel] || "").trim() || null,
      serie: col.serie === -1 ? null : String(linha[col.serie] || "").trim() || null,
      telefone4: somenteDigitos(linha[col.telefone]).slice(-4),
      valorMensal,
      pendentes,
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

/**
 * Busca por nome parcial da criança + 4 últimos dígitos do telefone
 * do responsável. Mesma regra da planilha atual.
 */
export async function buscarMensalidades(nome, tel4) {
  const alvo = normalizar(nome);
  const linhas = await obterLinhas();

  return linhas
    .filter(l => l.telefone4 === tel4 && l.alunoNormalizado.includes(alvo))
    .map(l => ({
      aluno: l.aluno,
      responsavel: l.responsavel,
      serie: l.serie,
      pendentes: l.pendentes,
      total: l.pendentes.reduce((soma, p) => soma + (p.valor || 0), 0) || null,
    }));
}
