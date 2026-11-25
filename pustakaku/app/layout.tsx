import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AppShell from "../components/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PustakaKu — Ruang Baca Digital",
    template: "%s | PustakaKu",
  },
  description:
    "Simpan cerita yang kamu suka dan kelola koleksi buku pribadimu dengan PustakaKu.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={`${geistSans.variable} h-full antialiased`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
