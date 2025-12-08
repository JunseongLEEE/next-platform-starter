'use client';

import { useEffect, useMemo, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  const envSrc = process.env.NEXT_PUBLIC_AEYE_UI_ORIGIN || '';
  // 개발 편의 기본값(즉시 동작 요청에 따라 하드코드)
  const DEV_FALLBACK_SRC = 'https://nonsparing-balustered-juanita.ngrok-free.dev';

  // 초기에는 ENV 또는 Fallback으로 설정 (SSR 안전)
  const initialSrc = useMemo(() => envSrc || DEV_FALLBACK_SRC, [envSrc]);
  const [resolvedSrc, setResolvedSrc] = useState(initialSrc);

  useEffect(() => {
    // 클라이언트에서만 쿼리 파라미터 읽기
    try {
      const usp = new URLSearchParams(window.location.search);
      const param = usp.get('src')?.trim() || '';
      if (param) {
        setResolvedSrc(param);
        try { localStorage.setItem('aeye_src', param); } catch {}
        return;
      }
    } catch {}
    // 쿼리가 없으면 최근 값 복구
    try {
      const last = localStorage.getItem('aeye_src') || '';
      if (last) setResolvedSrc(last);
    } catch {}
    // 최종적으로 ENV 또는 Fallback 유지
    if (!envSrc && DEV_FALLBACK_SRC && !resolvedSrc) {
      setResolvedSrc(DEV_FALLBACK_SRC);
    }
  }, [envSrc, resolvedSrc]);

  const missing = !resolvedSrc;
  return (
    <section className="flex flex-col gap-6">
      <header className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">A‑EYE 시연</h1>
        {!missing && (
          <a
            href={resolvedSrc}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            새 창에서 열기
          </a>
        )}
      </header>

      {missing ? (
        <div className="mx-auto w-full max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-6 shadow-xl backdrop-blur">
          <div className="mb-3 text-lg font-semibold">A‑EYE 주소가 설정되지 않았습니다.</div>
          <p className="mb-5 text-white/80">
            Netlify 환경변수 <code className="rounded bg-white/10 px-1 py-0.5">NEXT_PUBLIC_AEYE_UI_ORIGIN</code>에 A‑EYE
            배포 URL을 설정하거나, 아래 입력창에 주소를 넣어주세요.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const v = (formData.get('src') || '').toString().trim();
              if (v && typeof window !== 'undefined') {
                try {
                  localStorage.setItem('aeye_src', v);
                } catch {}
                window.location.href = `/aeye?src=${encodeURIComponent(v)}`;
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="url"
              name="src"
              placeholder="https://<your-aeye-url> (예: https://<ngrok>.ngrok-free.dev)"
              required
              className="flex-1 rounded-lg border border-white/20 bg-transparent px-3 py-2 outline-none placeholder:text-white/40 focus:border-white/40"
            />
            <button
              type="submit"
              className="rounded-lg bg-sky-500 px-4 py-2 font-semibold text-white hover:bg-sky-400"
            >
              열기
            </button>
            <button
              type="button"
              onClick={() => {
                const v = DEV_FALLBACK_SRC;
                if (v && typeof window !== 'undefined') {
                  try {
                    localStorage.setItem('aeye_src', v);
                  } catch {}
                  window.location.href = `/aeye?src=${encodeURIComponent(v)}`;
                }
              }}
              className="rounded-lg border border-emerald-300/40 bg-emerald-500/20 px-4 py-2 font-semibold text-emerald-200 hover:bg-emerald-500/30"
            >
              기본 주소로 열기
            </button>
          </form>
        </div>
      ) : (
        <div className="relative h-[75vh] w-full overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl bg-black/40">
          <iframe
            src={resolvedSrc}
            title="A‑EYE"
            className="absolute inset-0 h-full w-full"
            allow="camera; microphone; geolocation; autoplay; clipboard-read; clipboard-write; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      )}
    </section>
  );
}

