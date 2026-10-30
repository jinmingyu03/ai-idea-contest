# PROJECT_HANDOFF.md — 작업 인수인계 및 진행 현황 (최신 상태)

> **재작업 요청 시 프롬프트**:
> `"PROJECT_HANDOFF.md 읽고 이어서 진행해줘"`
>
> **작업 디렉토리 원칙**: 모든 작업은 반드시 `C:\Antigravity\Contest` 폴더 안에서만 진행합니다.

---

## 1. 프로젝트 핵심 리소스 및 주소

- **로컬 작업 폴더**: `C:\Antigravity\Contest`
- **GitHub 저장소**: `https://github.com/jinmingyu03/ai-idea-contest`
- **Vercel 프로젝트**: `jinmingyu/ai-idea-contest`
  - **대표 배포 주소 (Production)**: `https://ai-idea-contest.vercel.app`
  - 배포 상세 URL: `https://ai-idea-contest-5kn7exvml-jinmingyu.vercel.app`
  - 대시보드 Inspect: `https://vercel.com/jinmingyu/ai-idea-contest`
- **Airtable 베이스**: `https://airtable.com/appnztjAf1hVbPsQc/tblaqZKMdYUBedtPV`
  - Base ID: `appnztjAf1hVbPsQc`
  - Table Name: `Submissions` (`tblaqZKMdYUBedtPV`)
- **AI 모델**: `gemini-3.8-flash`

---

## 2. 현재까지 완료된 작업 (Step 1 ~ Step 5)

### ✅ Step 1 & Step 2: 작업 기획 및 공모전 요강·AI 평가 지시문 확정
- `작업기획서.md` 작성 완료.
- **공모전 주제**: 2026 사내 AI 업무 혁신 아이디어 공모전 (전 임직원 대상)
- **5개 고정 분야 선택지**:
  1. `문서·보고서 자동화`
  2. `데이터 분석·시각화`
  3. `고객·민원 응대 혁신`
  4. `사내 지식검색·협업 개선`
  5. `기타 업무 프로세스 개선`
- **AI 검토 규칙**:
  - 5개 분야 중 정확히 1개 분류
  - 창의성·실현가능성·기대효과·업무적합성 기준 **1~5점 정수 평점** (0점·소수점 원천 차단) + **한 줄 근거**
  - **강점 2가지 + 보완점 2가지, 5문장 이내** 심사평 초안
  - 화면 곳곳에 *"AI 평점·심사평은 초안이며 최종 심사는 사람(담당자)이 수행한다"* 문구 표시

### ✅ Step 3: 개발 환경 세팅 완료
- Next.js (App Router, React 19, Tailwind CSS, shadcn/ui) 프로젝트 구성 완료.
- GitHub 저장소(`jinmingyu03/ai-idea-contest`) 생성 및 푸시 완료.
- Airtable Meta API를 통해 `Submissions` 테이블 및 **14개 필수 필드** 자동 생성 완료:
  - 응모자 입력(7개): `팀명`, `구성원`, `아이디어 제목`, `아이디어 요약`, `기대 효과`, `응모자 전화번호`, `응모자 메일`
  - 자동/시스템(1개): `접수일시`
  - Gemini AI 초안(4개): `AI 분야`(Single select 5개 옵션), `AI 평점`(Rating 1~5), `AI 평점 근거`, `AI 심사평 초안`
  - 사람/후속 단계(2개): `담당자 확정 평점`(Rating 1~5, 칸 분리), `발송일시`(다음 단계 GAS 메일 발송 중복 방지용)
- 환경변수 파일 구성:
  - `.env` 및 `.env.local` 생성 완료 (`.gitignore`에 등록되어 GitHub에 절대 업로드되지 않음)
  - `.env.example` 생성 완료 (GitHub 포함)
  - Vercel 프로젝트(`jinmingyu/ai-idea-contest`)에 Production 환경변수 5개 등록 및 배포 완료.

### ✅ Step 4 & Step 5: 화면·서버 구현 및 가상 응모 검증 완료
- `/` (`src/app/page.tsx`): 공모 안내 화면 구현
- `/apply` (`src/app/apply/page.tsx`): 5개 접수 항목 + 전화번호·메일 입력 폼 및 `[가상 응모 예시 자동 채우기]` 구현 (실패 시 자동 반복 재시도 없음)
- `/status` (`src/app/status/page.tsx`): **`[현황 새로고침]` 버튼을 눌렀을 때만** `/api/status`를 호출해 분야별 건수 표시, 응모자 이름·연락처는 절대 비표시
- `/api/apply` (`src/app/api/apply/route.ts`) & `/api/status` (`src/app/api/status/route.ts`): 서버 전용 환경변수 사용, 브라우저 코드에 API 키/토큰 노출 없음 확인
- 가상 응모작 3건(`스마트워크추진팀`, `데이터인사이트팀`, `친절민원혁신팀`)을 `gemini-3.8-flash`로 검토하여 Airtable `Submissions` 테이블에 실제 저장 및 검증 완료.

---

## 3. 앞으로 해야 할 일 (Next Steps / 후속 과제)

1. **Vercel 실서버 배포 URL 최종 점검 및 GitHub 자동 배포 연결 확인**
   - 배포된 Vercel 주소에서 직접 추가 가상 응모 및 `/status` 새로고침 동작 확인
   - 필요 시 Vercel 대시보드(`Settings` → `Git`)에서 GitHub Login Connection 연결로 `git push` 자동 배포 활성화
2. **2단계 심화 과정: Airtable 웹훅 → Google Apps Script (GAS) 자동 메일 발송 연동** (`Airtable웹훅_GAS연동_세팅주의사항_v2.md` 참고)
   - Airtable에 새 레코드가 들어오면 웹훅 신호를 받아 GAS 웹앱(`doPost`)이 실행되도록 구축
   - **담당자에게는 알림 메일**, **응모자(`응모자 메일`)에게는 접수 확인 회신 메일** 자동 발송
   - **필수 주의사항 4가지 준수**:
     1. GAS `doPost(e)` 정상 처리 시 **아무것도 `return` 하지 말 것** (반환값이 있으면 HTTP 302가 나가 Airtable 웹훅이 13회 재시도 후 비활성화됨)
     2. Airtable의 `발송일시` 필드를 확인해 이미 값이 있으면 건너뛰는 **중복 발송 방지 로직** 적용 (`if (record.fields['발송일시']) return;`)
     3. 웹훅 7일 만료 방지를 위한 **하루 1회 시간 기반 트리거(웹훅 연장 `refresh` + 미처리 건 보완 발송)** 설정
     4. `GmailApp` 대신 권한 범위가 좁은 `MailApp.sendEmail` 사용 및 스크립트 속성(Script Properties)에 토큰 보관

---

## 4. 참고 사항 (트러블슈팅 메모)
- Windows PC 호스트명이 한글인 환경에서 Vercel CLI 실행 시 ByteString 헤더 오류가 발생할 수 있으며, 이 경우 `NODE_OPTIONS="--require .../fix-hostname.cjs"`로 `os.hostname()`을 영문으로 오버라이드하여 해결함.
- PowerShell에서 한글 데이터를 API로 전송할 때는 인코딩 깨짐 방지를 위해 반드시 UTF-8 스크립트 파일(`.mjs`)을 통해 실행할 것.
