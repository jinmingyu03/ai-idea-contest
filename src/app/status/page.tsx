"use client";

import React, { useState } from "react";
import {
  RefreshCw,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CONTEST_CATEGORIES, AI_DRAFT_NOTICE } from "@/lib/constants";

interface StatusData {
  totalCount: number;
  categoryCounts: Record<string, number>;
  fetchedAt: string;
}

export default function StatusPage() {
  // 조건 준수: 화면을 열 때 자동으로 불러오지 않고, 새로고침 버튼을 눌렀을 때만 조회함
  const [statusData, setStatusData] = useState<StatusData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRefresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 자동 재시도 없이 1회만 호출
      const res = await fetch("/api/status", {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error ||
            "현황 데이터를 불러오지 못했습니다. 환경변수 및 Airtable 설정을 확인해 주세요."
        );
        return;
      }

      setStatusData({
        totalCount: data.totalCount,
        categoryCounts: data.categoryCounts,
        fetchedAt: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    } catch {
      setErrorMsg(
        "서버와 통신할 수 없습니다. 잠시 후 새로고침 버튼을 다시 눌러주세요. (자동 재시도 없음)"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* 상단 타이틀 및 수동 새로고침 버튼 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="default">실시간 분야별 집계</Badge>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            아이디어 공모전 접수 현황
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            API 호출 최소화를 위해 <strong>[새로고침] 버튼을 눌렀을 때만</strong> 최신 접수 건수를 불러옵니다.
          </p>
        </div>

        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          size="lg"
          className="self-start sm:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          {isLoading ? "현황 불러오는 중..." : "현황 새로고침"}
        </Button>
      </div>

      {/* 개인정보 비공개 및 AI 초안 안내 배너 */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-700">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="font-semibold text-slate-900">개인정보 보호 원칙 준수</p>
            <p className="mt-0.5 text-slate-600">
              응모자 이름(구성원), 전화번호, 이메일 주소는 공개 화면에 절대 표시하지 않으며 분야별 건수만 공개합니다.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-900">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-semibold">AI 초안 고지</p>
            <p className="mt-0.5 text-amber-800">{AI_DRAFT_NOTICE}</p>
          </div>
        </div>
      </div>

      {/* 오류 표시 */}
      {errorMsg && (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">조회 실패</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 아직 새로고침을 누르기 전 초기 안내 화면 */}
      {!statusData && !errorMsg && (
        <Card className="mt-8 border-dashed border-slate-300 bg-white/70">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900">
              현황 데이터를 조회하려면 우측 상단 또는 아래의 [현황 새로고침] 버튼을 눌러주세요
            </h2>
            <p className="mt-1 max-w-md text-xs sm:text-sm text-slate-500">
              화면을 열 때마다 자동으로 조회하지 않고, 버튼을 눌렀을 때만 Airtable에서 분야별 건수를 집계해 가져옵니다.
            </p>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              className="mt-5"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              {isLoading ? "불러오는 중..." : "지금 현황 불러오기"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 새로고침 후 분야별 건수 표시 */}
      {statusData && (
        <div className="mt-8 space-y-6">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6">
              <div>
                <p className="text-sm font-medium text-blue-100">
                  총 누적 접수 건수
                </p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">
                  {statusData.totalCount}건
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-100 bg-white/10 px-3 py-1.5 rounded-full self-start sm:self-center">
                <Clock className="h-3.5 w-3.5" />
                <span>마지막 조회 시각: {statusData.fetchedAt}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5대 모집 분야별 접수 현황</CardTitle>
              <CardDescription>
                Gemini AI가 1차 분류한 분야별 접수 건수입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CONTEST_CATEGORIES.map((category) => {
                const count = statusData.categoryCounts[category] || 0;
                const ratio =
                  statusData.totalCount > 0
                    ? Math.round((count / statusData.totalCount) * 100)
                    : 0;

                return (
                  <div
                    key={category}
                    className="rounded-xl border border-slate-200 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-slate-900">
                        {category}
                      </span>
                      <span className="font-bold text-blue-700">
                        {count}건{" "}
                        <span className="text-xs font-normal text-slate-500">
                          ({ratio}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${Math.max(ratio, count > 0 ? 6 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}

              {statusData.categoryCounts["미분류"] > 0 && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    기타 / AI 분류 대기
                  </span>
                  <span className="font-semibold text-slate-700">
                    {statusData.categoryCounts["미분류"]}건
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
