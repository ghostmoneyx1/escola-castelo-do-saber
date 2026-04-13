import { View, Text, Image } from "@react-pdf/renderer";
import { baseStyles } from "./styles";

export function DocumentHeader({ unit, logoSrc }) {
  const isFilial = unit === "Filial";

  return (
    <View style={baseStyles.headerContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 6 }}>
        {logoSrc && <Image src={logoSrc} style={{ width: 56, height: 56, objectFit: "contain" }} />}
        <View style={{ alignItems: "center" }}>
          <Text style={baseStyles.schoolName}>
            {isFilial
              ? "Instituto de Educação e Cidadania Castelo do Saber"
              : "Escola Castelo do Saber"}
          </Text>
          <Text style={baseStyles.schoolSubtitle}>
            CNPJ: {isFilial ? "27.899.372/0002-39" : "27.899.372/0001-58"} — Aut./Rec. Portaria NTE-26 85/2021 — DEZ 2025
          </Text>
          <Text style={baseStyles.schoolAddress}>
            {isFilial
              ? "Rua das Hortas nº37 — Alto do Cabrito — TEL.: (71) 98260-7878 — Salvador — BA"
              : "Rua João Rodrigues Mendes, 280-E — CEP 40.471-265 — Boa Vista do Lobato — TEL.: (71) 98260-7878 — Salvador — BA"}
          </Text>
        </View>
      </View>
    </View>
  );
}
