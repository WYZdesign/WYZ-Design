"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#111", color: "#fff", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: 48, marginBottom: 12, color: "#D49341", fontFamily: "'Montserrat', sans-serif", fontWeight: 900 }}>W</div>
            <p style={{ color: "#DF3131", fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 8px" }}>WYZ Design</p>
            <h1 style={{ fontSize: 30, fontWeight: 900, letterSpacing: "0.03em", margin: "0 0 12px" }}>LET&apos;S GET YOU BACK IN</h1>
            <p style={{ color: "#aaa", lineHeight: 1.6, margin: "0 0 28px" }}>One tap and you&apos;ll be right back where you were.</p>
            <button
              onClick={reset}
              style={{ background: "#DF3131", color: "#fff", border: "none", padding: "14px 34px", borderRadius: 999, fontSize: 14, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}
            >
              Refresh
            </button>
            <div style={{ marginTop: 16 }}>
              <a href="/home" style={{ color: "#DF3131", textDecoration: "none", fontSize: 14 }}>Go to home</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
