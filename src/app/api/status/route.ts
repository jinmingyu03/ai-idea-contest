import { NextResponse } from "next/server";
import { CONTEST_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const airtableToken = process.env.AIRTABLE_API_TOKEN?.trim();
    const airtableBaseId = process.env.AIRTABLE_BASE_ID?.trim();
    const airtableTableName =
      process.env.AIRTABLE_TABLE_NAME?.trim() || "Submissions";

    if (!airtableToken || !airtableBaseId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "서버 환경변수(AIRTABLE_API_TOKEN 또는 AIRTABLE_BASE_ID)가 아직 등록되지 않았습니다. 내 컴퓨터(.env.local)와 Vercel 환경변수를 확인해 주세요.",
        },
        { status: 500 }
      );
    }

    const categoryCounts: Record<string, number> = {};
    for (const cat of CONTEST_CATEGORIES) {
      categoryCounts[cat] = 0;
    }

    let totalCount = 0;
    let offset: string | undefined = undefined;

    // Airtable에서 'AI 분야' 필드만 조회하여 개인정보(구성원, 전화번호, 메일 등)는 아예 읽어오지 않음
    do {
      const params = new URLSearchParams();
      params.append("fields[]", "AI 분야");
      if (offset) {
        params.append("offset", offset);
      }

      const url = `https://api.airtable.com/v0/${encodeURIComponent(
        airtableBaseId
      )}/${encodeURIComponent(airtableTableName)}?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMessage = errData?.error?.message || `HTTP ${res.status}`;
        return NextResponse.json(
          {
            ok: false,
            error: `Airtable 현황 조회 실패: ${errMessage} (베이스 ID, 테이블 이름 또는 'AI 분야' 컬럼명을 확인해 주세요.)`,
          },
          { status: 500 }
        );
      }

      const data = await res.json();
      const records: Array<{ fields?: Record<string, unknown> }> =
        data.records || [];

      for (const rec of records) {
        totalCount += 1;
        const cat =
          typeof rec.fields?.["AI 분야"] === "string"
            ? rec.fields["AI 분야"].trim()
            : "";

        if (cat && cat in categoryCounts) {
          categoryCounts[cat] += 1;
        } else {
          categoryCounts["미분류"] = (categoryCounts["미분류"] || 0) + 1;
        }
      }

      offset = data.offset;
    } while (offset);

    return NextResponse.json({
      ok: true,
      totalCount,
      categoryCounts,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "현황 집계 중 서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
