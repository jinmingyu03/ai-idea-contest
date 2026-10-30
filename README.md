# 2026 사내 AI 업무 혁신 아이디어 공모전 — 1차 접수 및 AI 초안 검토 웹사이트

임직원의 업무 혁신 아이디어를 온라인으로 접수하고, **Gemini AI (`gemini-3.8-flash`)** 가 1차 검토 초안(분야 분류·평점·평점 근거·심사평 초안)을 작성하여 **Airtable**에 저장하는 웹 애플리케이션입니다.

> **중요 안내**: AI가 생성한 평점과 심사평은 심사위원의 검토를 돕기 위한 **1차 참고용 초안**이며, **최종 심사와 확정 평점은 담당자(사람)**가 직접 수행합니다.

---

## 주요 기능 및 페이지 구성

| 경로 | 페이지 / API | 설명 |
|---|---|---|
| `/` | 공모 안내 페이지 | 공모 주제, 응모 자격, 추진 일정, 시상 내역, 5대 모집 분야, 4대 심사 기준 안내 |
| `/apply` | 아이디어 응모 폼 | 고정 접수 항목 5개(`팀명`, `구성원`, `아이디어 제목`, `아이디어 요약`, `기대 효과`) + 연락처 2개(`응모자 전화번호`, `응모자 메일`) 입력 및 제출 (`[가상 응모 예시 자동 채우기]` 지원) |
| `/status` | 접수 현황 페이지 | **`[현황 새로고침]` 버튼을 눌렀을 때만** 5대 분야별 접수 건수 조회 (응모자 이름·연락처 등 개인정보는 절대 표시하지 않음) |
| `POST /api/apply` | 응모 및 AI 검토 서버 API | 서버에서만 환경변수를 읽어 Gemini 3.8 Flash 1차 검토 수행 후 Airtable `Submissions` 테이블에 1줄 저장 (실패 시 자동 반복 재시도 없음) |
| `GET /api/status` | 분야별 집계 서버 API | Airtable에서 `AI 분야` 필드만 조회하여 분야별 건수 반환 (개인정보 필드 미조회·미반환) |

---

## 기술 스택

- **프론트엔드**: React 19, Next.js (App Router), Tailwind CSS, shadcn/ui, Lucide Icons
- **백엔드 (서버리스)**: Next.js Route Handlers (`/api/apply`, `/api/status`) on Vercel
- **AI 모델**: Google Gemini API (`gemini-3.8-flash`)
- **데이터베이스**: Airtable REST API (`Submissions` 테이블, 14개 필드)
- **배포 환경**: GitHub (`jinmingyu03/ai-idea-contest`) + Vercel (`jinmingyu/ai-idea-contest`)

---

## 로컬 실행 방법

1. 의존성 패키지 설치:
   ```bash
   npm install
   ```
2. 환경변수 설정:
   - `.env.example`을 참고하여 루트 경로에 `.env` 또는 `.env.local` 파일을 생성하고 실제 API 키와 토큰을 입력합니다. (GitHub 업로드 금지)
3. 개발 서버 실행:
   ```bash
   npm run dev
   ```
4. 브라우저에서 `http://localhost:3000` 접속

---

## 관련 문서

- [작업기획서.md](./작업기획서.md): 공모전 상세 기획, Airtable 14개 필드 구조, AI 프롬프트 및 단계별 검증 계획
- [PROJECT_HANDOFF.md](./PROJECT_HANDOFF.md): 현재까지 완료된 작업 내역 및 다음 단계(GAS 자동 메일 연동 등) 인수인계 문서
- [7주차_공모전접수_확정구조_고려사항_v2.md](./7주차_공모전접수_확정구조_고려사항_v2.md): 아키텍처 및 자주 막히는 곳 가이드
- [Airtable웹훅_GAS연동_세팅주의사항_v2.md](./Airtable웹훅_GAS연동_세팅주의사항_v2.md): 다음 단계 Airtable 웹훅 → GAS 연동 주의사항
