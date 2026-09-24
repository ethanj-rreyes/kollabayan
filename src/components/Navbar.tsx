import Logo from "./Logo";
import AvatarPlaceholder from "./AvatarPlaceholder";

const LINKS = [
  { id: "discovery", label: "Discovery" },
  { id: "workspace", label: "Workspace" },
  { id: "profile", label: "Profile" },
];

export default function Navbar({ active, onNavigate }: { active: string; onNavigate: (screen: string) => void }) {
  const isAuthScreen = active === "landing" || active === "onboarding";

  return (
    <header className="bg-layag/95 backdrop-blur border-b border-buhangin px-8 h-16 flex items-center justify-between shrink-0">
      <button className="cursor-pointer" onClick={() => onNavigate("landing")} aria-label="KollaBayan home">
        <Logo size="sm" />
      </button>

      {isAuthScreen ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lalim">Find. Build. Show.</span>
      ) : (
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-7 h-16">
            {LINKS.map((l) => {
              const on = active === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => onNavigate(l.id)}
                  className={`relative h-full text-sm font-semibold transition-colors cursor-pointer ${
                    on ? "text-tinta" : "text-tinta/55 hover:text-tinta"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute left-0 right-0 bottom-0 h-[3px] rounded-t-full bg-laot transition-opacity ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>
          <button onClick={() => onNavigate("profile")} className="cursor-pointer" aria-label="Your profile">
            <AvatarPlaceholder size={32} initials="AK" />
          </button>
        </div>
      )}
    </header>
  );
}
