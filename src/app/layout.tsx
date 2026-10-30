import type { Metadata } from "next";
import "./globals.css";
import { Navbar, Footer } from "@/components/navbar";

export const metadata: Metadata = {
  title: "2026 사내 AI 업무 혁신 아이디어 공모전",
  description: "아이디어 공모전 1차 접수 및 AI 초안 검토 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
