"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Wand2,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AI_DRAFT_NOTICE } from "@/lib/constants";

interface SubmitFormState {
  teamName: string;
  members: string;
  ideaTitle: string;
  ideaSummary: string;
  expectedEffect: string;
  applicantPhone: string;
  applicantEmail: string;
}

const SAMPLE_IDEAS: SubmitFormState[] = [
  {
    teamName: "스마트워크추진팀",
    members: "김혁신, 이자동",
    ideaTitle: "회의 녹취록 기반 주간보고서 및 기안문 초안 자동 생성 비서",
    ideaSummary:
      "매주 팀 회의 후 회의록을 따로 정리하고 이를 다시 주간업무보고 양식으로 옮겨 적는 데 평균 2시간 이상 소요됩니다. 회의 음성/텍스트 메모를 업로드하면 Gemini AI가 핵심 안건, 결정 사항, 향후 일정을 추출해 사내 표준 주간보고서 양식과 품의서 초안으로 즉시 변환해 주는 웹 도구를 제안합니다.",
    expectedEffect:
      "팀당 주간 보고서 작성 시간 70% 단축(주 2시간 → 30분), 회의 결정사항 누락 방지 및 부서 간 보고 양식 표준화 달성.",
    applicantPhone: "010-1234-5678",
    applicantEmail: "smartwork.demo@example.com",
  },
  {
    teamName: "데이터인사이트팀",
    members: "박분석, 최시각",
    ideaTitle: "월별 부서 실적 엑셀 자동 취합 및 이상치 탐지 요약 대시보드",
    ideaSummary:
      "매월 말 15개 부서에서 제출하는 엑셀 실적 파일의 서식이 조금씩 달라 수작업으로 검증·취합하는 데 3일이 걸립니다. 업로드된 엑셀을 자동 파싱하여 수치 오류나 전월 대비 급증/급감 이상치를 AI가 먼저 짚어주고 경영진 보고용 3줄 요약 코멘트를 생성하는 시스템입니다.",
    expectedEffect:
      "월말 실적 마감 시간 3일에서 반나절로 단축, 수기 입력 휴먼 에러 95% 이상 감소.",
    applicantPhone: "010-2345-6789",
    applicantEmail: "datainsight.demo@example.com",
  },
  {
    teamName: "친절민원혁신팀",
    members: "정상담, 한응대",
    ideaTitle: "반복 민원 자동 분류 및 과거 우수 답변 기반 회신문 초안 생성기",
    ideaSummary:
      "동일하거나 유사한 유형의 고객/민원 문의가 전체의 65%를 차지하지만 담당자마다 과거 답변 사례를 검색하느라 회신 시간이 지연됩니다. 민원 접수 즉시 AI가 문의 유형을 분류하고 기존 우수 회신문과 관련 규정을 참조해 맞춤형 답변 초안을 10초 내 제시합니다.",
    expectedEffect:
      "평균 민원 1차 응대 시간 50% 단축, 신규 담당자의 응대 품질 편차 해소 및 민원 만족도 향상.",
    applicantPhone: "010-3456-7890",
    applicantEmail: "cs.innovation@example.com",
  },
];

const INITIAL_STATE: SubmitFormState = {
  teamName: "",
  members: "",
  ideaTitle: "",
  ideaSummary: "",
  expectedEffect: "",
  applicantPhone: "",
  applicantEmail: "",
};

export default function ApplyPage() {
  const [form, setForm] = useState<SubmitFormState>(INITIAL_STATE);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<{
    recordId: string;
    aiReview: {
      category: string;
      score: number | null;
      reason: string;
      review: string;
    } | null;
    aiWarning?: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFillSample = () => {
    const sample = SAMPLE_IDEAS[sampleIndex % SAMPLE_IDEAS.length];
    setForm(sample);
    setSampleIndex((prev) => prev + 1);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSubmitResult(null);

    try {
      // 주의: 호출이 실패해도 자동으로 반복 재시도하지 않음 (1회 단일 호출)
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(
          data.error ||
            "제출 처리 중 오류가 발생했습니다. 환경변수 및 Airtable 설정을 확인해 주세요."
        );
        return;
      }

      setSubmitResult({
        recordId: data.recordId,
        aiReview: data.aiReview || null,
        aiWarning: data.aiWarning,
      });
      setForm(INITIAL_STATE);
    } catch {
      setErrorMsg(
        "서버와 통신할 수 없습니다. 네트워크 상태를 확인한 후 다시 시도해 주세요. (자동 재시도 없음)"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge variant="default">1차 아이디어 접수</Badge>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            아이디어 공모전 응모하기
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            5개 필수 접수 항목과 연락처를 입력해 제출해 주세요.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleFillSample}
          className="self-start sm:self-auto"
        >
          <Wand2 className="h-4 w-4 text-blue-600" />
          가상 응모 예시 자동 채우기
        </Button>
      </div>

      {/* 필수 고지 배너: AI 초안 안내 및 가상 데이터 테스트 안내 */}
      <div className="mb-6 space-y-2.5 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-xs sm:text-sm text-amber-900">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            <strong>AI 1차 초안 안내:</strong> {AI_DRAFT_NOTICE}
          </p>
        </div>
        <div className="flex items-start gap-2.5 text-amber-800">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p>
            <strong>개인정보 및 테스트 안내:</strong> 테스트 시에는 실제 개인정보나 대외비 자료가 아닌{" "}
            <strong>가상 응모 내용</strong>을 입력해 주세요. 응모자 성명과 연락처는 공개 화면에 절대 표시되지 않습니다.
          </p>
        </div>
      </div>

      {/* 제출 완료 결과 카드 */}
      {submitResult && (
        <Card className="mb-8 border-emerald-200 bg-emerald-50/40">
          <CardHeader>
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
              <CardTitle className="text-lg">
                아이디어 응모가 정상적으로 접수되었습니다!
              </CardTitle>
            </div>
            <CardDescription className="text-slate-600">
              Airtable에 응모 내역이 저장되었으며, AI 1차 검토 초안이 함께 기록되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitResult.aiReview ? (
              <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-slate-900">
                    Gemini AI 1차 검토 초안 결과
                  </span>
                  <Badge variant="amber">AI 초안 · 최종 심사는 담당자가 확정</Badge>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <span className="text-xs text-slate-500">AI 분류 분야</span>
                    <p className="mt-0.5 font-semibold text-blue-700">
                      {submitResult.aiReview.category}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <span className="text-xs text-slate-500">
                      AI 초안 평점 (1~5 정수)
                    </span>
                    <p className="mt-0.5 font-semibold text-slate-900">
                      {submitResult.aiReview.score
                        ? `${"★".repeat(submitResult.aiReview.score)}${"☆".repeat(
                            5 - submitResult.aiReview.score
                          )} (${submitResult.aiReview.score}점 / 5점)`
                        : "미산정 (담당자 검토 예정)"}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500">
                    AI 평점 근거 (한 줄)
                  </span>
                  <p className="mt-0.5 text-slate-800">
                    {submitResult.aiReview.reason}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-500">
                    AI 심사평 초안 (강점 2 · 보완 2)
                  </span>
                  <p className="mt-0.5 whitespace-pre-line leading-relaxed text-slate-700">
                    {submitResult.aiReview.review}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-amber-800">
                응모 원문은 Airtable에 안전하게 저장되었습니다.{" "}
                {submitResult.aiWarning ? `(${submitResult.aiWarning})` : ""}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/status">
                <Button size="sm">
                  <BarChart3 className="h-4 w-4" />
                  접수 현황 페이지로 이동
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSubmitResult(null)}
              >
                새로운 아이디어 추가 응모하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 에러 안내 */}
      {errorMsg && (
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="font-semibold">제출에 실패했습니다</p>
            <p className="mt-0.5">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* 응모 입력 폼 */}
      <Card>
        <CardHeader>
          <CardTitle>접수 신청서 작성</CardTitle>
          <CardDescription>
            * 표시된 모든 항목은 필수 입력 사항입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. 팀명 & 2. 구성원 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teamName">1. 팀명 *</Label>
                <Input
                  id="teamName"
                  name="teamName"
                  required
                  placeholder="예: 스마트워크추진팀 (개인 응모 시 개인팀명)"
                  value={form.teamName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="members">
                  2. 구성원 (이름만 기재 · 공개 화면 비표시) *
                </Label>
                <Input
                  id="members"
                  name="members"
                  required
                  placeholder="예: 김혁신, 이자동"
                  value={form.members}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 3. 아이디어 제목 */}
            <div className="space-y-2">
              <Label htmlFor="ideaTitle">3. 아이디어 제목 *</Label>
              <Input
                id="ideaTitle"
                name="ideaTitle"
                required
                placeholder="핵심 내용이 드러나는 한 줄 제목을 입력해 주세요"
                value={form.ideaTitle}
                onChange={handleChange}
              />
            </div>

            {/* 4. 아이디어 요약 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="ideaSummary">
                  4. 아이디어 요약 (AI 1차 검토의 주 재료) *
                </Label>
                <span className="text-xs text-blue-600 font-medium">
                  현업 문제점과 AI 해결 방안을 구체적으로 적어주세요
                </span>
              </div>
              <Textarea
                id="ideaSummary"
                name="ideaSummary"
                required
                rows={5}
                placeholder="현재 어떤 업무가 불편하거나 반복되는지, 그리고 AI를 어떻게 활용해 해결할 것인지 여러 줄로 작성해 주세요."
                value={form.ideaSummary}
                onChange={handleChange}
              />
            </div>

            {/* 5. 기대 효과 */}
            <div className="space-y-2">
              <Label htmlFor="expectedEffect">5. 기대 효과 *</Label>
              <Textarea
                id="expectedEffect"
                name="expectedEffect"
                required
                rows={3}
                placeholder="아이디어 도입 시 예상되는 시간 단축, 비용 절감, 품질 개선 효과를 작성해 주세요."
                value={form.expectedEffect}
                onChange={handleChange}
              />
            </div>

            {/* 연락처 영역 (전화번호 + 이메일, 공개 화면 비표시) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-slate-800">
                  응모자 연락처 정보 (회신 전용 · 공개 화면 비노출)
                </h4>
                <p className="text-xs text-slate-500">
                  접수 확인 메일 발송 및 결과 안내에만 사용되며 현황 페이지에는 절대 표시되지 않습니다.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="applicantPhone">응모자 전화번호 *</Label>
                  <Input
                    id="applicantPhone"
                    name="applicantPhone"
                    type="tel"
                    required
                    placeholder="예: 010-1234-5678"
                    value={form.applicantPhone}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="applicantEmail">응모자 메일 주소 *</Label>
                  <Input
                    id="applicantEmail"
                    name="applicantEmail"
                    type="email"
                    required
                    placeholder="예: example@company.com"
                    value={form.applicantEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                <Send className="h-4 w-4" />
                {isSubmitting
                  ? "AI 1차 검토 및 Airtable 저장 중입니다 (잠시만 기다려 주세요)..."
                  : "아이디어 응모 제출하기"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
