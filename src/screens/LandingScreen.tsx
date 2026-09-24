import BrandMark from "../components/BrandMark";
import AvatarPlaceholder from "../components/AvatarPlaceholder";
import VerifiedBadge from "../components/VerifiedBadge";
import Icon from "../components/Icon";
import Sheet, { fieldInput, fieldLabel, primaryBtn, ghostBtn } from "../components/Sheet";
import { useState } from "react";

const PILLARS = [
  {
    eyebrow: "Find",
    title: "Find the right crew.",
    body: "Hackathon, research, competition, or passion project: there's a teammate who fits your role and your pace.",
    bg: "bg-dagat",
    eyebrowColor: "text-liwayway",
  },
  {
    eyebrow: "Build",
    title: "Row together.",
    body: "One light workspace: tasks, files, and decisions in one place, so the project doesn't die in the group chat.",
    bg: "bg-laot",
    eyebrowColor: "text-liwayway",
  },
  {
    eyebrow: "Show",
    title: "Reach the shore. Show it.",
    body: "Every finished project is verified by your crew and added to a portfolio you can be proud of.",
    bg: "bg-lalim",
    eyebrowColor: "text-layag",
  },
];

type Prefill = { firstName?: string; lastName?: string; email?: string };

export default function LandingScreen({
  onNavigate,
  onSignIn,
}: {
  onNavigate?: (screen: string) => void;
  onSignIn?: (p: Prefill) => void;
}) {
  const [emailOpen, setEmailOpen] = useState(false);
  const [email, setEmail] = useState("");
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const signIn = (p: Prefill) => (onSignIn ? onSignIn(p) : onNavigate?.("onboarding"));
  const googleSignIn = () => signIn({ firstName: "Juan", lastName: "Dela Cruz", email: "juan.delacruz@gmail.com" });
  const emailSignIn = () => {
    if (!emailValid) return;
    setEmailOpen(false);
    signIn({ email: email.trim() });
  };

  return (
    <div className="min-h-full bg-layag flex flex-col">
      {/* HERO */}
      <section className="px-8 pt-16 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          {/* Copy */}
          <div className="flex flex-col gap-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lalim">
              Hackathon · Research · Competition · Passion project
            </span>

            <div className="flex flex-col gap-5">
              <h1 className="font-display text-6xl lg:text-7xl text-tinta">
                Find. Build.
                <br />
                Show.
              </h1>
              <p className="text-lg text-tinta/75 leading-relaxed max-w-md">
                You're not alone in the Balangay. Find your crew, row together, and show what you shipped.
              </p>
            </div>

            {/* Auth buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={googleSignIn}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-laot text-layag text-sm font-semibold rounded-full hover:bg-dagat transition-colors cursor-pointer"
              >
                <span className="w-5 h-5 rounded-full bg-layag flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-laot">G</span>
                </span>
                Sign in with Google
              </button>
              <button
                onClick={() => setEmailOpen(true)}
                className="inline-flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-buhangin text-tinta text-sm font-semibold rounded-full hover:border-lalim/50 transition-colors cursor-pointer"
              >
                <Icon name="mail" size={16} className="text-lalim" />
                Sign in with Email
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex">
                {["AK", "MR", "JT", "SP"].map((i) => (
                  <div key={i} className="-ml-2 first:ml-0">
                    <AvatarPlaceholder size={30} initials={i} ring />
                  </div>
                ))}
              </div>
              <span className="text-sm text-tinta/65">
                <span className="font-semibold text-tinta">1,200+</span> builders already aboard
              </span>
            </div>
          </div>

          {/* Brand panel */}
          <div className="relative">
            <div className="bg-dagat rounded-3xl aspect-[4/4.2] flex flex-col items-center justify-center gap-6 overflow-hidden relative">
              <BrandMark size={180} tone="light" />
              <p className="font-display text-3xl text-layag text-center px-8">
                One boat,
                <br />
                <em className="font-display">one shore.</em>
              </p>
              <svg className="absolute bottom-0 left-0 w-full" height="46" viewBox="0 0 400 46" preserveAspectRatio="none">
                <path
                  d="M0 22 C33 10 66 10 100 22 S166 34 200 22 S266 10 300 22 S366 34 400 22 V46 H0 Z"
                  fill="#1E5B57"
                />
              </svg>
            </div>
            <div className="absolute -left-6 bottom-16">
              <VerifiedBadge />
            </div>
          </div>
        </div>
      </section>

      {/* FIND · BUILD · SHOW */}
      <section className="px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-6">
            <h2 className="font-display text-4xl text-tinta max-w-md">Together at the oar, together at the shore.</h2>
            <button
              onClick={googleSignIn}
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-dagat hover:text-laot transition-colors cursor-pointer"
            >
              Let's row, team. <Icon name="arrow-right" size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PILLARS.map((p) => (
              <div key={p.eyebrow} className={`${p.bg} rounded-2xl p-7 flex flex-col gap-5 min-h-[300px]`}>
                <span className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${p.eyebrowColor}`}>
                  {p.eyebrow}
                </span>
                <h3 className="font-display text-[34px] text-layag">{p.title}</h3>
                <p className="text-sm text-layag/80 leading-relaxed mt-auto">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-buhangin px-8 py-5">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span className="text-xs text-tinta/55">© 2026 KollaBayan · Terms · Privacy</span>
          <span className="font-display italic text-lg text-tinta">One boat, one shore.</span>
        </div>
      </footer>
      <Sheet
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        variant="center"
        width={420}
        eyebrow="Sign in"
        title="Come aboard with email"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setEmailOpen(false)} className={ghostBtn}>Cancel</button>
            <button onClick={emailSignIn} disabled={!emailValid} className={primaryBtn}>
              Continue <Icon name="arrow-right" size={16} />
            </button>
          </div>
        }
      >
        <label className={fieldLabel}>Email</label>
        <input
          autoFocus
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && emailSignIn()}
          placeholder="juan.delacruz@email.com"
          className={fieldInput}
        />
        <p className="text-xs text-tinta/50 mt-2">We'll carry this into your profile setup.</p>
      </Sheet>
    </div>
  );
}
