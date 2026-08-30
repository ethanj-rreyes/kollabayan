export default function Navbar({ active, onNavigate }: { active: string; onNavigate: (screen: string) => void }) {
  // We might not want to show the full navbar on landing or onboarding
  const isAuthScreen = active === "landing" || active === "onboarding";

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate("landing")}>
        <span className="text-sm font-bold tracking-widest uppercase text-slate-900">KollaBayan</span>
        {isAuthScreen && <span className="text-xs text-slate-400">v0.1 — wireframe</span>}
      </div>

      {!isAuthScreen && (
        <nav className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("discovery")}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              active === "discovery" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Discovery
          </button>
          <button
            onClick={() => onNavigate("workspace")}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              active === "workspace" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => onNavigate("profile")}
            className={`text-sm font-semibold transition-colors cursor-pointer ${
              active === "profile" ? "text-slate-900" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Profile
          </button>
        </nav>
      )}
    </header>
  );
}
