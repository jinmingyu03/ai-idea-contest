export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          Step 3 · 초기 배포 연결 확인 완료
        </span>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          2026 사내 AI 업무 혁신 아이디어 공모전
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          GitHub 저장소와 Vercel 배포 연결이 정상적으로 완료되었습니다.
          <br />
          다음 단계에서 공모 안내 · 응모 폼 · 접수 현황 화면이 이곳에 표시됩니다.
        </p>
      </div>
    </main>
  );
}
