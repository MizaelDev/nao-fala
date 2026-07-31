import type { Metadata, Viewport } from "next";
import { Bungee, Nunito_Sans } from "next/font/google";
import "@/app/globals.css";

const display = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const sans = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "NÃO FALA! | Jogo de palavras",
  description: "Faça sua equipe adivinhar a palavra sem dizer nenhuma das cinco palavras proibidas.",
  applicationName: "NÃO FALA!",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "NÃO FALA!" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, viewportFit: "cover", themeColor: "#15131a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}><body>{children}</body></html>;
}
