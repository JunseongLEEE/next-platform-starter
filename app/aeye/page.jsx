export default function Page() {
  const src = process.env.NEXT_PUBLIC_AEYE_UI_ORIGIN || '';
  const missing = !src;
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      {missing ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: 24, textAlign: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 12 }}>A-EYE 주소가 설정되지 않았습니다.</h1>
            <p style={{ opacity: 0.9 }}>
              Netlify 환경변수 <code>NEXT_PUBLIC_AEYE_UI_ORIGIN</code>에 A-EYE 배포 URL(예: https://aeye.example.com 또는 ngrok HTTPS)을 설정한 뒤 다시 배포하세요.
            </p>
          </div>
        </div>
      ) : (
        <iframe
          src={src}
          title="A-EYE"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="camera; microphone; geolocation; autoplay; clipboard-read; clipboard-write"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}
    </div>
  );
}

