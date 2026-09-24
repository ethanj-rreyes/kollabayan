import { useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Tag from "../components/Tag";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SKILL_GROUPS: { category: string; skills: string[] }[] = [
  {
    category: "Creative & Design",
    skills: [
      "Graphic Design", "Illustration", "Photography", "Videography",
      "Video Editing", "UI/UX Design", "Animation", "Music & Audio",
      "Content Creation", "Fashion & Styling",
    ],
  },
  {
    category: "Communication & Media",
    skills: [
      "Writing & Copywriting", "Public Speaking", "Social Media", "Journalism",
      "Hosting & Emceeing", "Storytelling", "Translation", "Debate",
    ],
  },
  {
    category: "Business & Management",
    skills: [
      "Project Management", "Marketing", "Sales", "Finance & Accounting",
      "Entrepreneurship", "Operations", "HR & Recruitment", "Event Planning",
      "Budgeting", "Customer Service",
    ],
  },
  {
    category: "Tech & Data",
    skills: [
      "Web Development", "Mobile Development", "Data Analysis", "Databases & SQL",
      "AI & Machine Learning", "Cybersecurity", "IT Support", "Game Development",
      "Robotics", "No-Code Tools",
    ],
  },
  {
    category: "Research & Academics",
    skills: [
      "Academic Research", "Scientific Writing", "Statistics", "Survey Design",
      "Literature Review", "Laboratory Work", "Data Gathering", "Tutoring",
    ],
  },
  {
    category: "Engineering & Hands-on",
    skills: [
      "CAD & Drafting", "Electronics", "Prototyping", "Fabrication",
      "Construction Basics", "Agriculture", "Environmental Science", "Logistics",
    ],
  },
  {
    category: "People & Community",
    skills: [
      "Teaching", "Community Organizing", "Counseling & Guidance",
      "Healthcare Basics", "Volunteering & Outreach", "Mentoring",
      "Facilitation", "Fundraising",
    ],
  },
];

const PROJECT_TYPES = [
  "School Projects",
  "Competitions",
  "Startups",
  "Businesses",
  "Spinoffs",
];

const SETUP_OPTIONS = [
  { id: "Hybrid", desc: "Mix of meetups and online work" },
  { id: "Online", desc: "Everything happens remotely" },
  { id: "F2F", desc: "Face-to-face, in the same place" },
];

const STEPS = ["You", "Skills", "Interests", "Collaboration"];

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function FieldLabel({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
        {children}
      </label>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-800 focus:ring-2 focus:ring-slate-900/10 transition-colors";

function ChoiceCard({
  title,
  desc,
  selected,
  onClick,
}: {
  title: string;
  desc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex-1 text-left rounded-lg border px-4 py-3.5 transition-all cursor-pointer ${
        selected
          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      <span className={`block text-sm font-semibold ${selected ? "text-white" : "text-slate-800"}`}>
        {title}
      </span>
      {desc && (
        <span className={`mt-0.5 block text-xs ${selected ? "text-slate-300" : "text-slate-500"}`}>
          {desc}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

export default function OnboardingScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [step, setStep] = useState(0);

  // Step 1 — You
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState<"" | "Student" | "Working Professional">("");
  const [affiliation, setAffiliation] = useState("");
  const [bio, setBio] = useState("");

  // Step 2 — Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Step 3 — Interests
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  // Step 4 — Collaboration
  const [city, setCity] = useState("");
  const [setupPref, setSetupPref] = useState("");
  const [hours, setHours] = useState(10);

  const BIO_MAX = 160;

  const toggle = (setter: Dispatch<SetStateAction<string[]>>, value: string) =>
    setter((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]));

  /* --- Skills search ------------------------------------------------ */
  const searching = skillQuery.trim().length > 0;

  const filteredGroups = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return SKILL_GROUPS;
    return SKILL_GROUPS.map((g) => ({
      ...g,
      skills: g.skills.filter((s) => s.toLowerCase().includes(q)),
    })).filter((g) => g.skills.length > 0);
  }, [skillQuery]);

  const countIn = (skills: string[]) =>
    skills.filter((s) => selectedSkills.includes(s)).length;

  /* --- Validation ---------------------------------------------------- */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const contactValid = contact.replace(/\D/g, "").length >= 10;

  const stepValid = [
    firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      emailValid &&
      contactValid &&
      role !== "" &&
      bio.trim().length > 0,
    selectedSkills.length > 0,
    projectTypes.length > 0,
    city.trim().length > 0 && setupPref !== "",
  ][step];

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-full bg-slate-50 flex flex-col items-center justify-start py-12 px-6">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* ---------------- Step indicator ---------------- */}
        <div className="border-b border-slate-100 px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-semibold text-slate-600">{STEPS[step]}</span>
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
          {/* ================= STEP 1 — YOU ================= */}
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Let's start with you</h2>
                <p className="text-sm text-slate-500 mt-1">
                  This is what collaborators see first.
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <FieldLabel>First Name</FieldLabel>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Juan"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <FieldLabel>Last Name</FieldLabel>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dela Cruz"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <FieldLabel hint={email.length > 0 && !emailValid ? "Check this address" : undefined}>
                  Email
                </FieldLabel>
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="juan.delacruz@email.com"
                  className={`${inputClass} ${
                    email.length > 0 && !emailValid ? "border-rose-300 focus:border-rose-400" : ""
                  }`}
                />
              </div>

              <div>
                <FieldLabel hint="Used only for project coordination">Contact Number</FieldLabel>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="+63 912 345 6789"
                  className={`${inputClass} ${
                    contact.length > 0 && !contactValid
                      ? "border-rose-300 focus:border-rose-400"
                      : ""
                  }`}
                />
              </div>

              <div>
                <FieldLabel>I am a</FieldLabel>
                <div className="flex gap-3">
                  <ChoiceCard
                    title="Student"
                    desc="Senior high or college"
                    selected={role === "Student"}
                    onClick={() => setRole("Student")}
                  />
                  <ChoiceCard
                    title="Working Professional"
                    desc="Employed, freelance, or running something"
                    selected={role === "Working Professional"}
                    onClick={() => setRole("Working Professional")}
                  />
                </div>
              </div>

              {role !== "" && (
                <div>
                  <FieldLabel hint="Optional">
                    {role === "Student" ? "School" : "Company or Field"}
                  </FieldLabel>
                  <input
                    type="text"
                    value={affiliation}
                    onChange={(e) => setAffiliation(e.target.value)}
                    placeholder={
                      role === "Student"
                        ? "University of the Philippines Diliman"
                        : "Ayala Land — Marketing"
                    }
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <FieldLabel hint={`${bio.length}/${BIO_MAX}`}>Short Bio</FieldLabel>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
                  rows={2}
                  placeholder="Who are you, in your own words? One or two lines."
                  className={`${inputClass} resize-none leading-relaxed`}
                />
                <p className="text-xs text-slate-400 mt-2">
                  Example: "Marketing student who loves turning messy ideas into campaigns."
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 2 — SKILLS ================= */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">What are you good at?</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Open a category to see its skills. School, work, or self-taught all count.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="Search skills..."
                  className={`${inputClass} py-2.5`}
                />
                <span className="shrink-0 text-xs font-semibold text-slate-600 tabular-nums">
                  {selectedSkills.length} selected
                </span>
              </div>

              {selectedSkills.length > 0 && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Your picks
                    </span>
                    <button
                      onClick={() => setSelectedSkills([])}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((s) => (
                      <Tag
                        key={s}
                        label={`${s}  ×`}
                        selected
                        onClick={() => toggle(setSelectedSkills, s)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Accordion */}
              <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
                {filteredGroups.map((group) => {
                  const isOpen = searching || openCategory === group.category;
                  const picked = countIn(group.skills);
                  return (
                    <div
                      key={group.category}
                      className="rounded-lg border border-slate-200 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCategory((c) => (c === group.category ? null : group.category))
                        }
                        aria-expanded={isOpen}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer ${
                          isOpen ? "bg-slate-50" : "bg-white hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {group.category}
                          </span>
                          {picked > 0 && (
                            <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white tabular-nums">
                              {picked}
                            </span>
                          )}
                        </span>
                        <span
                          className={`text-xs text-slate-400 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                      {isOpen && (
                        <div className="flex flex-wrap gap-2 border-t border-slate-100 px-4 py-3.5">
                          {group.skills.map((s) => (
                            <Tag
                              key={s}
                              label={s}
                              selected={selectedSkills.includes(s)}
                              onClick={() => toggle(setSelectedSkills, s)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {filteredGroups.length === 0 && (
                  <p className="text-sm text-slate-400 py-6 text-center">
                    No skills match "{skillQuery}".
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ================= STEP 3 — INTERESTS ================= */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">What do you want to work on?</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Choose the kinds of projects you'd join or start.
                  <span className="ml-1 font-semibold text-slate-700">
                    {projectTypes.length} selected
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {PROJECT_TYPES.map((p) => {
                  const active = projectTypes.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => toggle(setProjectTypes, p)}
                      aria-pressed={active}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-all cursor-pointer ${
                        active
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-bold ${
                          active ? "border-white bg-white text-slate-900" : "border-slate-300"
                        }`}
                      >
                        {active ? "✓" : ""}
                      </span>
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= STEP 4 — COLLABORATION ================= */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">How do you want to collaborate?</h2>
                <p className="text-sm text-slate-500 mt-1">
                  This decides who we match you with.
                </p>
              </div>

              <div>
                <FieldLabel>City</FieldLabel>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Quezon City"
                  className={inputClass}
                />
              </div>

              <div>
                <FieldLabel>Preferred setup</FieldLabel>
                <div className="flex gap-3">
                  {SETUP_OPTIONS.map((opt) => (
                    <ChoiceCard
                      key={opt.id}
                      title={opt.id}
                      desc={opt.desc}
                      selected={setupPref === opt.id}
                      onClick={() => setSetupPref(opt.id)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel hint={`${hours}h / week`}>Availability</FieldLabel>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full accent-slate-800 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>1h</span>
                  <span>20h</span>
                  <span>40h</span>
                </div>
              </div>

              {/* Profile preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Profile Preview
                </p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500">
                    {((firstName[0] || "J") + (lastName[0] || "D")).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {[firstName, lastName].filter(Boolean).join(" ") || "Juan Dela Cruz"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {[role || "Student", affiliation, city].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  {bio || "Your bio will appear here..."}
                </p>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.slice(0, 5).map((s) => (
                      <Tag key={s} label={s} selected />
                    ))}
                    {selectedSkills.length > 5 && (
                      <span className="text-xs text-slate-400 flex items-center">
                        +{selectedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
                <p className="text-xs text-slate-500">
                  {[setupPref, `${hours}h/week`].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Navigation ---------------- */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            {!stepValid && (
              <span className="text-xs text-slate-400">
                {
                  [
                    "Fill in your name, contact details, role, and bio",
                    "Pick at least one skill",
                    "Pick at least one project type",
                    "City and setup required",
                  ][step]
                }
              </span>
            )}
            <button
              onClick={() => {
                if (isLast) onNavigate?.("discovery");
                else setStep((s) => Math.min(STEPS.length - 1, s + 1));
              }}
              disabled={!stepValid}
              className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLast ? "Complete Setup →" : "Continue →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
