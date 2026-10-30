export const CONTEST_CATEGORIES = [
  "문서·보고서 자동화",
  "데이터 분석·시각화",
  "고객·민원 응대 혁신",
  "사내 지식검색·협업 개선",
  "기타 업무 프로세스 개선",
] as const;

export type ContestCategory = (typeof CONTEST_CATEGORIES)[number];

export const CATEGORY_DETAILS: {
  name: ContestCategory;
  description: string;
  example: string;
}[] = [
  {
    name: "문서·보고서 자동화",
    description: "기안문, 회의록, 주간보고서 요약·작성 및 양식 변환 자동화",
    example: "예: 회의 녹취록 기반 품의서 및 주간보고 초안 자동 생성",
  },
  {
    name: "데이터 분석·시각화",
    description: "엑셀·실적 데이터 취합, 통계 분석, 대시보드 및 인사이트 도출",
    example: "예: 월별 부서 실적 엑셀 자동 검증 및 이상치 탐지 리포트",
  },
  {
    name: "고객·민원 응대 혁신",
    description: "FAQ 자동 응답, 민원 분류, 상담 회신 초안 작성 및 응대 품질 개선",
    example: "예: 반복 민원 유형 자동 분류 및 표준 회신문 초안 생성기",
  },
  {
    name: "사내 지식검색·협업 개선",
    description: "사내 규정·매뉴얼 검색, 인수인계 도우미, 부서 간 협업 워크플로우",
    example: "예: 인사·복무·회계 규정 AI 질의응답 및 신규 입사자 온보딩 봇",
  },
  {
    name: "기타 업무 프로세스 개선",
    description: "위 4개 분야 외 현업의 반복 작업 절감 및 신규 AI 활용 아이디어",
    example: "예: 사내 행사 일정 조율 및 공지 메일 발송 자동화",
  },
];

export const AI_DRAFT_NOTICE =
  "평점과 심사평은 AI가 작성한 1차 참고용 초안이며, 최종 심사와 확정 평점은 담당자(사람)가 직접 수행합니다.";
