import { View, Text } from "@react-pdf/renderer";
import { baseStyles } from "./styles";
import { SCHOOL_LEGAL_NAME } from "@/lib/constants";

export function DocumentFooter({ style }) {
  return (
    <View style={[baseStyles.footer, style]}>
      <Text style={baseStyles.footerText}>
        {SCHOOL_LEGAL_NAME} — Documento gerado eletronicamente
      </Text>
    </View>
  );
}

export function Signature() {
  return (
    <View style={baseStyles.signatureContainer}>
      <View style={baseStyles.signatureLine} />
      <Text style={baseStyles.signatureName}>Urlania Laerte C. Mota</Text>
      <Text style={baseStyles.signatureRole}>Diretora — NTE 26-85/2021</Text>
    </View>
  );
}
