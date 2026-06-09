import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/** Fonte principal — legível em telas pequenas */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** SEO e compartilhamento — título/descrição do app comunitário */
export const metadata: Metadata = {
  title: "Animais do Bairro | Gestão Comunitária",
  description:
    "Organize alimentação, saúde e emergências dos cães e gatos de rua do seu bairro.",
  manifest: "/manifest.json",
};

/** Viewport mobile-first — impede zoom indesejado em inputs no iOS */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d9488",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      {/* Fundo slate-50 — contraste suave para cards brancos */}
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">
        {children}
      </body>
    </html>
  );
}
