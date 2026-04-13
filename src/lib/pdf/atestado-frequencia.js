import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";

export function AtestadoFrequencia({ student, guardians, unit, logoSrc }) {
  const responsavel = guardians[0];

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Frequência {new Date().getFullYear()}
        </Text>

        <Text style={baseStyles.bodyIndented}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {responsavel ? `, responsável ${responsavel.name}${responsavel.cpf ? `, CPF ${responsavel.cpf}` : ""}` : ""}
          , encontra-se regularmente matriculad{student.gender === "Feminino" ? "a" : "o"} e
          frequentando as aulas nesta Instituição de Ensino, cursando o{" "}
          <Text style={baseStyles.bold}>
            {student.className || "___"}
          </Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil" : "do Ensino Fundamental I"}, no
          ano letivo de {new Date().getFullYear()}.
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
