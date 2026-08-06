import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { buscarMensalidades, obterLinhas, normalizar } from "./sheet";

const CSV = [
  ",,,,,,,,,,,,,,,,",
  "ALUNO,RESPONSÁVEL,TELEFONE,SÉRIE,VALOR,JANEIRO,FEVEREIRO,MARÇO,ABRIL,MAIO,JUNHO,JULHO,AGOSTO,SETEMBRO,OUTUBRO,NOVEMBRO,DEZEMBRO",
  'Samir Gael e Luara Miranda,Naiara Nascimento,71993363876,1º Ano,"R$ 450,00",PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,https://invoice.infinitepay.io/castelodosaber/AGO1,https://invoice.infinitepay.io/castelodosaber/SET1,https://invoice.infinitepay.io/castelodosaber/OUT1,https://invoice.infinitepay.io/castelodosaber/NOV1,https://invoice.infinitepay.io/castelodosaber/DEZ1',
  'Pedro Santana Silva,Nathalia da Silva de Santana,71983526005,1º Ano,"R$ 300,00",PAGO,PAGO,PAGO,PAGO,PAGO,DEVE,DEVE,À VENCER,À VENCER,À VENCER,À VENCER,À VENCER',
  'Henrique Brito,Gislaine Novais Brito,71987506912,1º Ano,"R$ 300,00",,,,,,,https://invoice.infinitepay.io/castelodosaber/JUL3,https://invoice.infinitepay.io/castelodosaber/AGO3,À VENCER,À VENCER,À VENCER,À VENCER',
  'Israel dos Santos Queiroz,Marta,71987159363,5º Ano,"R$ 350,00",PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO,PAGO',
].join("\n");

describe("consulta de mensalidades (planilha)", () => {
  beforeEach(() => {
    process.env.MENSALIDADES_SHEET_CSV_URL = "https://exemplo.test/planilha.csv";
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, text: async () => CSV })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function linhas() {
    return obterLinhas({ forcarAtualizacao: true });
  }

  it("normaliza acento e caixa", () => {
    expect(normalizar("MARÇO")).toBe("marco");
    expect(normalizar("  José   da  Silva ")).toBe("jose da silva");
  });

  it("pula linhas acima do cabeçalho e lê todos os alunos", async () => {
    expect(await linhas()).toHaveLength(4);
  });

  it("trata PAGO como quitado e URL como parcela com link", async () => {
    await linhas();
    const [r] = await buscarMensalidades("samir", "3876");

    expect(r.aluno).toBe("Samir Gael e Luara Miranda");
    expect(r.responsavel).toBe("Naiara Nascimento");
    expect(r.pendentes.map(p => p.mes)).toEqual([
      "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ]);
    expect(r.pendentes[0].link).toBe("https://invoice.infinitepay.io/castelodosaber/AGO1");
    expect(r.pendentes[0].valor).toBe(450);
    expect(r.total).toBe(2250);
  });

  it("classifica DEVE como atraso e À VENCER sem link", async () => {
    await linhas();
    const [r] = await buscarMensalidades("pedro santana", "6005");

    expect(r.pendentes.find(p => p.mes === "Junho")).toMatchObject({
      situacao: "Em atraso",
      link: null,
    });
    expect(r.pendentes.find(p => p.mes === "Setembro")).toMatchObject({
      situacao: "A vencer",
      link: null,
    });
  });

  it("ignora mês vazio (aluno que entrou no meio do ano)", async () => {
    await linhas();
    const [r] = await buscarMensalidades("henrique", "6912");

    expect(r.pendentes.map(p => p.mes)).toEqual([
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ]);
  });

  it("retorna aluno sem pendência com lista vazia", async () => {
    await linhas();
    const [r] = await buscarMensalidades("israel", "9363");

    expect(r.pendentes).toEqual([]);
    expect(r.total).toBeNull();
  });

  it("busca sem acento e sem caixa", async () => {
    await linhas();
    expect(await buscarMensalidades("SAMIR GAEL", "3876")).toHaveLength(1);
  });

  it("não devolve nada quando o telefone não bate", async () => {
    await linhas();
    expect(await buscarMensalidades("samir", "0000")).toEqual([]);
  });

  it("usa cache dentro da janela e não rebusca a planilha", async () => {
    await obterLinhas({ forcarAtualizacao: true });
    const chamadas = fetch.mock.calls.length;
    await obterLinhas();
    expect(fetch.mock.calls.length).toBe(chamadas);
  });
});
