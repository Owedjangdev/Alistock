import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "AliStock - Gestion des Stocks",
  description: "Application de gestion des stocks pour associations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="fr" data-theme="retro">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}