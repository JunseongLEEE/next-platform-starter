'use client';

import { useEffect, useMemo, useState } from 'react';

export const dynamic = 'force-dynamic';

export default function Page() {
  const envSrc = process.env.NEXT_PUBLIC_AEYE_UI_ORIGIN || '';
  // 개발 편의 기본값(즉시 동작 요청에 따라 하드코드)
  const DEV_FALLBACK_SRC = 'https://messages-top-appliances-example.trycloudflare.com/';

  // 초기에는 ENV 또는 Fallback으로 설정 (SSR 안전)
  const initialSrc = useMemo(() => envSrc || DEV_FALLBACK_SRC, [envSrc]);
  const [resolvedSrc, setResolvedSrc] = useState(initialSrc);

  useEffect(() => {
    // helper: id
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function setCookie(name, value, days) {
      let expires = '';
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
      }
      document.cookie = `${name}=${value || ''}${expires}; path=/`;
    }
    function getOrCreateUserId() {
      const existing = getCookie('user');
      if (existing) return existing;
      const id = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCookie('user', id, 180);
      return id;
    }
    const userId = getOrCreateUserId();
    const device =
      typeof navigator !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        ? 'mobile'
        : 'desktop';
    const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
    async function logUsage(event, extra = {}) {
      try {
        await fetch('/api/gsheet/usage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userId,
            event,
            timestamp: ts,
            device,
            page: '/aeye',
            src: resolvedSrc || '',
            ...extra,
          }),
        });
      } catch {}
    }

    // 클라이언트에서만 쿼리 파라미터 읽기
    try {
      const usp = new URLSearchParams(window.location.search);
      const param = usp.get('src')?.trim() || '';
      if (param) {
        setResolvedSrc(param);
        try { localStorage.setItem('aeye_src', param); } catch {}
        logUsage('aeye_src_param', { value: param });
        return;
      }
    } catch {}
    // 쿼리가 없으면 최근 값 복구
    try {
      const last = localStorage.getItem('aeye_src') || '';
      if (last) {
        setResolvedSrc(last);
        logUsage('aeye_src_localstorage', { value: last });
      }
    } catch {}
    // 최종적으로 ENV 또는 Fallback 유지
    if (!envSrc && DEV_FALLBACK_SRC && !resolvedSrc) {
      setResolvedSrc(DEV_FALLBACK_SRC);
    }
    // 최초 진입 로그
    logUsage('aeye_page_view');

    // postMessage 이벤트 수신(임베드 앱이 이벤트를 보낼 경우)
    function onMessage(ev) {
      try {
        const origin = new URL(resolvedSrc || DEV_FALLBACK_SRC).origin;
        if (ev.origin !== origin) return;
      } catch {
        return;
      }
      const data = ev.data || {};
      if (data && data.type === 'aeye_event') {
        logUsage('aeye_event', data.payload || {});
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
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
            onClick={() => {
              try {
                fetch('/api/gsheet/usage', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ event: 'aeye_open_new_tab', url: resolvedSrc }),
                });
              } catch {}
            }}
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

