"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, FileEdit, BarChart3, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { AI_DRAFT_NOTICE } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "공모 안내", icon: Home },
    { href: "/apply", label: "아이디어 응모", icon: FileEdit },
    { href: "/status", label: "접수 현황", icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-base sm:text-lg tracking-tight">
            2026 사내 AI 업무 혁신 공모전
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 inline-block px-3 py-1.5 rounded-full">
          안내: {AI_DRAFT_NOTICE}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          © 2026 사내 AI 업무 혁신 아이디어 공모전 운영사무국 · 개인정보 보호를 위해 공개 화면에는 응모자 성명과 연락처를 표시하지 않습니다.
        </p>
      </div>
    </footer>
  );
}
