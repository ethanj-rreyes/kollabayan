export default function LandingScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  return (
    <div className="min-h-full bg-white flex flex-col">
      {/* Thin top rule */}
      <div className="h-1 bg-slate-900 w-full" />

      {/* Hero — centered column */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="flex flex-col items-center gap-8 max-w-lg w-full text-center">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
            <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
              Collaborative Projects · Students & Builders
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              Where your next group project actually ships.
            </h1>
            <p className="text-base text-slate-500 leading-relaxed max-w-sm mx-auto">
              Find collaborators who are serious, match on skills and vibe, and build something real — no cold DMs, no group-chat chaos.
            </p>
          </div>

          {/* Auth buttons */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={() => onNavigate?.("onboarding")}
              className="flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-slate-900 bg-slate-900 text-white text-sm font-semibold rounded hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {/* Google logo placeholder */}
              <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-[8px] font-bold text-white">G</span>
              </div>
              Sign In with Google
            </button>
            <button
              onClick={() => onNavigate?.("onboarding")}
              className="flex items-center justify-center gap-3 px-6 py-3.5 border-2 border-slate-200 bg-white text-slate-700 text-sm font-semibold rounded hover:border-slate-400 transition-colors cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="#64748b" strokeWidth="1.5" />
                <path d="M2 6h12" stroke="#64748b" strokeWidth="1.5" />
              </svg>
              Sign In with Email
            </button>
          </div>

          {/* Social proof line */}
          <div className="flex items-center gap-3 pt-2">
            {["AK", "MR", "TL", "SP"].map((i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white -ml-2 first:ml-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-slate-500">{i}</span>
              </div>
            ))}
            <span className="text-xs text-slate-400 ml-1">
              Join 1,200+ builders already shipping
            </span>
          </div>
        </div>
      </div>

      {/* Bottom rule */}
      <footer className="border-t border-slate-100 px-8 py-4 flex justify-between items-center">
        <span className="text-xs text-slate-400">© 2026 KollaBayan</span>
        <div className="flex gap-4">
          <span className="text-xs text-slate-400 cursor-pointer hover:text-slate-700 transition-colors">Terms</span>
          <span className="text-xs text-slate-400 cursor-pointer hover:text-slate-700 transition-colors">Privacy</span>
        </div>
      </footer>
    </div>
  );
}
