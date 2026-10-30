import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Trophy,
  Users,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  ShieldAlert,
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
import { CATEGORY_DETAILS, AI_DRAFT_NOTICE } from "@/lib/constants";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* 히어로 섹션 */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-md sm:p-12">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="border-white/30 bg-white/15 text-white">
            2026 사내 공모전 · 1차 접수 진행 중
          </Badge>
          <Badge className="border-amber-300/40 bg-amber-400/20 text-amber-100">
            AI 1차 초안 검토 + 실무 심사위원 최종 심사
          </Badge>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          2026 사내 AI 업무 혁신 아이디어 공모전
        </h1>
        <p className="mt-3 max-w-2xl text-base text-blue-100 sm:text-lg">
          &ldquo;반복되는 일상 업무는 AI에게, 우리의 시간은 더 가치 있는 일에!&rdquo;
          <br />
          현업에서 겪는 불편함과 반복 업무를 해결할 여러분의 아이디어를 들려주세요.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/apply">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold"
            >
              아이디어 응모하기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/status">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <BarChart3 className="h-4 w-4" />
              분야별 접수 현황 보기
            </Button>
          </Link>
        </div>
      </section>

      {/* AI 초안 고지 배너 */}
      <section className="mt-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-4 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-semibold">심사 운영 안내 (필독)</p>
          <p className="mt-0.5 text-amber-800">{AI_DRAFT_NOTICE}</p>
        </div>
      </section>

      {/* 공모 요강 3대 카드 (자격 / 일정 / 시상) */}
      <section className="mt-8 grid gap-5 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">응모 자격</CardTitle>
            <CardDescription>누구나 참여 가능</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1.5">
            <p>• 사내/기관 전 임직원</p>
            <p>• 개인 또는 2~4인 팀 단위 응모 가능</p>
            <p>• 부서 연합팀 및 복수 아이디어 접수 가능</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Calendar className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">추진 일정</CardTitle>
            <CardDescription>2026년 11월 진행</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1.5">
            <p>
              • <strong>1차 접수</strong>: 11. 01.(일) ~ 11. 20.(금)
            </p>
            <p>
              • <strong>1차 심사</strong>: 11. 23.(월) ~ 11. 25.(수)
            </p>
            <p>
              • <strong>최종 발표·시상</strong>: 11. 30.(월)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Trophy className="h-5 w-5" />
            </div>
            <CardTitle className="text-base">시상 내역</CardTitle>
            <CardDescription>총 6개 우수팀 + 참가상</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-1.5">
            <p>
              • <strong>대상 (1팀)</strong>: 200만 원 + 우선 과제화
            </p>
            <p>
              • <strong>최우수상 (2팀)</strong>: 각 100만 원
            </p>
            <p>
              • <strong>우수상 (3팀)</strong>: 각 50만 원 (참가 전원 커피 쿠폰)
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 모집 분야 (5개 고정 선택지 안내) */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              모집 분야 (5개 분야)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              응모작을 제출하시면 Gemini AI가 내용을 읽고 아래 5개 분야 중 가장 적합한 분야로 1차 자동 분류합니다.
            </p>
          </div>
          <Badge variant="default">5개 지정 분야</Badge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_DETAILS.map((cat, idx) => (
            <Card key={cat.name} className="border-slate-200/90">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">분야 0{idx + 1}</Badge>
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
                <CardTitle className="mt-2 text-base">{cat.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-slate-700">{cat.description}</p>
                <p className="text-xs text-slate-500">{cat.example}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 심사 기준 (4대 기준) */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">심사 기준 안내</h2>
        <p className="mt-1 text-sm text-slate-600">
          1차 검토(AI 초안 1~5점 산정) 및 담당자 최종 심사는 아래 4가지 기준을 동일하게 반영합니다.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            {
              title: "1. 창의성 (25%)",
              desc: "기존의 관행적인 업무 방식을 새롭게 전환하거나 AI를 참신하게 접목했는가?",
            },
            {
              title: "2. 실현가능성 (25%)",
              desc: "현행 사내 보안·시스템 환경에서 과도한 비용 없이 실제로 구현 가능한가?",
            },
            {
              title: "3. 기대효과 (25%)",
              desc: "도입 시 업무 시간 단축, 휴먼 에러 감소, 서비스 품질 향상 효과가 뚜렷한가?",
            },
            {
              title: "4. 업무적합성 (25%)",
              desc: "현업 부서의 실제 페인포인트(Pain Point)를 정확히 짚어내고 실무 활용도가 높은가?",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
