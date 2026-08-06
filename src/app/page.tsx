import Link from "next/link";

export default function SplashPage() {
  return (
    <div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center"
      style={{
        background: "#161311",
        minHeight: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
        <div className="text-center space-y-8">
          <img
            src="/images/wyz-crown.png"
            alt="WYZ Design Crown"
            width={120}
            height={120}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-8 object-contain animate-pulse"
            style={{ filter: "drop-shadow(0 0 30px rgba(223, 49, 49, 0.6))" }}
          />
          
          <div className="space-y-2">
            <h1 className="font-heading font-black uppercase leading-none">
              <span 
                className="text-white block text-4xl sm:text-5xl md:text-6xl mb-2"
                style={{ letterSpacing: "0.1em" }}
              >
                WYZ
              </span>
              <span 
                className="block bg-gradient-to-r from-[#DF3131] via-[#D49341] to-[#DF3131] bg-clip-text text-transparent"
                style={{
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                  fontWeight: "700",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "0.1em",
                }}
              >
                DESIGN
              </span>
            </h1>
            
            <p 
              className="font-heading font-bold uppercase tracking-[0.2em]"
              style={{
                color: "#cbcbca",
                fontSize: "14px",
                marginTop: "16px",
              }}
            >
              Creative Agency
            </p>
          </div>
          
          <Link
            href="/home"
            className="group relative inline-block px-8 py-4 border-2 border-white text-white font-heading font-bold tracking-[0.15em] uppercase text-sm transition-all duration-300 ease-in-out"
            style={{ borderRadius: "4px" }}
          >
            <span className="relative z-10">ENTER SITE</span>
            <div 
              className="absolute inset-0 bg-white transform scale-y-0 origin-bottom transition-transform duration-300 ease-in-out"
              style={{ borderRadius: "2px" }}
            />
          </Link>
        </div>
        
        {/* Background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#DF3131]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D49341]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#DF3131]/5 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
