import { useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import Tag from "../components/Tag";
import { SKILL_GROUPS, PROJECT_TYPES, COUNTRIES, PH_REGIONS } from "../data/taxonomy";
import Icon from "../components/Icon";
import AvatarPlaceholder from "../components/AvatarPlaceholder";
import BrandMark from "../components/BrandMark";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

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
      <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">
        {children}
      </label>
      {hint && <span className="text-xs text-tinta/50">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-buhangin rounded-xl px-4 py-3 text-sm text-tinta placeholder:text-tinta/35 focus:outline-none focus:border-laot focus:ring-4 focus:ring-laot/10 transition-colors";

type Opt = string | { value: string; label: string };

function SelectField({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Opt[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} appearance-none pr-10 cursor-pointer ${value ? "" : "text-tinta/40"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return (
            <option key={v} value={v} className="text-tinta">
              {l}
            </option>
          );
        })}
      </select>
      <Icon name="chevron-down" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-lalim pointer-events-none" />
    </div>
  );
}

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
      className={`flex-1 text-left rounded-xl border px-4 py-3.5 transition-all cursor-pointer ${
        selected
          ? "border-laot bg-laot text-layag shadow-[0_6px_16px_-8px_rgba(30,91,87,0.6)]"
          : "border-buhangin bg-white hover:border-lalim/50"
      }`}
    >
      <span className={`block text-sm font-semibold ${selected ? "text-layag" : "text-tinta"}`}>
        {title}
      </span>
      {desc && (
        <span className={`mt-0.5 block text-xs ${selected ? "text-layag/75" : "text-tinta/60"}`}>
          {desc}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

export default function OnboardingScreen({
  onNavigate,
  prefill = {},
}: {
  onNavigate?: (screen: string) => void;
  prefill?: { firstName?: string; lastName?: string; email?: string };
}) {
  const [step, setStep] = useState(0);

  // Step 1 — You
  const [firstName, setFirstName] = useState(prefill.firstName ?? "");
  const [lastName, setLastName] = useState(prefill.lastName ?? "");
  const [email, setEmail] = useState(prefill.email ?? "");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState<"" | "Student" | "Professional">("");
  const [affiliation, setAffiliation] = useState("");
  const [bio, setBio] = useState("");

  // Step 2 — Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Step 3 — Interests
  const [projectTypes, setProjectTypes] = useState<string[]>([]);

  // Step 4 — Collaboration
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const isPH = country === "Philippines";
  const regionCities = PH_REGIONS.find((r) => r.name === region)?.cities ?? [];
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
    country !== "" && (!isPH || region !== "") && city.trim().length > 0 && setupPref !== "",
  ][step];

  const isLast = step === STEPS.length - 1;

  return (
    <div className="min-h-full bg-layag flex flex-col items-center justify-start py-12 px-6">
      {/* Brand intro */}
      <div className="w-full max-w-xl mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-dagat flex items-center justify-center shrink-0">
          <BrandMark size={34} tone="light" />
        </div>
        <div>
          <p className="font-display text-2xl text-tinta">You're not alone in the Balangay.</p>
          <p className="text-sm text-tinta/60 mt-0.5">Four quick steps before you come aboard.</p>
        </div>
      </div>
      <div className="w-full max-w-xl bg-white border border-buhangin rounded-2xl shadow-[0_18px_40px_-24px_rgba(13,52,70,0.35)] overflow-hidden">
        {/* ---------------- Step indicator ---------------- */}
        <div className="border-b border-buhangin px-8 pt-6 pb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-xs font-semibold text-tinta">{STEPS[step]}</span>
          </div>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-laot" : "bg-buhangin"
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
                <h2 className="font-display text-[28px] text-tinta">Let's start with you.</h2>
                <p className="text-sm text-tinta/65 mt-1.5">
                  This is what your future crew sees first.
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
                    email.length > 0 && !emailValid ? "border-sabit/60 focus:border-sabit focus:ring-sabit/10" : ""
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
                      ? "border-sabit/60 focus:border-sabit focus:ring-sabit/10"
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
                    title="Professional"
                    desc="Employed, freelance, or running something"
                    selected={role === "Professional"}
                    onClick={() => setRole("Professional")}
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
                <p className="text-xs text-tinta/50 mt-2">
                  Example: "Marketing student who loves turning messy ideas into campaigns."
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 2 — SKILLS ================= */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="font-display text-[28px] text-tinta">What do you bring to the Balangay?</h2>
                <p className="text-sm text-tinta/65 mt-1.5">
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
                <span className="shrink-0 text-xs font-semibold text-laot tabular-nums">
                  {selectedSkills.length} selected
                </span>
              </div>

              {selectedSkills.length > 0 && (
                <div className="rounded-xl bg-buhangin/60 p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">
                      Your picks
                    </span>
                    <button
                      onClick={() => setSelectedSkills([])}
                      className="text-xs font-semibold text-dagat hover:text-laot cursor-pointer"
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
                      className="rounded-xl border border-buhangin overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCategory((c) => (c === group.category ? null : group.category))
                        }
                        aria-expanded={isOpen}
                        className={`flex w-full items-center justify-between px-4 py-3 text-left transition-colors cursor-pointer ${
                          isOpen ? "bg-layag" : "bg-white hover:bg-layag"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-tinta">
                            {group.category}
                          </span>
                          {picked > 0 && (
                            <span className="rounded-full bg-laot px-2 py-0.5 text-[10px] font-semibold text-layag tabular-nums">
                              {picked}
                            </span>
                          )}
                        </span>
                        <Icon
                          name="chevron-down"
                          size={16}
                          className={`text-lalim transition-transform ${isOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {isOpen && (
                        <div className="flex flex-wrap gap-2 border-t border-buhangin bg-layag/50 px-4 py-3.5">
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
                  <p className="text-sm text-tinta/50 py-6 text-center">
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
                <h2 className="font-display text-[28px] text-tinta">Where do you want to row?</h2>
                <p className="text-sm text-tinta/65 mt-1.5">
                  Choose the kinds of projects you'd join or start.
                  <span className="ml-1 font-semibold text-laot">
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
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-semibold transition-all cursor-pointer ${
                        active
                          ? "border-laot bg-laot text-layag"
                          : "border-buhangin bg-white text-tinta hover:border-lalim/50"
                      }`}
                    >
                      <span
                        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border ${
                          active ? "border-layag bg-layag text-laot" : "border-buhangin"
                        }`}
                      >
                        {active && <Icon name="check" size={12} strokeWidth={2.6} />}
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
                <h2 className="font-display text-[28px] text-tinta">How do you want to row?</h2>
                <p className="text-sm text-tinta/65 mt-1.5">
                  This decides who we match you with.
                </p>
              </div>

              {/* Location: Country → (PH only) Region → City */}
              <div>
                <FieldLabel>Country</FieldLabel>
                <SelectField
                  value={country}
                  onChange={(v) => {
                    setCountry(v);
                    setRegion("");
                    setCity("");
                  }}
                  placeholder="Select your country"
                  options={COUNTRIES}
                />
              </div>

              {isPH && (
                <div>
                  <FieldLabel>Region</FieldLabel>
                  <SelectField
                    value={region}
                    onChange={(v) => {
                      setRegion(v);
                      setCity("");
                    }}
                    placeholder="Select your region"
                    options={PH_REGIONS.map((r) => ({ value: r.name, label: `${r.name} (${r.short})` }))}
                  />
                </div>
              )}

              {country !== "" && (!isPH || region !== "") && (
                <div>
                  <FieldLabel hint={isPH ? `${regionCities.length} cities in this region` : undefined}>City</FieldLabel>
                  {isPH ? (
                    <SelectField value={city} onChange={setCity} placeholder="Select your city" options={regionCities} />
                  ) : (
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Your city"
                      className={inputClass}
                    />
                  )}
                </div>
              )}

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
                  className="w-full accent-[#1E5B57] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-tinta/45 mt-1">
                  <span>1h</span>
                  <span>20h</span>
                  <span>40h</span>
                </div>
              </div>

              {/* Profile preview */}
              <div className="p-5 bg-buhangin/60 rounded-2xl flex flex-col gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">
                  Profile Preview
                </p>
                <div className="flex items-center gap-2.5">
                  <AvatarPlaceholder
                    size={40}
                    initials={((firstName[0] || "J") + (lastName[0] || "D")).toUpperCase()}
                  />
                  <div>
                    <p className="text-sm font-semibold text-tinta">
                      {[firstName, lastName].filter(Boolean).join(" ") || "Juan Dela Cruz"}
                    </p>
                    <p className="text-xs text-tinta/60">
                      {[role || "Student", affiliation, [city, isPH ? "" : country].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-tinta/75">
                  {bio || "Your bio will appear here..."}
                </p>
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.slice(0, 5).map((s) => (
                      <Tag key={s} label={s} selected />
                    ))}
                    {selectedSkills.length > 5 && (
                      <span className="text-xs text-tinta/50 flex items-center">
                        +{selectedSkills.length - 5} more
                      </span>
                    )}
                  </div>
                )}
                <p className="text-xs font-semibold text-lalim">
                  {[setupPref, `${hours}h/week`].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------------- Navigation ---------------- */}
        <div className="px-8 py-5 border-t border-buhangin bg-layag/60 flex items-center justify-between">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-dagat hover:text-laot transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Icon name="arrow-left" size={16} /> Back
          </button>

          <div className="flex items-center gap-4">
            {!stepValid && (
              <span className="text-xs text-tinta/50">
                {
                  [
                    "Fill in your name, contact details, role, and bio",
                    "Pick at least one skill",
                    "Pick at least one project type",
                    isPH && !region ? "Pick your region, city, and setup" : "Country, city, and setup required",
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
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-laot text-layag text-sm font-semibold rounded-full hover:bg-dagat transition-colors cursor-pointer disabled:bg-buhangin disabled:text-tinta/40 disabled:cursor-not-allowed"
            >
              {isLast ? "Let's row, team." : "Continue"}
              <Icon name="arrow-right" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
