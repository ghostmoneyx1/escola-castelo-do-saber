import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, colors, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter } from "./footer";
import { AREAS, NIVEIS, NIVEL_MAP, SEMESTER_LABELS } from "@/lib/boletim-infantil";

const NIVEL_ABBR = { verde: "E", amarelo: "D", vermelho: "A" };

const styles = {
  page: {
    padding: 26,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: colors.text,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: colors.primary,
    marginTop: 8,
    marginBottom: 5,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  studentLine: {
    fontSize: 9,
    textAlign: "center",
    marginBottom: 4,
  },
  intro: {
    fontSize: 7,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 5,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendText: {
    fontSize: 7,
    color: colors.text,
  },
  areasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  areaBlock: {
    width: "49%",
    marginBottom: 7,
    borderWidth: 0.6,
    borderColor: colors.border,
    borderStyle: "solid",
  },
  areaHeader: {
    backgroundColor: "#eef2f7",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.6,
    borderBottomColor: colors.border,
  },
  areaTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  avaliarBlock: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderBottomWidth: 0.4,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    backgroundColor: "#fafafa",
  },
  avaliarLabel: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  avaliarItem: {
    fontSize: 6.5,
    color: colors.text,
    marginLeft: 4,
    lineHeight: 1.2,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
  },
  rowHeader: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
    borderBottomWidth: 0.6,
    borderBottomColor: colors.border,
  },
  cellCriterio: {
    flex: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 7.5,
  },
  cellMark: {
    width: 34,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.4,
    borderLeftColor: colors.border,
    borderLeftStyle: "solid",
  },
  cellMarkHeader: {
    width: 34,
    paddingVertical: 3,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.4,
    borderLeftColor: colors.border,
    borderLeftStyle: "solid",
    flexDirection: "row",
    gap: 2,
  },
  cellMarkHeaderText: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
  },
  filledDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 1.2,
  },
  emptyCircle: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 0.8,
    borderColor: "#94a3b8",
    borderStyle: "solid",
    backgroundColor: "transparent",
  },
  dateText: {
    fontSize: 9,
    textAlign: "right",
    marginTop: 10,
  },
  signatureContainer: {
    marginTop: 16,
    alignItems: "center",
  },
};

function MarkCell({ active, nivel }) {
  if (active) {
    return (
      <View style={styles.cellMark}>
        <View style={{ ...styles.filledDot, backgroundColor: nivel.hex, borderColor: nivel.hex }} />
      </View>
    );
  }
  return (
    <View style={styles.cellMark}>
      <View style={styles.emptyCircle} />
    </View>
  );
}

export function BoletimInfantil({ student, unit, logoSrc, evaluation, semester }) {
  const responses = evaluation?.responses || {};
  const semesterLabel = SEMESTER_LABELS[semester] || SEMESTER_LABELS[1];
  const year = evaluation?.year || new Date().getFullYear();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={styles.title}>
          Boletim Infantil — {semesterLabel} / {year}
        </Text>

        <Text style={styles.studentLine}>
          {student.gender === "Feminino" ? "Aluna: " : "Aluno: "}
          <Text style={baseStyles.bold}>{student.name}</Text>
          {student.className ? ` — ${student.className}` : ""}
          {student.classes?.shift ? ` — ${student.classes.shift}` : ""}
        </Text>

        <Text style={styles.intro}>
          Sistema de avaliação por semáforo. Cada critério é marcado conforme o desenvolvimento da criança ao longo do semestre.
        </Text>

        <View style={styles.legendRow}>
          {NIVEIS.map(n => (
            <View key={n.value} style={styles.legendItem}>
              <View style={{ ...styles.legendDot, backgroundColor: n.hex }} />
              <Text style={styles.legendText}>{NIVEL_ABBR[n.value]} — {n.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.areasGrid}>
          {AREAS.map(area => (
            <View key={area.id} style={styles.areaBlock} wrap={false}>
              <View style={styles.areaHeader}>
                <Text style={styles.areaTitle}>{area.label}</Text>
              </View>
              {area.avaliar && area.avaliar.length > 0 && (
                <View style={styles.avaliarBlock}>
                  <Text style={styles.avaliarLabel}>Avaliar:</Text>
                  {area.avaliar.map((t, i) => (
                    <Text key={i} style={styles.avaliarItem}>• {t}</Text>
                  ))}
                </View>
              )}
              <View style={styles.rowHeader}>
                <View style={styles.cellCriterio}>
                  <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: colors.muted }}>Critério</Text>
                </View>
                {NIVEIS.map(n => (
                  <View key={n.value} style={styles.cellMarkHeader}>
                    <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: n.hex }} />
                    <Text style={styles.cellMarkHeaderText}>{NIVEL_ABBR[n.value]}</Text>
                  </View>
                ))}
              </View>
              {area.items.map(item => {
                const current = responses[item.id];
                return (
                  <View key={item.id} style={styles.row}>
                    <View style={styles.cellCriterio}>
                      <Text>{item.label}</Text>
                    </View>
                    {NIVEIS.map(n => (
                      <MarkCell key={n.value} active={current === n.value} nivel={n} />
                    ))}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        <Text style={styles.dateText}>{formatDate()}</Text>

        <View style={styles.signatureContainer}>
          <View style={baseStyles.signatureLine} />
          <Text style={baseStyles.signatureName}>Urlania Laerte C. Mota</Text>
          <Text style={baseStyles.signatureRole}>Diretora — NTE 26-85/2021</Text>
        </View>

        <DocumentFooter />
      </Page>
    </Document>
  );
}
