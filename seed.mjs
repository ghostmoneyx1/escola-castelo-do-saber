/**
 * Seed script — Escola Castelo do Saber
 * Run: node seed.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wendpwhrxwxatnovdwcp.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlbmRwd2hyeHd4YXRub3Zkd2NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2Mjk4MzUsImV4cCI6MjA5MDIwNTgzNX0.P-S8Gi27hU4IEXksg2bsVqZCAuqe-gTa6qMJ10olcJg";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function log(msg) { console.log(`✓ ${msg}`); }
function err(msg, e) { console.error(`✗ ${msg}:`, e?.message || e); }

/* ─── helpers ─── */
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randFloat(min, max) { return parseFloat((Math.random() * (max - min) + min).toFixed(1)); }
function dateStr(y, m, d) { return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }

/* ─── 1. UNITS ─── */
async function seedUnits() {
  const { data, error } = await supabase.from("units").insert([
    { name: "Unidade Central",  address: "Rua das Pitangueiras, 245 — Pituba, Salvador" },
    { name: "Unidade Cajazeiras", address: "Av. Luís Viana Filho, 1820 — Cajazeiras, Salvador" },
  ]).select();
  if (error) { err("units", error); return []; }
  log(`${data.length} unidades`);
  return data;
}

/* ─── 2. SUBJECTS ─── */
async function seedSubjects() {
  const { data, error } = await supabase.from("subjects").insert([
    { name: "Português",       sort_order: 1,  is_active: true },
    { name: "Matemática",      sort_order: 2,  is_active: true },
    { name: "Ciências",        sort_order: 3,  is_active: true },
    { name: "História",        sort_order: 4,  is_active: true },
    { name: "Geografia",       sort_order: 5,  is_active: true },
    { name: "Educação Física", sort_order: 6,  is_active: true },
    { name: "Arte",            sort_order: 7,  is_active: true },
    { name: "Inglês",          sort_order: 8,  is_active: true },
    { name: "Física",          sort_order: 9,  is_active: true },
    { name: "Biologia",        sort_order: 10, is_active: true },
  ]).select();
  if (error) { err("subjects", error); return []; }
  log(`${data.length} disciplinas`);
  return data;
}

/* ─── 3. CLASSES ─── */
async function seedClasses(units) {
  const central    = units.find(u => u.name.includes("Central")).id;
  const cajazeiras = units.find(u => u.name.includes("Cajazeiras")).id;

  const { data, error } = await supabase.from("classes").insert([
    { name: "Jardim A",  grade: "Educação Infantil", shift: "Matutino",   unit_id: central,    year: 2026, is_active: true },
    { name: "Jardim B",  grade: "Educação Infantil", shift: "Vespertino", unit_id: cajazeiras, year: 2026, is_active: true },
    { name: "1º Ano A",  grade: "1º Ano EF",         shift: "Matutino",   unit_id: central,    year: 2026, is_active: true },
    { name: "1º Ano B",  grade: "1º Ano EF",         shift: "Vespertino", unit_id: cajazeiras, year: 2026, is_active: true },
    { name: "3º Ano A",  grade: "3º Ano EF",         shift: "Matutino",   unit_id: central,    year: 2026, is_active: true },
    { name: "5º Ano A",  grade: "5º Ano EF",         shift: "Integral",   unit_id: cajazeiras, year: 2026, is_active: true },
    { name: "7º Ano A",  grade: "7º Ano EF",         shift: "Matutino",   unit_id: central,    year: 2026, is_active: true },
    { name: "9º Ano A",  grade: "9º Ano EF",         shift: "Vespertino", unit_id: cajazeiras, year: 2026, is_active: true },
    { name: "1º EM A",   grade: "1º Ano EM",         shift: "Noturno",    unit_id: central,    year: 2026, is_active: true },
    { name: "2º EM A",   grade: "2º Ano EM",         shift: "Matutino",   unit_id: cajazeiras, year: 2026, is_active: true },
  ]).select();
  if (error) { err("classes", error); return []; }
  log(`${data.length} turmas`);
  return data;
}

/* ─── 4. STUDENTS ─── */
async function seedStudents(classes, units) {
  const central    = units.find(u => u.name.includes("Central")).id;
  const cajazeiras = units.find(u => u.name.includes("Cajazeiras")).id;

  const nomes = [
    "Ana Beatriz Santos Silva","Carlos Eduardo Oliveira","Mariana Souza Ferreira",
    "João Pedro Costa Lima","Larissa Almeida Nascimento","Rafael Torres Pereira",
    "Isabela Cardoso Rocha","Gabriel Mendes Barbosa","Letícia Nunes Carvalho",
    "Pedro Henrique Araujo","Sophia Martins Vieira","Lucas Fernandes Gomes",
    "Valentina Moura Ribeiro","Mateus Correia Lopes","Beatriz Pinto Teixeira",
    "Felipe Azevedo Castro","Amanda Ramos Monteiro","Thiago Cunha Borges",
    "Camila Rodrigues Faria","Bruno Moreira Andrade","Juliana Alves Magalhães",
    "Daniel Coelho Guimarães","Fernanda Lima Cavalcanti","Victor Hugo Reis Sousa",
    "Natalia Barros Freitas","Leonardo Pinheiro Duarte","Gabrielle Santana Cruz",
    "Eduardo Batista Tavares","Priscila Melo Queiroz","Renato Dias Nogueira",
    "Giovanna Fonseca Carneiro","Alexandre Costa Macedo","Thais Oliveira Sampaio",
    "Henrique Cardoso Fontes","Bianca Ferreira Muniz",
  ];

  const statuses = [
    "Ativo","Ativo","Ativo","Ativo","Ativo","Ativo","Ativo",
    "Ativo","Ativo","Pendente","Pendente","Inativo","Transferido",
  ];

  const tipos = ["Particular","Particular","Particular","Bolsista"];
  const genders = ["Masculino","Feminino"];

  const students = nomes.map((nome, i) => {
    const cls = classes[i % classes.length];
    const unit_id = cls.unit_id;
    const birthYear = randInt(2008, 2020);
    const cpf = `${randInt(100,999)}.${randInt(100,999)}.${randInt(100,999)}-${randInt(10,99)}`;
    return {
      name: nome,
      cpf,
      birth_date: dateStr(birthYear, randInt(1,12), randInt(1,28)),
      gender: i % 2 === 0 ? "Masculino" : "Feminino",
      birthplace: rand(["Salvador","Feira de Santana","Camaçari","Lauro de Freitas","Itabuna"]),
      status: statuses[i % statuses.length],
      enrollment_type: tipos[i % tipos.length],
      uses_transport: i % 3 === 0,
      class_id: cls.id,
      unit_id,
      previous_school: i % 4 === 0 ? rand(["Escola Municipal Castro Alves","Colégio Estadual Bahia","CEJA Salvador"]) : null,
      observations: i % 5 === 0 ? "Aluno com necessidades de acompanhamento pedagógico especial." : null,
    };
  });

  const { data, error } = await supabase.from("students").insert(students).select();
  if (error) { err("students", error); return []; }
  log(`${data.length} alunos`);
  return data;
}

/* ─── 5. GUARDIANS + STUDENT_GUARDIANS ─── */
async function seedGuardians(students) {
  const lastNames = ["Silva","Oliveira","Santos","Ferreira","Costa","Souza","Nascimento","Lima","Pereira"];
  const rels = ["Mãe","Pai","Mãe","Pai","Avó","Mãe"];

  const guardians = students.slice(0, 30).map((s, i) => {
    const parts = s.name.split(" ");
    const sobrenome = parts[parts.length - 1];
    const rel = rels[i % rels.length];
    const gFirst = rel === "Mãe" || rel === "Avó"
      ? rand(["Maria","Ana","Sandra","Cláudia","Fernanda","Patrícia","Luciana"])
      : rand(["José","João","Carlos","Paulo","Marcos","Roberto","André"]);
    return {
      name: `${gFirst} ${sobrenome}`,
      relationship: rel,
      cpf: `${randInt(100,999)}.${randInt(100,999)}.${randInt(100,999)}-${randInt(10,99)}`,
      phone: `(71) 9${randInt(8000,9999)}-${randInt(1000,9999)}`,
      email: `${gFirst.toLowerCase()}.${sobrenome.toLowerCase()}@gmail.com`,
      address: rand([
        "Rua das Acácias, 78 — Pituba",
        "Av. Tancredo Neves, 340 — Caminho das Árvores",
        "Rua Pará, 12 — Barra",
        "Travessa São João, 55 — Cajazeiras",
        "Rua Silveira Martins, 202 — Cabula",
      ]),
    };
  });

  const { data: gData, error: gErr } = await supabase.from("guardians").insert(guardians).select();
  if (gErr) { err("guardians", gErr); return; }
  log(`${gData.length} responsáveis`);

  const links = gData.map((g, i) => ({
    student_id: students[i].id,
    guardian_id: g.id,
    is_primary: true,
  }));
  const { error: lErr } = await supabase.from("student_guardians").insert(links);
  if (lErr) { err("student_guardians", lErr); return; }
  log(`${links.length} vínculos aluno-responsável`);
}

/* ─── 6. ENROLLMENTS ─── */
async function seedEnrollments(students) {
  const active = students.filter(s => s.status === "Ativo" || s.status === "Pendente");
  const enrollments = active.map(s => ({
    student_id: s.id,
    class_id: s.class_id,
    year: 2026,
    status: s.status === "Ativo" ? "Ativa" : "Ativa",
    enrollment_date: dateStr(2026, randInt(1,2), randInt(5,28)),
  }));

  // Transferred/inactive get closed enrollment
  const closed = students.filter(s => s.status === "Inativo" || s.status === "Transferido");
  closed.forEach(s => enrollments.push({
    student_id: s.id,
    class_id: s.class_id,
    year: 2026,
    status: s.status === "Transferido" ? "Transferida" : "Cancelada",
    enrollment_date: dateStr(2026, 1, randInt(5,20)),
  }));

  const { data, error } = await supabase.from("enrollments").insert(enrollments).select();
  if (error) { err("enrollments", error); return []; }
  log(`${data.length} matrículas`);
  return data;
}

/* ─── 7. GRADES ─── */
async function seedGrades(students, subjects) {
  const active = students.filter(s => s.status === "Ativo");
  const grades = [];
  const year = 2026;

  for (const student of active) {
    for (const subject of subjects.slice(0, 8)) {
      for (let unit = 1; unit <= 2; unit++) { // 2 units done so far in 2026
        grades.push({
          student_id: student.id,
          subject_id: subject.id,
          unit,
          score: randFloat(4.0, 10.0),
          year,
        });
      }
    }
  }

  // Insert in batches of 100
  for (let i = 0; i < grades.length; i += 100) {
    const batch = grades.slice(i, i + 100);
    const { error } = await supabase.from("grades").insert(batch);
    if (error) { err(`grades batch ${i}`, error); return; }
  }
  log(`${grades.length} notas lançadas`);
}

/* ─── 8. PAYMENTS ─── */
async function seedPayments(students) {
  const payments = [];
  const year = 2026;
  const amounts = { "Particular": 650.00, "Bolsista": 0.00 };

  for (const student of students) {
    const baseAmount = student.enrollment_type === "Bolsista"
      ? randFloat(80, 200)  // Bolsistas pagam valor reduzido
      : randFloat(580, 720);

    for (let month = 1; month <= 3; month++) {
      let status, paid_at = null;
      if (student.status === "Inativo" || student.status === "Transferido") {
        status = month === 1 ? "Pago" : "Atrasado";
      } else if (month === 1) {
        status = "Pago";
        paid_at = dateStr(2026, 1, randInt(5, 15));
      } else if (month === 2) {
        status = rand(["Pago","Pago","Pendente"]);
        if (status === "Pago") paid_at = dateStr(2026, 2, randInt(3, 20));
      } else {
        status = rand(["Pendente","Atrasado","Pago"]);
        if (status === "Pago") paid_at = dateStr(2026, 3, randInt(2, 28));
      }

      payments.push({
        student_id: student.id,
        reference_month: month,
        reference_year: year,
        amount: parseFloat(baseAmount.toFixed(2)),
        payment_method: status === "Pago" ? rand(["Pix","Dinheiro","Cartão"]) : null,
        status,
        due_date: dateStr(2026, month, 10),
        paid_at,
      });
    }
  }

  for (let i = 0; i < payments.length; i += 100) {
    const batch = payments.slice(i, i + 100);
    const { error } = await supabase.from("payments").insert(batch);
    if (error) { err(`payments batch ${i}`, error); return; }
  }
  log(`${payments.length} lançamentos financeiros`);
}

/* ─── 9. ATTENDANCE ─── */
async function seedAttendance(students, classes) {
  const records = [];
  // Generate attendance for the last 20 school days
  const schoolDays = [];
  let d = new Date("2026-03-01");
  while (schoolDays.length < 20) {
    if (d.getDay() !== 0 && d.getDay() !== 6) {
      schoolDays.push(d.toISOString().split("T")[0]);
    }
    d.setDate(d.getDate() + 1);
  }

  const active = students.filter(s => s.status === "Ativo");
  for (const student of active) {
    for (const date of schoolDays) {
      records.push({
        student_id: student.id,
        class_id: student.class_id,
        date,
        present: Math.random() > 0.12, // ~88% attendance rate
      });
    }
  }

  for (let i = 0; i < records.length; i += 200) {
    const batch = records.slice(i, i + 200);
    const { error } = await supabase.from("attendance").insert(batch);
    if (error) { err(`attendance batch ${i}`, error); return; }
  }
  log(`${records.length} registros de frequência`);
}

/* ─── 10. DOCUMENTS ─── */
async function seedDocuments(students) {
  const docTypes = [
    "Atestado de Matrícula",
    "Atestado de Frequência",
    "Histórico Escolar",
    "Atestado de Pagamento",
  ];

  const docs = [];
  for (const student of students.filter(s => s.status === "Ativo").slice(0, 15)) {
    const numDocs = randInt(1, 3);
    const types = [...docTypes].sort(() => Math.random() - 0.5).slice(0, numDocs);
    types.forEach(type => {
      docs.push({ student_id: student.id, type, status: "Emitido" });
    });
  }

  const { data, error } = await supabase.from("documents").insert(docs).select();
  if (error) { err("documents", error); return; }
  log(`${data.length} documentos emitidos`);
}

/* ─── MAIN ─── */
async function main() {
  console.log("\n🚀 Iniciando seed — Escola Castelo do Saber\n");

  // Check for existing data
  const { count } = await supabase.from("students").select("*", { count: "exact", head: true });
  if (count > 0) {
    console.log(`⚠️  Já existem ${count} alunos no banco. Abortando para evitar duplicatas.`);
    console.log("   Para resetar: apague os dados manualmente no Supabase e rode novamente.\n");
    process.exit(0);
  }

  const units    = await seedUnits();
  const subjects = await seedSubjects();
  const classes  = await seedClasses(units);
  const students = await seedStudents(classes, units);
  await seedGuardians(students);
  await seedEnrollments(students);
  await seedGrades(students, subjects);
  await seedPayments(students);
  await seedAttendance(students, classes);
  await seedDocuments(students);

  console.log("\n⚠️  Rode ANALYZE no SQL Editor pra atualizar stats do planner:");
  console.log("    (anon key não tem permissão pra ANALYZE — precisa rodar manual)");
  console.log("    ANALYZE units, subjects, classes, students, guardians,");
  console.log("            student_guardians, enrollments, grades, attendance,");
  console.log("            payments, installments, quarterly_reports, report_tokens,");
  console.log("            documents, contracts, employees, employee_payments;\n");

  console.log("\n✅ Seed concluído com sucesso!\n");
  console.log("Resumo:");
  console.log(`  • ${units.length} unidades`);
  console.log(`  • ${subjects.length} disciplinas`);
  console.log(`  • ${classes.length} turmas`);
  console.log(`  • ${students.length} alunos`);
  console.log(`  • Notas, frequência, pagamentos e documentos inseridos\n`);
}

main().catch(console.error);
