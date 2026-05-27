import { Document, Page, Text, View } from "@react-pdf/renderer";
import { baseStyles, colors, formatDate } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { AREAS, NIVEIS, NIVEL_MAP, SEMESTER_LABELS } from "@/lib/boletim-infantil";

const styles = {
  intro: {
    fontSize: 9,
    color: colors.muted,
    textAlign: "center",
    marginBottom: 14,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 14,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 8,
    color: colors.text,
  },
  areaBlock: {
    marginBottom: 12,
    borderWidth: 0.6,
    borderColor: colors.border,
    borderStyle: "solid",
  },
  areaHeader: {
    backgroundColor: "#eef2f7",
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 0.6,
    borderBottomColor: colors.border,
  },
  areaTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  avaliarBlock: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 0.4,
    borderBottomColor: colors.border,
    borderBottomStyle: "solid",
    backgroundColor: "#fafafa",
  },
  avaliarLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  avaliarItem: {
    fontSize: 8,
    color: colors.text,
    marginLeft: 8,
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
    paddingVertical: 5,
    paddingHorizontal: 8,
    fontSize: 9,
  },
  cellMark: {
    width: 52,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.4,
    borderLeftColor: colors.border,
    borderLeftStyle: "solid",
  },
  cellMarkHeader: {
    width: 52,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.4,
    borderLeftColor: colors.border,
    borderLeftStyle: "solid",
    flexDirection: "row",
    gap: 3,
  },
  cellMarkHeaderText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: colors.text,
  },
  filledDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
  },
  emptyCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 0.8,
    borderColor: "#94a3b8",
    borderStyle: "solid",
    backgroundColor: "transparent",
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
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={baseStyles.title}>
          Boletim Infantil — {semesterLabel} / {year}
        </Text>

        <Text style={baseStyles.bodyIndented}>
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
              <Text style={styles.legendText}>{n.label}</Text>
            </View>
          ))}
        </View>

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
                <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold", color: colors.muted }}>Critério</Text>
              </View>
              {NIVEIS.map(n => (
                <View key={n.value} style={styles.cellMarkHeader}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: n.hex }} />
                  <Text style={styles.cellMarkHeaderText}>{n.short}</Text>
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

        <Text style={baseStyles.dateText}>{formatDate()}</Text>

        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
