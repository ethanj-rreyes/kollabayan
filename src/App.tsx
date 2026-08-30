import { useState } from "react";
import Navbar from "./components/Navbar";
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

export default function App() {
  const [active, setActive] = useState("landing");

  return (
    <div className="flex flex-col h-full bg-slate-100 font-[Inter,sans-serif]">
      {/* Screen switcher nav (Dev Only) */}
      <nav className="flex items-center gap-2 border-b border-slate-300 bg-amber-50 shrink-0 overflow-x-auto px-2 py-1">
        <div className="flex items-center gap-2 border-r border-amber-200 pr-3 shrink-0 select-none">
          <span className="text-[10px] font-bold tracking-widest uppercase text-amber-700">
            WIREFLOW
          </span>
          <span className="text-[9px] text-amber-600/70 uppercase tracking-wider">
            (For demonstration purposes only)
          </span>
        </div>
        <div className="flex items-center gap-1">
          {SCREENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`px-3 py-1 text-[10px] font-semibold tracking-wide shrink-0 rounded transition-colors cursor-pointer ${
                active === s.id
                  ? "bg-amber-700 text-white"
                  : "text-amber-700 hover:bg-amber-100"
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
        {active === "landing" && <LandingScreen onNavigate={setActive} />}
        {active === "onboarding" && <OnboardingScreen onNavigate={setActive} />}
        {active === "discovery" && <DiscoveryFeedScreen onNavigate={setActive} />}
        {active === "workspace" && <WorkspaceScreen onNavigate={setActive} />}
        {active === "profile" && <ProfileScreen onNavigate={setActive} />}
      </div>
    </div>
  );
}
