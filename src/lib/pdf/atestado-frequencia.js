import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { birthText, filiacaoText, resolveGuardians } from "./student-info";
import { formatPercentual } from "@/lib/frequencia/percentual";

export function AtestadoFrequencia({ student, guardians, unit, logoSrc, attendance }) {
  const parentes = resolveGuardians(guardians);

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Frequência {new Date().getFullYear()}
        </Text>

        <Text style={baseStyles.bodyIndented} hyphenationPenalty={10000}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {birthText(student)}
          {filiacaoText(student, parentes)}
          , encontra-se regularmente matriculad{student.gender === "Feminino" ? "a" : "o"} e
          frequentando as aulas nesta Instituição de Ensino, cursando o{" "}
          <Text style={baseStyles.bold}>
            {student.className || "___"}
          </Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil" : "do Ensino Fundamental I"}, no
          ano letivo de {new Date().getFullYear()}
          {attendance?.dias ? (
            <>
              , com frequência de{" "}
              <Text style={baseStyles.bold}>{formatPercentual(attendance.percentual)}</Text>
              {" "}({attendance.presencas} presença{attendance.presencas === 1 ? "" : "s"} em{" "}
              {attendance.dias} dia{attendance.dias === 1 ? "" : "s"} letivo{attendance.dias === 1 ? "" : "s"} registrado{attendance.dias === 1 ? "" : "s"} até esta data)
            </>
          ) : null}
          .
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
