import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

export function AtestadoPagamento({ student, guardians, unit, payments, logoSrc }) {
  const year = new Date().getFullYear();
  const paidPayments = (payments || []).filter((p) => p.status === "Pago");
  const totalPaid = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  const responsavel = guardians[0];

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Pagamento de Mensalidade
        </Text>

        <Text style={baseStyles.bodyIndented}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {responsavel ? `, responsável ${responsavel.name}${responsavel.cpf ? `, CPF ${responsavel.cpf}` : ""}` : ""}
          , matriculad{student.gender === "Feminino" ? "a" : "o"} no{" "}
          <Text style={baseStyles.bold}>{student.className || "___"}</Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil" : "do Ensino Fundamental I"}, encontra-se com as mensalidades
          em dia referentes ao ano letivo de {year}.
        </Text>

        {paidPayments.length > 0 && (
          <View style={{ marginTop: 15, marginBottom: 15 }}>
            <Text style={[baseStyles.body, baseStyles.bold, { marginBottom: 8 }]}>
              Meses quitados:
            </Text>
            {paidPayments.map((p, i) => (
              <Text key={i} style={{ fontSize: 10, marginBottom: 3, marginLeft: 20 }}>
                • {MONTHS[p.reference_month - 1]}/{p.reference_year} — R${" "}
                {Number(p.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                {p.payment_method ? ` (${p.payment_method})` : ""}
              </Text>
            ))}
            <Text style={[baseStyles.bold, { fontSize: 10, marginTop: 8, marginLeft: 20 }]}>
              Total: R$ {totalPaid.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        )}

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}

export function AtestadoQuitacao({ student, guardians, unit, logoSrc }) {
  const year = new Date().getFullYear();
  const responsavel = guardians[0];

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Atestado de Quitação de Débito
        </Text>

        <Text style={baseStyles.bodyIndented}>
          Atesto para os devidos fins, que{" "}
          {student.gender === "Feminino" ? "a aluna " : "o aluno "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {responsavel ? `, responsável ${responsavel.name}${responsavel.cpf ? `, CPF ${responsavel.cpf}` : ""}` : ""}
          , matriculad{student.gender === "Feminino" ? "a" : "o"} no{" "}
          <Text style={baseStyles.bold}>{student.className || "___"}</Text>
          {" "}{student.level === "Educação Infantil" ? "da Educação Infantil" : "do Ensino Fundamental I"}, encontra-se{" "}
          <Text style={baseStyles.bold}>sem débitos pendentes</Text>
          {" "}junto a esta Instituição de Ensino referentes ao ano letivo de {year}.
        </Text>

        <Text style={[baseStyles.body, { marginTop: 15 }]}>
          O presente atestado é emitido para os fins que se fizerem necessários.
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
