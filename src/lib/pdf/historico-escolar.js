import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { baseStyles, colors, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter } from "./footer";
import { formatBirthDate, levelText, resolveGuardians } from "./student-info";
import {
  HISTORICO_SUBJECTS,
  HISTORICO_YEARS,
  formatScore,
  subjectAverages,
  yearIndex,
} from "./historico-data";
import { SCHOOL_LEGAL_NAME } from "@/lib/constants";

// Tudo dimensionado para caber em UMA folha A4 (pedido da secretaria).
const PAGE_PADDING = 30;

const s = StyleSheet.create({
  page: {
    padding: PAGE_PADDING,
    paddingBottom: 45,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: colors.text,
    lineHeight: 1.3,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 6,
    marginBottom: 8,
  },
  // Bloco de identificação
  infoBox: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  infoCell: {
    flexDirection: "row",
    paddingVertical: 2.5,
    paddingHorizontal: 5,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
  },
  infoLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    marginRight: 4,
  },
  infoValue: {
    fontSize: 8.5,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 3,
  },
  // Tabelas
  table: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  headRow: {
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  cell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
    justifyContent: "center",
  },
  headText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },
  cellText: {
    fontSize: 8,
    textAlign: "center",
  },
  cellTextLeft: {
    fontSize: 8,
  },
  cellTextBold: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  legend: {
    marginTop: 5,
    fontSize: 7,
    color: colors.muted,
  },
  // Certificado
  certBox: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  certTitle: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: 4,
  },
  certText: {
    fontSize: 9,
    lineHeight: 1.6,
    textAlign: "justify",
  },
  date: {
    fontSize: 9,
    textAlign: "right",
    marginTop: 12,
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signature: {
    alignItems: "center",
    width: "42%",
  },
});

const SUBJECT_COL = "25%";
const YEAR_COL = "15%";
const SCORE_COL = "7.5%";

function InfoCell({ label, value, width, bold }) {
  return (
    <View style={[s.infoCell, { width }]}>
      <Text style={s.infoLabel}>{label}</Text>
      <Text style={[s.infoValue, bold ? baseStyles.bold : null]}>{value || " "}</Text>
    </View>
  );
}

export function HistoricoEscolar({ student, guardians, grades, unit, logoSrc }) {
  const { mae, pai, responsavel } = resolveGuardians(guardians);
  const averages = subjectAverages(grades);
  const currentYear = new Date().getFullYear();
  const currentIndex = yearIndex(student.className);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={s.title}>Histórico Escolar {levelText(student.level)}</Text>

        {/* Identificação */}
        <View style={s.infoBox}>
          <View style={s.infoRow}>
            <InfoCell label="Nome do Aluno:" value={student.name} width="70%" bold />
            <InfoCell label="Data de Nascimento:" value={formatBirthDate(student.birth_date)} width="30%" />
          </View>
          <View style={s.infoRow}>
            <InfoCell label="Mãe:" value={mae?.name || (!pai && responsavel ? responsavel.name : "")} width="50%" />
            <InfoCell label="Pai:" value={pai?.name} width="50%" />
          </View>
          <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
            <InfoCell label="Município:" value="Salvador" width="40%" />
            <InfoCell label="Estado:" value="Bahia" width="30%" />
            <InfoCell label="País:" value="Brasil" width="30%" />
          </View>
        </View>

        {/* Notas por área */}
        <Text style={s.sectionTitle}>Áreas de Conhecimento</Text>
        <View style={s.table}>
          <View style={s.headRow}>
            <View style={[s.cell, { width: SUBJECT_COL }]}>
              <Text style={s.headText}>Áreas de Conhecimento</Text>
            </View>
            {HISTORICO_YEARS.map((year) => (
              <View key={year} style={{ width: YEAR_COL, borderRightWidth: 0.5, borderRightColor: colors.border }}>
                <Text style={[s.headText, { paddingVertical: 2 }]}>{year}</Text>
                <View style={{ flexDirection: "row", borderTopWidth: 0.5, borderTopColor: colors.border }}>
                  <Text style={[s.headText, { width: "50%", paddingVertical: 2, borderRightWidth: 0.5, borderRightColor: colors.border }]}>N</Text>
                  <Text style={[s.headText, { width: "50%", paddingVertical: 2 }]}>CH</Text>
                </View>
              </View>
            ))}
          </View>

          {HISTORICO_SUBJECTS.map((subject) => (
            <View key={subject.label} style={s.row}>
              <View style={[s.cell, { width: SUBJECT_COL }]}>
                <Text style={s.cellTextLeft}>{subject.label}</Text>
              </View>
              {HISTORICO_YEARS.map((year, index) => (
                <View key={year} style={{ flexDirection: "row", width: YEAR_COL }}>
                  <View style={[s.cell, { width: "50%" }]}>
                    <Text style={s.cellText}>
                      {index === currentIndex ? formatScore(averages[subject.label]) : " "}
                    </Text>
                  </View>
                  <View style={[s.cell, { width: "50%" }]}>
                    <Text style={s.cellText}> </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <View style={[s.row, { borderBottomWidth: 0 }]}>
            <View style={[s.cell, { width: SUBJECT_COL }]}>
              <Text style={s.cellTextBold}>Total de Carga Horária</Text>
            </View>
            {HISTORICO_YEARS.map((year) => (
              <View key={year} style={[s.cell, { width: YEAR_COL }]}>
                <Text style={s.cellText}> </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Estudos realizados */}
        <Text style={s.sectionTitle}>Estudos Realizados</Text>
        <View style={s.table}>
          <View style={s.headRow}>
            <View style={[s.cell, { width: "12%" }]}><Text style={s.headText}>Série</Text></View>
            <View style={[s.cell, { width: "12%" }]}><Text style={s.headText}>Ano</Text></View>
            <View style={[s.cell, { width: "51%" }]}><Text style={s.headText}>Estabelecimento de Ensino</Text></View>
            <View style={[s.cell, { width: "17%" }]}><Text style={s.headText}>Município</Text></View>
            <View style={[s.cell, { width: "8%" }]}><Text style={s.headText}>UF</Text></View>
          </View>
          {HISTORICO_YEARS.map((year, index) => {
            const isCurrent = index === currentIndex;
            return (
              <View key={year} style={[s.row, index === HISTORICO_YEARS.length - 1 ? { borderBottomWidth: 0 } : null]}>
                <View style={[s.cell, { width: "12%" }]}><Text style={s.cellText}>{year}</Text></View>
                <View style={[s.cell, { width: "12%" }]}><Text style={s.cellText}>{isCurrent ? currentYear : " "}</Text></View>
                <View style={[s.cell, { width: "51%" }]}><Text style={s.cellTextLeft}>{isCurrent ? SCHOOL_LEGAL_NAME : " "}</Text></View>
                <View style={[s.cell, { width: "17%" }]}><Text style={s.cellText}>{isCurrent ? "Salvador" : " "}</Text></View>
                <View style={[s.cell, { width: "8%" }]}><Text style={s.cellText}>{isCurrent ? "BA" : " "}</Text></View>
              </View>
            );
          })}
        </View>

        <Text style={s.legend}>
          LEGENDA: N — Nota | CH — Carga Horária | I — Integrado | A — Aproximado | N — Nivelado
        </Text>

        {/* Certificado — os traços ficam em branco de propósito: a secretaria preenche à mão */}
        <View style={s.certBox}>
          <Text style={s.certTitle}>Certificado</Text>
          <Text style={s.certText} hyphenationPenalty={10000}>
            Certificamos que <Text style={baseStyles.bold}>{student.name}</Text> concluiu o
            {" "}________________ {levelText(student.level)} no ano letivo de ____________,
            na forma das Leis de Educação vigente no país e do Regime Escolar.
          </Text>
        </View>

        <Text style={s.date}>{formatDate()}</Text>

        <View style={s.signatures}>
          <View style={s.signature}>
            <View style={[baseStyles.signatureLine, { width: "100%" }]} />
            <Text style={baseStyles.signatureName}>Urlania Laerte C. Mota</Text>
            <Text style={baseStyles.signatureRole}>Diretora (carimbo e assinatura)</Text>
          </View>
          <View style={s.signature}>
            <View style={[baseStyles.signatureLine, { width: "100%" }]} />
            <Text style={baseStyles.signatureName}>Secretário(a)</Text>
            <Text style={baseStyles.signatureRole}>Carimbo e assinatura</Text>
          </View>
        </View>

        <DocumentFooter style={{ left: PAGE_PADDING, right: PAGE_PADDING, bottom: 18 }} />
      </Page>
    </Document>
  );
}
