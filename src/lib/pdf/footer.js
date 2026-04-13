import { View, Text } from "@react-pdf/renderer";
import { baseStyles } from "./styles";

export function DocumentFooter() {
  return (
    <View style={baseStyles.footer}>
      <Text style={baseStyles.footerText}>
        Escola Castelo do Saber — Sistema de Gestão Escolar — Documento gerado eletronicamente
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
