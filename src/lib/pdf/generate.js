import { pdf } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/client";
import { AtestadoMatricula } from "./atestado-matricula";
import { AtestadoFrequencia } from "./atestado-frequencia";
import { AtestadoTransferencia } from "./atestado-transferencia";
import { AtestadoPagamento, AtestadoQuitacao } from "./atestado-pagamento";
import { HistoricoEscolar } from "./historico-escolar";
import { BoletimInfantil } from "./boletim-infantil";

async function fetchStudentData(studentId, options = {}) {
  const supabase = createClient();
  const year = new Date().getFullYear();

  const [studentRes, guardiansRes, gradesRes, paymentsRes, evalRes] = await Promise.all([
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

  // Include relationship from junction table (student_guardians)
  const guardians = (guardiansRes.data || []).map((sg) => ({
    ...sg.guardians,
  }));
  const grades = gradesRes.data || [];
  const payments = paymentsRes.data || [];
  const unit = student.units?.name || "Matriz";
  const evaluation = evalRes?.data || null;

  return { student, guardians, grades, payments, unit, evaluation };
}

function getDocumentComponent(type, data) {
  const { student, guardians, grades, payments, unit, logoSrc, evaluation, semester } = data;

  switch (type) {
    case "Atestado de Matrícula":
      return AtestadoMatricula({ student, guardians, unit, logoSrc });

    case "Atestado de Frequência":
      return AtestadoFrequencia({ student, guardians, unit, logoSrc });

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

export async function generateDocument(studentId, type, options = {}) {
  const [data, logoSrc] = await Promise.all([fetchStudentData(studentId, options), fetchLogoBase64()]);
  const component = getDocumentComponent(type, { ...data, logoSrc, semester: options.semester });
  const blob = await pdf(component).toBlob();

  // Ensure Blob is explicitly typed
  const pdfBlob = new Blob([blob], { type: "application/pdf" });

  // Sanitize filename to avoid OS weirdness
  const sanitizeName = (str) => {
    if (!str) return "Documento";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-zA-Z0-9]/g, "_") // replace non-alphanumeric with underscore
      .replace(/_+/g, "_") // remove duplicate underscores
      .replace(/_$/, ""); // remove trailing underscore
  };

  const safeType = sanitizeName(type);
  const safeName = sanitizeName(data.student?.name);
  const fileName = `${safeType}_${safeName}.pdf`;

  // Trigger download properly
  const url = window.URL.createObjectURL(pdfBlob);

  const link = document.createElement("a");
  link.style.display = "none";
  link.href = url;
  link.setAttribute("download", fileName);

  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }, 1000); // Wait longer before revoke

  return { success: true };
}
