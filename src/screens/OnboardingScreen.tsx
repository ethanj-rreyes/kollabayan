import { useState } from "react";
import Tag from "../components/Tag";

const SKILLS = [
  "React", "TypeScript", "Python", "UI/UX Design", "Figma", "Node.js",
  "Machine Learning", "Data Analysis", "Product Management", "iOS Dev",
  "Android Dev", "Backend Arch", "DevOps", "GraphQL", "Copywriting",
  "Marketing", "Video Editing", "Branding", "SQL", "Web3",
];

const STEPS = ["Identity", "Skills", "Availability", "Aspiration"];

export default function OnboardingScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [step, setStep] = useState(0);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [hours, setHours] = useState(10);
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [aspiration, setAspiration] = useState("");

  const toggleSkill = (s: string) =>
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );

  return (
    <div className="min-h-full bg-slate-50 flex flex-col items-center justify-start py-12 px-6">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Step indicator */}
        <div className="border-b border-slate-100 px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-slate-400">{STEPS[step]}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-slate-800" : "bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="px-8 py-7">
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Tell us about yourself</h2>
                <p className="text-sm text-slate-500 mt-1">This is your public identity on KollaBayan.</p>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Kim"
                    className="w-full border border-slate-200 rounded px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                    Academic School
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Carnegie Mellon University"
                    className="w-full border border-slate-200 rounded px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">What can you do?</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Select all that apply — no free text, just honest tags.
                  <span className="ml-1 font-semibold text-slate-700">{selectedSkills.length} selected</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <Tag
                    key={s}
                    label={s}
                    selected={selectedSkills.includes(s)}
                    onClick={() => toggleSkill(s)}
                  />
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">How much time do you have?</h2>
                <p className="text-sm text-slate-500 mt-1">Sets your availability limit for project matching.</p>
              </div>
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-end justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Hours / week</span>
                  <span className="text-3xl font-extrabold text-slate-900">{hours}h</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>1h</span>
                  <span>20h</span>
                  <span>40h</span>
                </div>
                <div className="mt-2 p-4 bg-slate-50 border border-slate-100 rounded text-sm text-slate-600">
                  {hours <= 5 && "Light touch — good for advisory or review roles."}
                  {hours > 5 && hours <= 15 && "Part-time contributor — solid for most side projects."}
                  {hours > 15 && hours <= 25 && "Committed collaborator — you can own full features."}
                  {hours > 25 && "High-bandwidth — ideal for sprint-based or core-team roles."}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">What do you want to build?</h2>
                <p className="text-sm text-slate-500 mt-1">One line. Make it real, not vague.</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                  Your Aspiration
                </label>
                <input
                  type="text"
                  value={aspiration}
                  onChange={(e) => setAspiration(e.target.value)}
                  placeholder="A tool that helps indie hackers find paying users faster."
                  className="w-full border border-slate-200 rounded px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-500 transition-colors"
                />
                <p className="text-xs text-slate-400 mt-2">Shown on your public profile. Keep it under 140 chars.</p>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Profile Preview</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {name ? name.split(" ").map((n) => n[0]).join("") : "AK"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{name || "Alex Kim"}</p>
                    <p className="text-xs text-slate-500">{school || "CMU"}</p>
                  </div>
                </div>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.slice(0, 5).map((s) => (
                      <Tag key={s} label={s} selected />
                    ))}
                    {selectedSkills.length > 5 && (
                      <span className="text-xs text-slate-400 flex items-center">+{selectedSkills.length - 5} more</span>
                    )}
                  </div>
                )}
                <p className="text-xs text-slate-600 italic">{aspiration || "My aspiration will appear here..."}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="px-8 py-5 border-t border-slate-100 flex justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Back
          </button>
          <button
            onClick={() => {
              if (step === STEPS.length - 1) {
                onNavigate?.("discovery");
              } else {
                setStep((s) => Math.min(STEPS.length - 1, s + 1));
              }
            }}
            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {step === STEPS.length - 1 ? "Complete Setup →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
