import { Document, Page, Text } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { birthText, filiacaoText, levelText, nextStage, resolveGuardians } from "./student-info";

export function AtestadoTransferencia({ student, guardians, unit, logoSrc }) {
  const parentes = resolveGuardians(guardians);
  const year = new Date().getFullYear();
  const isFeminine = student.gender === "Feminino";
  const next = nextStage(student.className);

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Transferência — {year}
        </Text>

        <Text style={baseStyles.bodyIndented} hyphenationPenalty={10000}>
          Atesto para os devidos fins, que{" "}
          {isFeminine ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {birthText(student)}
          {filiacaoText(student, parentes)}
          , concluiu o{" "}
          <Text style={baseStyles.bold}>{student.className || "______"}</Text>
          {" "}{levelText(student.level)}, estando apt{isFeminine ? "a" : "o"} a cursar o{" "}
          <Text style={baseStyles.bold}>{next?.grade || "______"}</Text>
          {" "}{levelText(next?.level || student.level)}.
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
