import Link from "next/link";

export default function SplashPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        background: "#161311",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="text-center"
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
          <img
            src="/images/wyz-crown.png"
            alt="WYZ Design Crown"
            width={120}
            height={120}
            style={{ width: "120px", height: "120px", objectFit: "contain", margin: "0 auto 24px" }}
          />
          <div className="mb-4">
            <span
              className="font-heading font-black text-white uppercase"
              style={{ fontSize: "48px", letterSpacing: "0.1em", lineHeight: 0.9, display: "block" }}
            >
              WYZ{" "}
            </span>
            <span
              className="font-heading font-black uppercase text-white mb-2 block"
              style={{
                fontSize: "48px",
                letterSpacing: "0.1em",
                lineHeight: 0.9,
                background: "linear-gradient(90deg, #DF3131 0%, #D49341 50%, #DF3131 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              DESIGN
            </span>
          </div>
          <p
            className="font-heading uppercase font-bold mb-8"
            style={{ color: "#cbcbca", fontSize: "14px", letterSpacing: "0.2em" }}
          >
            Creative Agency
          </p>
          <Link
            href="/home"
            className="inline-block border-2 border-white text-white px-8 py-4 font-heading font-bold tracking-[0.15em] uppercase text-[14px] text-center hover:bg-white hover:text-[#161311] transition-all"
            style={{ transition: "all 0.3s ease" }}
          >
            ENTER SITE
          </Link>
        </div>
      </div>
    </div>
  );
}
