import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { baseStyles, colors, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";

const s = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    width: 120,
    color: colors.muted,
  },
  infoValue: {
    fontSize: 9,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    marginTop: 15,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  // Grade table
  gradeTable: {
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  gradeRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  gradeHeaderRow: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  subjectCol: {
    width: "30%",
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
  },
  gradeCol: {
    width: "10%",
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
    alignItems: "center",
  },
  chCol: {
    width: "10%",
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
    alignItems: "center",
  },
  headerText: {
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
  // School history table
  schoolRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  schoolCol: {
    padding: 4,
    borderRightWidth: 0.5,
    borderRightColor: colors.border,
  },
  legendBox: {
    marginTop: 12,
    padding: 8,
    backgroundColor: colors.lightBg,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 7,
    color: colors.muted,
  },
});

const SUBJECTS = [
  "Língua Portuguesa",
  "Língua Estrangeira (Inglês)",
  "Geografia",
  "História",
  "Ciências",
  "Matemática",
  "Educação Artística",
  "Ensino Religioso",
  "Educação Física",
];

const YEARS = ["1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano"];

export function HistoricoEscolar({ student, guardians, grades, unit, logoSrc }) {
  const mae = guardians.find((g) => g.relationship === "Mãe");
  const pai = guardians.find((g) => g.relationship === "Pai");
  const responsavel = mae || pai || guardians[0];

  // Organize grades by subject name and year
  function getGrade(subjectName, yearIndex) {
    // yearIndex 0 = 1º Ano, etc.
    // We match by subject name and the grade's year context
    const match = (grades || []).find(
      (g) =>
        g.subjects?.name &&
        subjectName.toLowerCase().includes(g.subjects.name.toLowerCase()) &&
        g.unit === yearIndex + 1
    );
    return match?.score;
  }

  // Calculate average per subject across all units for current year
  function getSubjectAvg(subjectName) {
    const matching = (grades || []).filter(
      (g) => g.subjects?.name && subjectName.toLowerCase().includes(g.subjects.name.toLowerCase())
    );
    if (matching.length === 0) return null;
    const sum = matching.reduce((a, g) => a + Number(g.score || 0), 0);
    return (sum / matching.length).toFixed(1);
  }

  return (
    <Document>
      <Page size="A4" style={[baseStyles.page, { padding: 35 }]}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={[baseStyles.title, { fontSize: 13, marginTop: 15, marginBottom: 15 }]}>
          Histórico Escolar {student.level === "Educação Infantil" ? "da Educação Infantil" : "do Ensino Fundamental I"}
        </Text>

        {/* Student info */}
        <View style={{ marginBottom: 12 }}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Nome do Aluno:</Text>
            <Text style={[s.infoValue, { fontFamily: "Helvetica-Bold" }]}>{student.name}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Data de Nascimento:</Text>
            <Text style={s.infoValue}>
              {student.birth_date ? new Date(student.birth_date).toLocaleDateString("pt-BR") : "—"}
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Mãe:</Text>
                <Text style={s.infoValue}>{mae?.name || (!pai && responsavel ? responsavel.name : "—")}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Pai:</Text>
                <Text style={s.infoValue}>{pai?.name || "—"}</Text>
              </View>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Município:</Text>
                <Text style={s.infoValue}>Salvador</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View style={s.infoRow}>
                <Text style={s.infoLabel}>Estado:</Text>
                <Text style={s.infoValue}>Bahia</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Grades Table */}
        <Text style={s.sectionTitle}>Áreas de Conhecimento</Text>
        <View style={s.gradeTable}>
          {/* Header */}
          <View style={s.gradeHeaderRow}>
            <View style={[s.subjectCol]}>
              <Text style={s.headerText}>Disciplina</Text>
            </View>
            {YEARS.map((year) => (
              <View key={year} style={[s.gradeCol]}>
                <Text style={s.headerText}>{year}</Text>
              </View>
            ))}
            <View style={[s.gradeCol]}>
              <Text style={s.headerText}>CH</Text>
            </View>
          </View>

          {/* Subjects */}
          {SUBJECTS.map((subject, idx) => (
            <View
              key={subject}
              style={[s.gradeRow, idx % 2 === 0 ? { backgroundColor: "#fafafa" } : {}]}
            >
              <View style={s.subjectCol}>
                <Text style={s.cellTextLeft}>{subject}</Text>
              </View>
              {YEARS.map((_, yi) => {
                const score = getGrade(subject, yi);
                return (
                  <View key={yi} style={s.gradeCol}>
                    <Text style={s.cellText}>
                      {score != null ? score : "—"}
                    </Text>
                  </View>
                );
              })}
              <View style={s.chCol}>
                <Text style={s.cellText}>—</Text>
              </View>
            </View>
          ))}
        </View>

        {/* School history */}
        <Text style={s.sectionTitle}>Estudos Realizados</Text>
        <View style={s.gradeTable}>
          <View style={s.gradeHeaderRow}>
            <View style={[s.schoolCol, { width: "15%" }]}>
              <Text style={s.headerText}>Série</Text>
            </View>
            <View style={[s.schoolCol, { width: "15%" }]}>
              <Text style={s.headerText}>Ano</Text>
            </View>
            <View style={[s.schoolCol, { width: "45%" }]}>
              <Text style={s.headerText}>Estabelecimento de Ensino</Text>
            </View>
            <View style={[s.schoolCol, { width: "15%" }]}>
              <Text style={s.headerText}>Município</Text>
            </View>
            <View style={[s.schoolCol, { width: "10%" }]}>
              <Text style={s.headerText}>UF</Text>
            </View>
          </View>
          {YEARS.map((year, i) => (
            <View key={i} style={s.schoolRow}>
              <View style={[s.schoolCol, { width: "15%" }]}>
                <Text style={s.cellText}>{year}</Text>
              </View>
              <View style={[s.schoolCol, { width: "15%" }]}>
                <Text style={s.cellText}>{i === 0 ? new Date().getFullYear() - (YEARS.length - 1 - i) : "—"}</Text>
              </View>
              <View style={[s.schoolCol, { width: "45%" }]}>
                <Text style={s.cellTextLeft}>
                  {i === 0 ? (student.previous_school || "Escola Castelo do Saber") : "—"}
                </Text>
              </View>
              <View style={[s.schoolCol, { width: "15%" }]}>
                <Text style={s.cellText}>{i === 0 ? "Salvador" : "—"}</Text>
              </View>
              <View style={[s.schoolCol, { width: "10%" }]}>
                <Text style={s.cellText}>{i === 0 ? "BA" : "—"}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Legend */}
        <View style={s.legendBox}>
          <Text style={s.legendText}>
            LEGENDA: N — Nota | CH — Carga Horária | I — Integrado | A — Aproximado
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 30, justifyContent: "space-between" }}>
          <View style={{ alignItems: "center", width: "45%" }}>
            <View style={[baseStyles.signatureLine, { width: "100%" }]} />
            <Text style={baseStyles.signatureName}>Urlania Laerte C. Mota</Text>
            <Text style={baseStyles.signatureRole}>Diretora</Text>
          </View>
          <View style={{ alignItems: "center", width: "45%" }}>
            <View style={[baseStyles.signatureLine, { width: "100%" }]} />
            <Text style={baseStyles.signatureName}>Secretário(a)</Text>
            <Text style={baseStyles.signatureRole}>Carimbo e assinatura</Text>
          </View>
        </View>

        <DocumentFooter />
      </Page>
    </Document>
  );
}
