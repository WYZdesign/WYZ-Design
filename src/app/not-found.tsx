import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-[#1C1C1E] px-6">
      <div className="text-center max-w-md">
        <p className="text-[#DF3131] text-[11px] font-heading font-bold tracking-[0.3em] uppercase mb-4">
          404
        </p>
        <h1 className="text-[2.5rem] sm:text-[3.5rem] font-heading font-black text-[#333] dark:text-[#e0e0e0] tracking-[0.03em] leading-none mb-4">
          LET&apos;S GET YOU SOMEWHERE GOOD
        </h1>
        <p className="text-[#666] dark:text-[#666] text-[15px] leading-relaxed mb-8">
          That page may have moved, but you&apos;re only one tap away from the good stuff.
        </p>
        <Link
          href="/home"
          className="inline-block px-8 py-3.5 bg-[#DF3131] text-white font-heading font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#B82020] transition-all"
        >
          BACK TO HOME
        </Link>
      </div>
    </main>
  );
}
