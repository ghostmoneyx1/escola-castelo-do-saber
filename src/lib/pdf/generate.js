import { pdf } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/client";
import { AtestadoMatricula } from "./atestado-matricula";
import { AtestadoFrequencia } from "./atestado-frequencia";
import { AtestadoTransferencia } from "./atestado-transferencia";
import { AtestadoPagamento, AtestadoQuitacao } from "./atestado-pagamento";
import { HistoricoEscolar } from "./historico-escolar";
import { BoletimInfantil } from "./boletim-infantil";
import { RelatorioFrequencia } from "./relatorio-frequencia";
import { resumirAluno } from "@/lib/frequencia/percentual";

async function fetchStudentData(studentId, options = {}) {
  const supabase = createClient();
  const year = new Date().getFullYear();

  const [studentRes, guardiansRes, gradesRes, paymentsRes, evalRes, attendanceRes] = await Promise.all([
    supabase
      .from("students")
      .select("*, classes(name, grade, shift), units(name)")
      .eq("id", studentId)
      .single(),
    supabase
      .from("student_guardians")
      .select("*, guardians(*)")
      .eq("student_id", studentId),
    supabase
      .from("grades")
      .select("*, subjects(name)")
      .eq("student_id", studentId)
      .eq("year", new Date().getFullYear()),
    supabase
      .from("payments")
      .select("*")
      .eq("student_id", studentId)
      .eq("reference_year", new Date().getFullYear())
      .order("reference_month"),
    options.semester
      ? supabase
          .from("infantil_evaluations")
          .select("id, semester, year, responses")
          .eq("student_id", studentId)
          .eq("semester", options.semester)
          .eq("year", year)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    options.withAttendance
      ? supabase
          .from("attendance")
          .select("present, date")
          .eq("student_id", studentId)
          .gte("date", `${year}-01-01`)
          .lte("date", `${year}-12-31`)
      : Promise.resolve({ data: null }),
  ]);

  const student = studentRes.data;
  if (!student) throw new Error("Aluno não encontrado");

  // Enrich student with class name — strip level suffix, detect level separately
  const rawGrade = student.classes?.grade || "";
  student.className = rawGrade
    .replace(/\s+ensino\s+fundamental\s*(i+)?/i, "")
    .replace(/\s+educa[cç][aã]o\s+infantil/i, "")
    .trim() || rawGrade;

  // Grupo 01–05 = Educação Infantil; 1º–5º Ano = Ensino Fundamental I
  student.level = /grupo\s*\d/i.test(student.className)
    ? "Educação Infantil"
    : "Ensino Fundamental I";

  const guardians = (guardiansRes.data || []).map((sg) => ({
    ...sg.guardians,
  }));
  const grades = gradesRes.data || [];
  const payments = paymentsRes.data || [];
  const unit = student.units?.name || "Matriz";
  const evaluation = evalRes?.data || null;

  const attendance = attendanceRes?.data ? resumirAluno(attendanceRes.data) : null;

  return { student, guardians, grades, payments, unit, evaluation, attendance };
}

function getDocumentComponent(type, data) {
  const { student, guardians, grades, payments, unit, logoSrc, evaluation, semester, attendance } = data;

  switch (type) {
    case "Atestado de Matrícula":
      return AtestadoMatricula({ student, guardians, unit, logoSrc });

    case "Atestado de Frequência":
      return AtestadoFrequencia({ student, guardians, unit, logoSrc, attendance });

    case "Atestado de Transferência":
      return AtestadoTransferencia({ student, guardians, unit, logoSrc });

    case "Histórico Escolar":
      return HistoricoEscolar({ student, guardians, grades, unit, logoSrc });

    case "Atestado de Pagamento":
      return AtestadoPagamento({ student, guardians, unit, payments, logoSrc });

    case "Atestado de Quitação de Débito":
      return AtestadoQuitacao({ student, guardians, unit, logoSrc });

    case "Boletim Infantil":
      return BoletimInfantil({ student, unit, logoSrc, evaluation, semester });

    default:
      throw new Error(`Tipo de documento não suportado: ${type}`);
  }
}

async function fetchLogoBase64() {
  try {
    const res = await fetch("/logo-escola.png");
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function sanitizeName(str) {
  if (!str) return "Documento";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/_$/, "");
}

async function downloadPdf(component, fileName) {
  const blob = await pdf(component).toBlob();
  const pdfBlob = new Blob([blob], { type: "application/pdf" });
  const url = window.URL.createObjectURL(pdfBlob);

  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  // Revogar cedo demais cancela o download em alguns navegadores.
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 1000);
}

export async function generateDocument(studentId, type, options = {}) {
  const fetchOptions = { ...options, withAttendance: type === "Atestado de Frequência" };
  const [data, logoSrc] = await Promise.all([fetchStudentData(studentId, fetchOptions), fetchLogoBase64()]);
  const component = getDocumentComponent(type, { ...data, logoSrc, semester: options.semester });
  await downloadPdf(component, `${sanitizeName(type)}_${sanitizeName(data.student?.name)}.pdf`);
  return { success: true };
}

export async function generateRelatorioFrequencia({ turma, unit, de, ate, relatorio }) {
  const logoSrc = await fetchLogoBase64();
  const component = RelatorioFrequencia({ turma, unit, de, ate, relatorio, logoSrc });
  await downloadPdf(component, `Relatorio_de_Frequencia_${sanitizeName(turma)}_${de}_a_${ate}.pdf`);
}
