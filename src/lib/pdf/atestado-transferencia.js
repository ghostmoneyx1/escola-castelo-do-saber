import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { birthText, filiacaoText, resolveGuardians } from "./student-info";

export function AtestadoTransferencia({ student, guardians, unit, logoSrc }) {
  const parentes = resolveGuardians(guardians);
  const year = new Date().getFullYear();

  // Try to determine next grade
  const currentGrade = student.className || "";
  const gradeMatch = currentGrade.match(/(\d+)º/);
  const currentNumber = gradeMatch ? parseInt(gradeMatch[1]) : null;
  const nextGrade = currentNumber && currentNumber < 5
    ? `${currentNumber + 1}º Ano`
    : "___";

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Transferência
        </Text>

        <Text style={baseStyles.bodyIndented}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {birthText(student)}
          {filiacaoText(student, parentes)}
          , cursou o{" "}
          <Text style={baseStyles.bold}>{student.className || "___"}</Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil" : "do Ensino Fundamental I"} em nossa Instituição de Ensino no ano letivo de{" "}
          {year - 1}, estando apt{student.gender === "Feminino" ? "a" : "o"} para cursar{" "}
          <Text style={baseStyles.bold}>{nextGrade}</Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil." : "do Ensino Fundamental I."}
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
