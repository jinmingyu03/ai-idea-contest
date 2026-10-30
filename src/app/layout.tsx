import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
