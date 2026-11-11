import { Document, Page, Text } from "@react-pdf/renderer";
import { baseStyles, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { formatBirthDate, genderSuffix, levelText } from "./student-info";

// Campo não preenchido vira traço pra secretaria completar à mão,
// em vez de o sistema chutar um valor.
const BLANK_NAME = "________________________________________";
const BLANK_DATE = "____/____/________";
const BLANK_TIME = "____:____";

function normalizeName(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

export function AtestadoComparecimento({ student, guardians = [], unit, logoSrc, details = {} }) {
  const attendeeName = (details.attendeeName || "").trim();
  const reason = (details.reason || "").trim().replace(/\.$/, "");
  const guardian = attendeeName
    ? guardians.find((g) => normalizeName(g.name) === normalizeName(attendeeName))
    : null;
  const suffix = genderSuffix(student);

  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>Atestado de Comparecimento</Text>

        <Text style={baseStyles.bodyIndented} hyphenationPenalty={10000}>
          Atesto para os devidos fins, que o(a) Sr(a).{" "}
          <Text style={baseStyles.bold}>{attendeeName || BLANK_NAME}</Text>
          {guardian?.cpf ? `, CPF ${guardian.cpf}` : ""}
          , compareceu a esta Instituição de Ensino no dia{" "}
          <Text style={baseStyles.bold}>{formatBirthDate(details.date) || BLANK_DATE}</Text>
          , das {details.startTime || BLANK_TIME} às {details.endTime || BLANK_TIME}
          {reason ? `, para ${reason}` : ""}
          , na qualidade de responsável pel{suffix} alun{suffix}{" "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          , matriculad{suffix} no{" "}
          <Text style={baseStyles.bold}>{student.className || "___"}</Text>
          {" "}{levelText(student.level)}.
        </Text>

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
