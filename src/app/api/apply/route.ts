import { NextResponse } from "next/server";
import { CONTEST_CATEGORIES, type ContestCategory } from "@/lib/constants";

interface ApplyRequestBody {
  teamName?: string;
  members?: string;
  ideaTitle?: string;
  ideaSummary?: string;
  expectedEffect?: string;
  applicantPhone?: string;
  applicantEmail?: string;
}

interface GeminiReviewResult {
  category: ContestCategory;
  score: number | null;
  reason: string;
  review: string;
}

async function callGeminiModel(
  modelName: string,
  apiKey: string,
  promptText: string
): Promise<Response> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    modelName
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        responseMimeType: "application/json",
      },
    }),
  });
}

async function generateAiReview(
  ideaTitle: string,
  ideaSummary: string,
  expectedEffect: string
): Promise<{ review: GeminiReviewResult | null; warning?: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      review: null,
      warning: "서버 환경변수 GEMINI_API_KEY가 설정되지 않아 AI 검토 칸을 비워두었습니다.",
    };
  }

  const preferredModel = process.env.GEMINI_MODEL?.trim() || "gemini-3.8-flash";

  const promptText = `당신은 '2026 사내 AI 업무 혁신 아이디어 공모전'의 1차 서류 검토를 돕는 AI 심사 보조원입니다.
제출된 아이디어의 [제목], [요약], [기대 효과]를 읽고 다음 항목을 반드시 JSON 형식으로만 응답하세요.
이 결과는 참고용 1차 초안이며 최종 심사는 사람(담당자)이 수행합니다.

[모집 분야 선택지 (반드시 아래 5개 중 정확히 하나만 글자 그대로 선택)]
1. "문서·보고서 자동화"
2. "데이터 분석·시각화"
3. "고객·민원 응대 혁신"
4. "사내 지식검색·협업 개선"
5. "기타 업무 프로세스 개선"

[작성 규칙]
- category: 위 5개 문자열 중 정확히 하나만 선택 (다른 표현 절대 금지)
- score: 창의성(25%), 실현가능성(25%), 기대효과(25%), 업무적합성(25%)을 종합하여 1에서 5 사이의 정수(1, 2, 3, 4, 5) 중 하나로만 부여 (0점 또는 소수점 절대 금지)
- reason: 해당 평점을 부여한 핵심 근거를 한 줄(1문장, 80자 이내)로 작성
- review: 강점 두 가지와 보완할 점 두 가지를 포함하여 다섯 문장 이내로 작성

[응모작 내용]
- 아이디어 제목: ${ideaTitle}
- 아이디어 요약: ${ideaSummary}
- 기대 효과: ${expectedEffect}

[JSON 출력 예시]
{
  "category": "문서·보고서 자동화",
  "score": 4,
  "reason": "반복적인 보고서 작성 시간을 크게 단축할 수 있고 현업 도입 가능성이 높음.",
  "review": "[강점] 1) 현업의 반복 업무를 정확히 짚어 체감 효과가 큽니다. 2) 기존 양식을 그대로 활용해 도입 장벽이 낮습니다. [보완] 1) 부서별 특수 용어 사전 구축 방안이 추가되면 좋겠습니다. 2) 사내 보안 문서 처리 기준을 구체화할 필요가 있습니다."
}`;

  try {
    const response = await callGeminiModel(preferredModel, apiKey, promptText);

    if (!response.ok) {
      return {
        review: null,
        warning: `Gemini API 응답 오류(HTTP ${response.status})로 인해 응모 원문만 먼저 저장되었습니다.`,
      };
    }

    const resultJson = await response.json();
    const rawText: string =
      resultJson?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!rawText) {
      return {
        review: null,
        warning: "Gemini 응답이 비어 있어 응모 원문만 저장되었습니다.",
      };
    }

    const parsed = JSON.parse(rawText);

    // 1. 분야 검증 (5개 선택지 중 하나로 고정)
    const matchedCategory = CONTEST_CATEGORIES.find(
      (c) => c === parsed.category?.trim()
    );
    const safeCategory: ContestCategory =
      matchedCategory || "기타 업무 프로세스 개선";

    // 2. 평점 검증 (1~5 사이 정수로만 제한, 0이나 소수점 방지)
    const numericScore = Number(parsed.score);
    const safeScore =
      Number.isFinite(numericScore) && numericScore >= 1
        ? Math.min(5, Math.max(1, Math.round(numericScore)))
        : null;

    // 3. 평점 근거 (한 줄)
    const safeReason =
      typeof parsed.reason === "string" && parsed.reason.trim().length > 0
        ? parsed.reason.trim().replace(/\r?\n+/g, " ")
        : "창의성·실현가능성·기대효과·업무적합성을 종합 고려하여 산정함.";

    // 4. 심사평 초안 (강점 2 + 보완 2, 5문장 이내)
    const safeReview =
      typeof parsed.review === "string" && parsed.review.trim().length > 0
        ? parsed.review.trim()
        : "[강점] 현업 문제 해결에 도움이 되는 실용적인 아이디어입니다. [보완] 구체적인 실행 일정과 보안 검토 방안을 보완하면 더욱 완성도가 높아질 것입니다.";

    return {
      review: {
        category: safeCategory,
        score: safeScore,
        reason: safeReason,
        review: safeReview,
      },
    };
  } catch {
    return {
      review: null,
      warning: "AI 검토 결과 파싱 중 오류가 발생하여 응모 원문만 저장되었습니다.",
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ApplyRequestBody;

    const teamName = body.teamName?.trim() || "";
    const members = body.members?.trim() || "";
    const ideaTitle = body.ideaTitle?.trim() || "";
    const ideaSummary = body.ideaSummary?.trim() || "";
    const expectedEffect = body.expectedEffect?.trim() || "";
    const applicantPhone = body.applicantPhone?.trim() || "";
    const applicantEmail = body.applicantEmail?.trim() || "";

    if (
      !teamName ||
      !members ||
      !ideaTitle ||
      !ideaSummary ||
      !expectedEffect ||
      !applicantPhone ||
      !applicantEmail
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "모든 필수 접수 항목(5개)과 연락처(전화번호·메일)를 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    const airtableToken = process.env.AIRTABLE_API_TOKEN?.trim();
    const airtableBaseId = process.env.AIRTABLE_BASE_ID?.trim();
    const airtableTableName =
      process.env.AIRTABLE_TABLE_NAME?.trim() || "Submissions";

    if (!airtableToken || !airtableBaseId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "서버 환경변수(AIRTABLE_API_TOKEN 또는 AIRTABLE_BASE_ID)가 설정되지 않았습니다. 내 컴퓨터(.env.local)와 Vercel 환경변수를 확인해 주세요.",
        },
        { status: 500 }
      );
    }

    // ① Gemini AI 1차 검토 초안 생성
    const { review: aiReview, warning: aiWarning } = await generateAiReview(
      ideaTitle,
      ideaSummary,
      expectedEffect
    );

    // ② Airtable 저장용 필드 구성
    // 주의: '담당자 확정 평점'은 사람이 직접 입력하는 칸이므로 비워둡니다.
    // 주의: 'AI 평점'은 1~5 정수일 때만 넣으며, 0점이나 빈 값은 아예 생략하여 저장 실패를 방지합니다.
    const nowKst = new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const fields: Record<string, string | number> = {
      팀명: teamName,
      구성원: members,
      "아이디어 제목": ideaTitle,
      "아이디어 요약": ideaSummary,
      "기대 효과": expectedEffect,
      "응모자 전화번호": applicantPhone,
      "응모자 메일": applicantEmail,
      접수일시: nowKst,
    };

    if (aiReview) {
      fields["AI 분야"] = aiReview.category;
      if (aiReview.score !== null && aiReview.score >= 1 && aiReview.score <= 5) {
        fields["AI 평점"] = aiReview.score;
      }
      fields["AI 평점 근거"] = aiReview.reason;
      fields["AI 심사평 초안"] = aiReview.review;
    }

    const airtableUrl = `https://api.airtable.com/v0/${encodeURIComponent(
      airtableBaseId
    )}/${encodeURIComponent(airtableTableName)}`;

    const airtableRes = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${airtableToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true, // Single select 선택지 자동 매칭 허용
      }),
    });

    if (!airtableRes.ok) {
      const errData = await airtableRes.json().catch(() => ({}));
      const errMessage =
        errData?.error?.message || `HTTP ${airtableRes.status}`;
      return NextResponse.json(
        {
          ok: false,
          error: `Airtable 저장 실패: ${errMessage} (토큰 권한 또는 테이블·필드 이름이 기획서와 일치하는지 확인해 주세요.)`,
        },
        { status: 500 }
      );
    }

    const savedData = await airtableRes.json();
    const recordId = savedData?.records?.[0]?.id || "saved";

    return NextResponse.json({
      ok: true,
      recordId,
      aiReview,
      aiWarning,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "응모 처리 중 서버 내부 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
