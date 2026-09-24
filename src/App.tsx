import { useState } from "react";
import Navbar from "./components/Navbar";
import BrandMark from "./components/BrandMark";
import LandingScreen from "./screens/LandingScreen";
import OnboardingScreen from "./screens/OnboardingScreen";
import DiscoveryFeedScreen from "./screens/DiscoveryFeedScreen";
import WorkspaceScreen from "./screens/WorkspaceScreen";
import ProfileScreen from "./screens/ProfileScreen";

const SCREENS = [
  { id: "landing", label: "01 Landing" },
  { id: "onboarding", label: "02 Onboarding" },
  { id: "discovery", label: "03 Discovery Feed" },
  { id: "workspace", label: "05 Workspace" },
  { id: "profile", label: "06 Profile" },
];

export type Prefill = { firstName?: string; lastName?: string; email?: string };

export default function App() {
  const [active, setActive] = useState("landing");
  const [prefill, setPrefill] = useState<Prefill>({});

  const signIn = (p: Prefill) => {
    setPrefill(p);
    setActive("onboarding");
  };

  return (
    <div className="flex flex-col h-full bg-layag font-sans text-tinta">
      {/* Screen switcher nav (Dev Only) */}
      <nav className="flex items-center gap-2 bg-tinta shrink-0 overflow-x-auto px-3 py-1.5">
        <div className="flex items-center gap-2 border-r border-layag/15 pr-3 shrink-0 select-none">
          <BrandMark size={16} tone="light" mono />
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-layag">Screens</span>
        </div>
        <div className="flex items-center gap-1">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`px-3 py-1 text-[10px] font-semibold tracking-wide shrink-0 rounded-full transition-colors cursor-pointer ${
                active === s.id ? "bg-laot text-layag" : "text-layag/60 hover:text-layag hover:bg-layag/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Real App Navbar */}
      <Navbar active={active} onNavigate={setActive} />

      {/* Screen viewport */}
      <div className="flex-1 overflow-auto">
        {active === "landing" && <LandingScreen onNavigate={setActive} onSignIn={signIn} />}
        {active === "onboarding" && <OnboardingScreen key={JSON.stringify(prefill)} onNavigate={setActive} prefill={prefill} />}
        {active === "discovery" && <DiscoveryFeedScreen onNavigate={setActive} />}
        {active === "workspace" && <WorkspaceScreen onNavigate={setActive} />}
        {active === "profile" && <ProfileScreen onNavigate={setActive} />}
      </div>
    </div>
  );
}
