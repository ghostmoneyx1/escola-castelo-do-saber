/**
 * ============================================================
 * SCRIPT DE TESTE — Escola Castelo do Saber
 * ============================================================
 * Simula uso intenso de todas as páginas, mede tempos de
 * resposta e identifica erros/lentidão.
 *
 * USO:
 *   1. Edite ADMIN_EMAIL e ADMIN_PASSWORD abaixo
 *   2. node test-app.mjs
 * ============================================================
 */

import { createClient } from "@supabase/supabase-js";

// ── CONFIGURAÇÃO ─────────────────────────────────────────────
const SUPABASE_URL = "https://wendpwhrxwxatnovdwcp.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbmRwd2hyeHd4YXRub3Zkd2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2Mjk4MzUsImV4cCI6MjA5MDIwNTgzNX0.P-S8Gi27hU4IEXksg2bsVqZCAuqe-gTa6qMJ10olcJg";

const ADMIN_EMAIL = "diretoria@escolacastelodosaber.com";      // ← troque
const ADMIN_PASSWORD = "CasteloAdmin2026!";  // ← troque

const CONCURRENCY = 5; // simulações paralelas
// ─────────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Cores no terminal ────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  blue: "\x1b[34m",
};

const results = [];
let totalTests = 0;
let passed = 0;
let failed = 0;
let slowCount = 0;

// ── Helpers ──────────────────────────────────────────────────
function log(msg) { process.stdout.write(msg + "\n"); }
function title(msg) { log(`\n${c.bold}${c.blue}▶ ${msg}${c.reset}`); }
function hr() { log(c.gray + "─".repeat(60) + c.reset); }

async function test(name, fn, { warnMs = 800, errorMs = 2000 } = {}) {
  totalTests++;
  const start = Date.now();
  try {
    const result = await fn();
    const ms = Date.now() - start;
    const slow = ms >= warnMs;
    const verySlow = ms >= errorMs;

    if (verySlow) slowCount++;

    const icon = verySlow ? "⚠" : slow ? "~" : "✓";
    const color = verySlow ? c.yellow : slow ? c.yellow : c.green;
    const msStr = verySlow
      ? `${c.red}${ms}ms${c.reset}`
      : slow
        ? `${c.yellow}${ms}ms${c.reset}`
        : `${c.gray}${ms}ms${c.reset}`;

    let detail = "";
    if (result?.count !== undefined) detail = ` ${c.gray}(${result.count} registros)${c.reset}`;
    else if (result?.rows !== undefined) detail = ` ${c.gray}(${result.rows} linhas)${c.reset}`;

    log(`  ${color}${icon}${c.reset} ${name}${detail} ${msStr}`);
    passed++;
    results.push({ name, ms, ok: true, slow: slow || verySlow });
    return result;
  } catch (err) {
    const ms = Date.now() - start;
    log(`  ${c.red}✗${c.reset} ${name} ${c.red}ERRO: ${err.message}${c.reset} ${c.gray}(${ms}ms)${c.reset}`);
    failed++;
    results.push({ name, ms, ok: false, error: err.message });
    return null;
  }
}

async function supaTest(name, queryFn, opts) {
  return test(
    name,
    async () => {
      const { data, error, count } = await queryFn();
      if (error) throw new Error(error.message);
      return { count: Array.isArray(data) ? data.length : (count ?? 0), data };
    },
    opts
  );
}

// ── 1. AUTH ──────────────────────────────────────────────────
async function testAuth() {
  title("AUTENTICAÇÃO");
  const { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (error) {
    log(`  ${c.red}✗ Login falhou: ${error.message}${c.reset}`);
    log(`  ${c.yellow}  Continuando sem autenticação (leituras podem falhar por RLS)${c.reset}`);
    failed++;
    results.push({ name: "Login admin", ok: false, error: error.message });
    return false;
  }
  log(`  ${c.green}✓ Login OK — ${data.user.email}${c.reset}`);
  passed++;
  results.push({ name: "Login admin", ok: true, ms: 0 });
  return true;
}

// ── 2. DASHBOARD (KPIs) ──────────────────────────────────────
async function testDashboard() {
  title("DASHBOARD — KPIs");

  await supaTest("Total de alunos ativos", () =>
    supabase.from("students").select("id", { count: "exact", head: true }).eq("status", "Ativo")
  );

  await supaTest("Matrículas ativas 2026", () =>
    supabase.from("enrollments").select("id", { count: "exact", head: true }).eq("year", 2026).eq("status", "Ativa")
  );

  await supaTest("Pagamentos pendentes", () =>
    supabase.from("payments").select("id", { count: "exact", head: true }).eq("status", "Pendente")
  );

  await supaTest("Receita paga (mês atual)", () =>
    supabase
      .from("payments")
      .select("amount")
      .eq("status", "Pago")
      .eq("reference_year", 2026)
      .eq("reference_month", 3)
  );

  await supaTest("Turmas ativas", () =>
    supabase.from("classes").select("id", { count: "exact", head: true }).eq("is_active", true)
  );

  await supaTest("Alunos novos (últimos 30 dias)", () =>
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString())
  );
}

// ── 3. ALUNOS ────────────────────────────────────────────────
async function testAlunos() {
  title("ALUNOS");

  const res = await supaTest("Lista geral de alunos", () =>
    supabase.from("students").select("*, classes(name, grade), units(name)").order("name")
  );

  await supaTest("Filtro: status Ativo", () =>
    supabase.from("students").select("*").eq("status", "Ativo").order("name")
  );

  await supaTest("Filtro: status Pendente", () =>
    supabase.from("students").select("*").eq("status", "Pendente")
  );

  await supaTest("Busca por nome (Ana)", () =>
    supabase.from("students").select("*").ilike("name", "%Ana%")
  );

  // Detalhe de aluno individual
  if (res?.data?.[0]) {
    const student = res.data[0];
    await supaTest(`Detalhe aluno: ${student.name.split(" ")[0]}`, () =>
      supabase
        .from("students")
        .select("*, classes(name, grade, shift), units(name), student_guardians(*, guardians(*))")
        .eq("id", student.id)
        .single()
    );
  }
}

// ── 4. MATRÍCULAS ────────────────────────────────────────────
async function testMatriculas() {
  title("MATRÍCULAS");

  await supaTest("Lista de matrículas (com aluno e turma)", () =>
    supabase
      .from("enrollments")
      .select("*, students(name, cpf), classes(name, grade, shift)")
      .order("created_at", { ascending: false })
  );

  await supaTest("Filtro: Ativa", () =>
    supabase.from("enrollments").select("*, students(name)").eq("status", "Ativa")
  );

  await supaTest("Filtro: Cancelada", () =>
    supabase.from("enrollments").select("*").eq("status", "Cancelada")
  );

  await supaTest("Filtro: Transferida", () =>
    supabase.from("enrollments").select("*").eq("status", "Transferida")
  );

  // Dados para formulário nova matrícula
  await supaTest("Carregar options: alunos+turmas+unidades", async () => {
    const [a, b, c2] = await Promise.all([
      supabase.from("classes").select("*").eq("is_active", true).order("grade"),
      supabase.from("units").select("*").order("name"),
      supabase.from("students").select("id, name, cpf").eq("status", "Ativo").order("name"),
    ]);
    if (a.error) throw new Error(a.error.message);
    if (b.error) throw new Error(b.error.message);
    if (c2.error) throw new Error(c2.error.message);
    return { count: (a.data?.length || 0) + (b.data?.length || 0) + (c2.data?.length || 0) };
  });
}

// ── 5. BOLETINS ──────────────────────────────────────────────
async function testBoletins() {
  title("BOLETINS");

  await supaTest("Lista de alunos para seleção", () =>
    supabase.from("students").select("id, name, status").eq("status", "Ativo").order("name")
  );

  await supaTest("Lista de disciplinas ativas", () =>
    supabase.from("subjects").select("*").eq("is_active", true).order("sort_order")
  );

  // Simula carregar boletim de aluno específico
  const studRes = await supabase.from("students").select("id, name").eq("status", "Ativo").limit(3);
  if (studRes.data) {
    for (const student of studRes.data) {
      await supaTest(`Notas: ${student.name.split(" ")[0]} — Bimestre 1`, () =>
        supabase
          .from("grades")
          .select("*, subjects(name, sort_order)")
          .eq("student_id", student.id)
          .eq("unit", 1)
          .eq("year", 2026)
      );
    }
  }
}

// ── 6. FREQUÊNCIA ────────────────────────────────────────────
async function testFrequencia() {
  title("FREQUÊNCIA");

  await supaTest("Lista de turmas para seleção", () =>
    supabase.from("classes").select("*").eq("is_active", true).order("grade")
  );

  // Simula carregar frequência de turma no dia atual
  const classRes = await supabase.from("classes").select("id, name").eq("is_active", true).limit(3);
  if (classRes.data) {
    for (const cls of classRes.data) {
      await supaTest(`Frequência turma ${cls.name} — hoje`, () =>
        supabase
          .from("attendance")
          .select("*, students(name)")
          .eq("class_id", cls.id)
          .eq("date", "2026-03-28")
      );

      await supaTest(`Alunos da turma ${cls.name}`, () =>
        supabase
          .from("students")
          .select("id, name")
          .eq("class_id", cls.id)
          .eq("status", "Ativo")
          .order("name")
      );
    }
  }
}

// ── 7. FINANCEIRO ────────────────────────────────────────────
async function testFinanceiro() {
  title("FINANCEIRO");

  await supaTest("Lista pagamentos (com aluno)", () =>
    supabase
      .from("payments")
      .select("*, students(name, enrollment_type)")
      .order("due_date", { ascending: false })
  );

  await supaTest("Filtro: status Pendente", () =>
    supabase
      .from("payments")
      .select("*, students(name)")
      .eq("status", "Pendente")
  );

  await supaTest("Filtro: status Atrasado", () =>
    supabase
      .from("payments")
      .select("*, students(name)")
      .eq("status", "Atrasado")
  );

  await supaTest("Filtro: mês março 2026", () =>
    supabase
      .from("payments")
      .select("*, students(name)")
      .eq("reference_month", 3)
      .eq("reference_year", 2026)
  );

  await supaTest("Resumo financeiro: total pago x pendente", async () => {
    const [pago, pendente, atrasado] = await Promise.all([
      supabase.from("payments").select("amount").eq("status", "Pago").eq("reference_year", 2026),
      supabase.from("payments").select("amount").eq("status", "Pendente").eq("reference_year", 2026),
      supabase.from("payments").select("amount").eq("status", "Atrasado").eq("reference_year", 2026),
    ]);
    if (pago.error) throw new Error(pago.error.message);
    const totalPago = pago.data?.reduce((a, p) => a + Number(p.amount), 0) || 0;
    return { count: Math.round(totalPago), rows: (pago.data?.length || 0) };
  });
}

// ── 8. DOCUMENTOS ────────────────────────────────────────────
async function testDocumentos() {
  title("DOCUMENTOS");

  await supaTest("Lista documentos (com aluno)", () =>
    supabase
      .from("documents")
      .select("*, students(name)")
      .order("created_at", { ascending: false })
  );

  await supaTest("Filtro: Atestado de Matrícula", () =>
    supabase
      .from("documents")
      .select("*, students(name)")
      .eq("type", "Atestado de Matrícula")
  );
}

// ── 9. RELATÓRIOS ────────────────────────────────────────────
async function testRelatorios() {
  title("RELATÓRIOS");

  await supaTest("Alunos por turma (aggregate)", async () => {
    const { data, error } = await supabase
      .from("students")
      .select("class_id, classes(name, grade)")
      .eq("status", "Ativo");
    if (error) throw new Error(error.message);
    return { count: data?.length };
  });

  await supaTest("Frequência média — março", async () => {
    const { data, error } = await supabase
      .from("attendance")
      .select("student_id, present")
      .gte("date", "2026-03-01")
      .lte("date", "2026-03-31");
    if (error) throw new Error(error.message);
    const total = data?.length || 0;
    const presentes = data?.filter((a) => a.present).length || 0;
    return { count: Math.round((presentes / total) * 100), rows: total };
  });

  await supaTest("Inadimplência por aluno", () =>
    supabase
      .from("payments")
      .select("student_id, students(name), status, amount")
      .in("status", ["Pendente", "Atrasado"])
      .eq("reference_year", 2026)
  );

  await supaTest("Média de notas por disciplina", async () => {
    const { data, error } = await supabase
      .from("grades")
      .select("subject_id, subjects(name), score")
      .eq("year", 2026);
    if (error) throw new Error(error.message);
    return { count: data?.length };
  });
}

// ── 10. CONFIGURAÇÕES ────────────────────────────────────────
async function testConfiguracoes() {
  title("CONFIGURAÇÕES");

  await supaTest("Lista de disciplinas", () =>
    supabase.from("subjects").select("*").order("sort_order")
  );

  await supaTest("Lista de unidades", () =>
    supabase.from("units").select("*, classes(id)").order("name")
  );
}

// ── 11. TURMAS ───────────────────────────────────────────────
async function testTurmas() {
  title("TURMAS");

  await supaTest("Lista de turmas (com unidade e contagem alunos)", () =>
    supabase
      .from("classes")
      .select("*, units(name), students(id)")
      .order("grade")
  );
}

// ── 12. CARGA SIMULTÂNEA ─────────────────────────────────────
async function testCargaSimultanea() {
  title(`CARGA SIMULTÂNEA — ${CONCURRENCY} requisições paralelas`);

  const queries = [
    () => supabase.from("students").select("*, classes(name)").order("name"),
    () => supabase.from("enrollments").select("*, students(name)").order("created_at", { ascending: false }),
    () => supabase.from("payments").select("*, students(name)").order("due_date", { ascending: false }),
    () => supabase.from("attendance").select("student_id, present").gte("date", "2026-03-01").lte("date", "2026-03-31"),
    () => supabase.from("grades").select("*, subjects(name)").eq("year", 2026).eq("unit", 1),
  ];

  for (let round = 1; round <= 3; round++) {
    await test(`Rodada ${round}: ${CONCURRENCY} queries simultâneas`, async () => {
      const start = Date.now();
      const results = await Promise.all(queries.map((q) => q()));
      const errors = results.filter((r) => r.error);
      if (errors.length > 0) throw new Error(`${errors.length} queries falharam`);
      const totalRows = results.reduce((a, r) => a + (r.data?.length || 0), 0);
      return { rows: totalRows };
    }, { warnMs: 1500, errorMs: 3000 });
  }
}

// ── SUMMARY ──────────────────────────────────────────────────
function printSummary() {
  log("\n");
  hr();
  log(`${c.bold}RESUMO DOS TESTES${c.reset}`);
  hr();
  log(`  Total:    ${totalTests}`);
  log(`  ${c.green}Passou:   ${passed}${c.reset}`);
  log(`  ${c.red}Falhou:   ${failed}${c.reset}`);
  log(`  ${c.yellow}Lentos:   ${slowCount} (acima de 2s)${c.reset}`);

  if (failed > 0) {
    log(`\n${c.red}${c.bold}FALHAS:${c.reset}`);
    results.filter((r) => !r.ok).forEach((r) => {
      log(`  ${c.red}✗ ${r.name}${c.reset}`);
      log(`    ${c.gray}${r.error}${c.reset}`);
    });
  }

  if (slowCount > 0) {
    log(`\n${c.yellow}${c.bold}QUERIES LENTAS (>2s):${c.reset}`);
    results
      .filter((r) => r.ok && r.ms >= 2000)
      .sort((a, b) => b.ms - a.ms)
      .forEach((r) => {
        log(`  ${c.yellow}~ ${r.name} — ${r.ms}ms${c.reset}`);
      });
  }

  // Top 5 mais lentas
  log(`\n${c.bold}TOP 5 MAIS LENTAS:${c.reset}`);
  results
    .filter((r) => r.ok && r.ms !== undefined)
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 5)
    .forEach((r, i) => {
      const color = r.ms > 2000 ? c.red : r.ms > 800 ? c.yellow : c.gray;
      log(`  ${i + 1}. ${color}${r.name} — ${r.ms}ms${c.reset}`);
    });

  hr();
  const status = failed === 0 ? `${c.green}✓ TODOS OS TESTES PASSARAM${c.reset}` : `${c.red}✗ ${failed} TESTE(S) FALHARAM${c.reset}`;
  log(`  ${status}`);
  hr();
}

// ── MAIN ─────────────────────────────────────────────────────
async function main() {
  log(`\n${c.bold}${c.cyan}╔══════════════════════════════════════════════╗${c.reset}`);
  log(`${c.bold}${c.cyan}║   TESTE DE PERFORMANCE — Castelo do Saber    ║${c.reset}`);
  log(`${c.bold}${c.cyan}╚══════════════════════════════════════════════╝${c.reset}`);
  log(`  ${c.gray}${new Date().toLocaleString("pt-BR")}${c.reset}`);

  const authenticated = await testAuth();
  if (!authenticated) {
    log(`\n  ${c.yellow}⚠ Para testes completos, edite ADMIN_EMAIL e ADMIN_PASSWORD no script.${c.reset}`);
  }

  await testDashboard();
  await testAlunos();
  await testMatriculas();
  await testBoletins();
  await testFrequencia();
  await testFinanceiro();
  await testDocumentos();
  await testRelatorios();
  await testConfiguracoes();
  await testTurmas();
  await testCargaSimultanea();

  printSummary();
}

main().catch((err) => {
  log(`\n${c.red}ERRO FATAL: ${err.message}${c.reset}`);
  process.exit(1);
});
