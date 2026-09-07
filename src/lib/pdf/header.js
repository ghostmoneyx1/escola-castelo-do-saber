import { View, Text, Image } from "@react-pdf/renderer";
import { baseStyles } from "./styles";
import { SCHOOL_LEGAL_NAME } from "@/lib/constants";

// As unidades no banco chamam-se "Boa Vista do Lobato" (matriz) e
// "Alto do Cabrito" (filial); aceita também o rótulo genérico "Filial".
export function isFilialUnit(unit) {
  return /filial|cabrito/i.test(unit || "");
}

export function DocumentHeader({ unit, logoSrc }) {
  const isFilial = isFilialUnit(unit);

  return (
    <View style={baseStyles.headerContainer}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 6 }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- Image do @react-pdf/renderer, não <img> */}
        {logoSrc && <Image src={logoSrc} style={{ width: 56, height: 56, objectFit: "contain" }} />}
        <View style={{ alignItems: "center" }}>
          <Text style={baseStyles.schoolName}>{SCHOOL_LEGAL_NAME}</Text>
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
