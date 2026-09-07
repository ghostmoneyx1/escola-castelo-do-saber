import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { birthText, filiacaoText, resolveGuardians } from "./student-info";

export function AtestadoMatricula({ student, guardians, unit, logoSrc }) {
  const parentes = resolveGuardians(guardians);
  const year = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Matrícula {year}
        </Text>

        <Text style={baseStyles.bodyIndented} hyphenationPenalty={10000}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {birthText(student)}
          {filiacaoText(student, parentes)}
          , encontra-se matriculad{student.gender === "Feminino" ? "a" : "o"} em nossa Instituição
          cursando o{" "}
          <Text style={baseStyles.bold}>
            {student.className || "___"}
          </Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil." : "do Ensino Fundamental I."}
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
