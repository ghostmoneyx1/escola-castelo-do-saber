import { Inter, DM_Sans } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Castelo do Saber — Gestão Escolar",
  description: "Sistema de Gestão Escolar — Escola Castelo do Saber",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
