import { Suspense } from "react";
import { ConsultaClient } from "./consulta-client";

export const metadata = {
  title: "Consulta de Mensalidades",
  description: "Consulte as mensalidades em aberto e pague pelo link.",
};

export default function ConsultaMensalidadesPage() {
  return (
    <Suspense>
      <ConsultaClient />
    </Suspense>
  );
}
