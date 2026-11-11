import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { baseStyles, colors, formatDate, formatDateShort } from "./styles";
import { DocumentHeader } from "./header";
import { DocumentFooter, Signature } from "./footer";
import { FREQUENCIA_MINIMA, abaixoDoMinimo, formatPercentual } from "@/lib/frequencia/percentual";

const COLS = [
  { key: "n", label: "Nº", width: "7%" },
  { key: "name", label: "Aluno", width: "45%", align: "left" },
  { key: "dias", label: "Dias", width: "12%" },
  { key: "presencas", label: "Presenças", width: "12%" },
  { key: "faltas", label: "Faltas", width: "12%" },
  { key: "percentual", label: "Frequência", width: "12%" },
];

const styles = StyleSheet.create({
  meta: { fontSize: 10, marginBottom: 2 },
  low: { color: colors.accent, fontFamily: "Helvetica-Bold" },
  summary: { fontSize: 9, color: colors.muted, marginTop: 4 },
});

function cell(linha, i, key) {
  if (key === "n") return String(i + 1);
  if (key === "percentual") return formatPercentual(linha.percentual);
  return String(linha[key]);
}

export function RelatorioFrequencia({ turma, unit, de, ate, relatorio, logoSrc }) {
  return (
    <Document>
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader unit={unit} logoSrc={logoSrc} />

        <Text style={[baseStyles.title, { marginTop: 20, marginBottom: 15 }]}>Relatório de Frequência</Text>

        <Text style={styles.meta}>
          <Text style={baseStyles.bold}>Turma: </Text>{turma}
        </Text>
        <Text style={styles.meta}>
          <Text style={baseStyles.bold}>Período: </Text>
          {formatDateShort(de)} a {formatDateShort(ate)} — {relatorio.diasLetivos} dia(s) com chamada
        </Text>
        <Text style={styles.meta}>
          <Text style={baseStyles.bold}>Frequência da turma: </Text>
          {formatPercentual(relatorio.percentualTurma)}
        </Text>

        <View style={baseStyles.table}>
          <View style={baseStyles.tableRowHeader} fixed>
            {COLS.map((c) => (
              <View key={c.key} style={[baseStyles.tableCol, { width: c.width }]}>
                <Text style={baseStyles.tableCellHeader}>{c.label}</Text>
              </View>
            ))}
          </View>
          {relatorio.linhas.map((linha, i) => (
            <View key={linha.id} style={baseStyles.tableRow} wrap={false}>
              {COLS.map((c) => (
                <View key={c.key} style={[baseStyles.tableCol, { width: c.width }]}>
                  <Text
                    style={[
                      c.align === "left" ? baseStyles.tableCellLeft : baseStyles.tableCell,
                      c.key === "percentual" && abaixoDoMinimo(linha.percentual) ? styles.low : null,
                    ]}
                  >
                    {cell(linha, i, c.key)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.summary}>
          {relatorio.abaixoDoMinimo} aluno(s) abaixo de {FREQUENCIA_MINIMA}% (mínimo exigido pela LDB, art. 24, VI).
          {" "}Dias = chamadas registradas para o aluno no período.
        </Text>

        <Text style={[baseStyles.dateText, { marginTop: 25 }]}>{formatDate()}</Text>
        <Signature />
        <DocumentFooter />
      </Page>
    </Document>
  );
}
