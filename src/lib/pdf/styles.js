import { StyleSheet, Font } from "@react-pdf/renderer";

// No need to register built-in fonts like Helvetica

export const colors = {
  primary: "#1a3a6b",
  secondary: "#d4a017",
  accent: "#c0392b",
  text: "#1a1a1a",
  muted: "#555555",
  border: "#cccccc",
  lightBg: "#f5f5f5",
};

export const baseStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: colors.text,
    lineHeight: 1.6,
  },
  // Header
  headerContainer: {
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    borderBottomStyle: "solid",
    paddingBottom: 12,
  },
  schoolName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  schoolSubtitle: {
    fontSize: 8,
    color: colors.muted,
    textAlign: "center",
    marginTop: 3,
  },
  schoolAddress: {
    fontSize: 8,
    color: colors.muted,
    textAlign: "center",
    marginTop: 2,
  },
  // Document title
  title: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: colors.primary,
    marginTop: 30,
    marginBottom: 25,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  // Body text
  body: {
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: 12,
  },
  bodyIndented: {
    fontSize: 11,
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: 12,
    textIndent: 40,
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  // Signature area
  signatureContainer: {
    marginTop: 60,
    alignItems: "center",
  },
  signatureLine: {
    width: 250,
    borderBottomWidth: 1,
    borderBottomColor: colors.text,
    borderBottomStyle: "solid",
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  signatureRole: {
    fontSize: 9,
    color: colors.muted,
    textAlign: "center",
  },
  // Date
  dateText: {
    fontSize: 11,
    textAlign: "right",
    marginTop: 40,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 50,
    right: 50,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderTopStyle: "solid",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: colors.muted,
    textAlign: "center",
  },
  // Table styles (for historico)
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 15,
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableRowHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: 4,
  },
  tableCellHeader: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
  },
  tableCell: {
    fontSize: 8,
    textAlign: "center",
  },
  tableCellLeft: {
    fontSize: 8,
    textAlign: "left",
  },
});

export function formatDate(date) {
  if (!date) {
    const now = new Date();
    return formatDateObj(now);
  }
  return formatDateObj(new Date(date));
}

function formatDateObj(d) {
  const months = [
    "janeiro", "fevereiro", "março", "abril", "maio", "junho",
    "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
  ];
  return `Salvador, ${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`;
}

export function formatDateShort(date) {
  if (!date) return "___/___/______";
  return new Date(date).toLocaleDateString("pt-BR");
}
