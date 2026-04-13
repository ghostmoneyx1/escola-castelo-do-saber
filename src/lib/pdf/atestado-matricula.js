import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";

export function AtestadoMatricula({ student, guardians, unit, logoSrc }) {
  const mae = guardians.find((g) => g.relationship === "Mãe");
  const pai = guardians.find((g) => g.relationship === "Pai");
  const responsavel = mae || pai || guardians[0];
  const year = new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Matrícula {year}
        </Text>

        <Text style={baseStyles.bodyIndented}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {student.birth_date
            ? `, nascid${student.gender === "Feminino" ? "a" : "o"} em ${new Date(student.birth_date).toLocaleDateString("pt-BR")}`
            : ""}
          {pai ? `, filh${student.gender === "Feminino" ? "a" : "o"} do senhor ${pai.name}` : ""}
          {mae ? ` e senhora ${mae.name}` : ""}
          {!pai && !mae && responsavel
            ? `, cujo responsável é ${responsavel.name}${responsavel.cpf ? `, CPF ${responsavel.cpf}` : ""}`
            : ""}
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
