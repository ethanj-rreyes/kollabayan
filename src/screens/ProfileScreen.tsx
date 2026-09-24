import { useState } from "react";
import type { ReactNode } from "react";
import Tag from "../components/Tag";
import ShippedBadgeCard from "../components/ShippedBadgeCard";
import AvatarPlaceholder from "../components/AvatarPlaceholder";
import Icon from "../components/Icon";
import { VerifiedDot } from "../components/VerifiedBadge";

/* ------------------------------------------------------------------ */
/*  Mock profile data — skills + project types use the shared taxonomy */
/* ------------------------------------------------------------------ */

const SKILLS = [
  "UI/UX Design",
  "Graphic Design",
  "Illustration",
  "Writing & Copywriting",
  "Social Media",
  "Survey Design",
  "Academic Research",
  "Project Management",
];

const OPEN_TO = ["Academic Projects", "Research Projects", "Startups"];

const DETAILS: { icon: "pin" | "calendar" | "clock"; value: string }[] = [
  { icon: "pin", value: "Manila, NCR" },
  { icon: "calendar", value: "Hybrid" },
  { icon: "clock", value: "12h / week" },
];
const SKILL_PREVIEW = 5;

const LINKS = [
  { label: "Portfolio", value: "behance.net/andreakalaw" },
  { label: "LinkedIn", value: "linkedin.com/in/andreakalaw" },
  { label: "Email", value: "andrea.kalaw@email.com" },
];

const SHIPPED = [
  {
    projectName: "AI Study Scheduler",
    role: "UI/UX Designer",
    teammates: [{ initials: "MR" }, { initials: "JT" }, { initials: "SP" }],
    outputUrl: "studysched.ph",
  },
  {
    projectName: "Local Ukay-Ukay Marketplace",
    role: "Brand Designer",
    teammates: [{ initials: "JT" }, { initials: "KL" }],
    outputUrl: "ukaynear.me",
  },
  {
    projectName: "Barangay Health Literacy Zine",
    role: "Illustrator & Layout",
    teammates: [{ initials: "BV" }, { initials: "RD" }, { initials: "NB" }, { initials: "CS" }],
    outputUrl: "issuu.com/healthzine-mnl",
  },
];

const ACTIVE = [
  { name: "Health Coaching Program", role: "Program Designer", done: 7, total: 12, due: "Oct 18" },
  { name: "Water Quality Study", role: "Research Writer", done: 3, total: 10, due: "Dec 2" },
];

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="bg-white border border-buhangin rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

export default function ProfileScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [openToInvites, setOpenToInvites] = useState(true);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [name, setName] = useState("Andrea Kalaw");
  const [school, setSchool] = useState("University of Santo Tomas");
  const [aspiration, setAspiration] = useState(
    "Designer who turns research into things people actually use. Happiest on crews that mix disciplines.",
  );

  return (
    <div className="min-h-full bg-layag pb-12">
      {/* Banner */}
      <div className="h-28 bg-dagat relative">
        <svg className="absolute bottom-0 left-0 w-full" height="30" viewBox="0 0 400 30" preserveAspectRatio="none">
          <path d="M0 15 C33 6 66 6 100 15 S166 24 200 15 S266 6 300 15 S366 24 400 15 V30 H0 Z" fill="#1E5B57" />
        </svg>
      </div>

      <div className="max-w-[1320px] mx-auto px-8 -mt-14 relative grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_300px] gap-6 items-start">
        {/* ============ LEFT — About (kept light) ============ */}
        <aside className="flex flex-col gap-4 order-2 xl:order-1">
          <Panel title="About">
            <ul className="flex flex-col gap-2.5">
              {DETAILS.map((d) => (
                <li key={d.value} className="flex items-center gap-2.5 text-sm text-tinta/80">
                  <Icon name={d.icon} size={15} className="text-lalim" />
                  {d.value}
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-buhangin flex flex-wrap gap-1.5">
              {OPEN_TO.map((t) => (
                <span key={t} className="text-[11px] font-semibold bg-lalim/10 text-lalim px-2.5 py-1 rounded-full">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.label === "Email" ? `mailto:${l.value}` : `https://${l.value}`}
                  target={l.label === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  title={`${l.label}: ${l.value}`}
                  aria-label={l.label}
                  className="w-8 h-8 rounded-full bg-layag text-dagat hover:bg-laot hover:text-layag flex items-center justify-center transition-colors"
                >
                  <Icon name={l.label === "Email" ? "mail" : "link"} size={14} />
                </a>
              ))}
            </div>
          </Panel>

          <Panel title="Skills">
            <div className="flex flex-wrap gap-1.5">
              {(showAllSkills ? SKILLS : SKILLS.slice(0, SKILL_PREVIEW)).map((sk) => (
                <Tag key={sk} label={sk} size="sm" selected />
              ))}
            </div>
            {SKILLS.length > SKILL_PREVIEW && (
              <button
                onClick={() => setShowAllSkills((v) => !v)}
                className="mt-3 text-xs font-semibold text-dagat hover:text-laot cursor-pointer"
              >
                {showAllSkills ? "Show less" : `+${SKILLS.length - SKILL_PREVIEW} more`}
              </button>
            )}
          </Panel>
        </aside>

        {/* ============ CENTER — Identity + Shipped ============ */}
        <main className="flex flex-col gap-6 order-1 xl:order-2 min-w-0">
          {/* Identity card */}
          <section className="bg-white border border-buhangin rounded-2xl p-7 shadow-[0_18px_40px_-28px_rgba(13,52,70,0.45)]">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-5 min-w-0">
                <div className="rounded-full p-1 bg-white shadow-[0_8px_20px_-10px_rgba(10,37,50,0.5)] -mt-1 shrink-0">
                  <AvatarPlaceholder size={88} initials="AK" />
                </div>
                <div className="flex flex-col gap-3 min-w-0">
                  {editing ? (
                    <div className="flex flex-col gap-2">
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="font-display text-3xl text-tinta border-b-2 border-buhangin focus:border-laot focus:outline-none bg-transparent w-72 transition-colors"
                      />
                      <input
                        value={school}
                        onChange={(e) => setSchool(e.target.value)}
                        className="text-sm text-tinta/60 border-b border-buhangin focus:border-laot focus:outline-none bg-transparent w-64 transition-colors"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="font-display text-3xl text-tinta">{name}</h1>
                      <p className="text-sm text-tinta/60 mt-1">{school}</p>
                    </div>
                  )}

                  {editing ? (
                    <textarea
                      value={aspiration}
                      onChange={(e) => setAspiration(e.target.value)}
                      rows={2}
                      className="text-[15px] text-tinta/80 border border-buhangin rounded-xl px-3 py-2 focus:border-laot focus:outline-none bg-transparent w-full max-w-lg resize-none transition-colors"
                    />
                  ) : (
                    <p className="text-[15px] text-tinta/80 max-w-lg leading-relaxed">{aspiration}</p>
                  )}

                  {/* Stats row */}
                  <div className="flex gap-8 pt-2">
                    {[
                      { label: "Projects shipped", value: String(SHIPPED.length) },
                      { label: "Crewmates", value: "9" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="font-display text-[28px] text-tinta leading-none">{stat.value}</p>
                        <p className="text-[10px] font-semibold text-lalim uppercase tracking-[0.16em] mt-1.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditing((e) => !e)}
                className={`px-5 py-2.5 text-sm font-semibold border rounded-full transition-colors cursor-pointer shrink-0 ${
                  editing
                    ? "bg-laot text-layag border-laot hover:bg-dagat"
                    : "bg-white text-tinta border-buhangin hover:border-lalim/50"
                }`}
              >
                {editing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </section>

          {/* Shipped projects */}
          <section>
            <div className="flex items-end justify-between mb-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lalim mb-2">Show</p>
                <h2 className="font-display text-4xl text-tinta">You shipped it. Show it.</h2>
                <p className="text-sm text-tinta/60 mt-2">Verified collaboration history</p>
              </div>
              <div className="flex items-center gap-2 bg-white border border-buhangin rounded-full pl-1.5 pr-3.5 py-1.5">
                <VerifiedDot size={18} />
                <span className="text-xs font-semibold text-tinta">{SHIPPED.length} verified</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SHIPPED.map((badge) => (
                <ShippedBadgeCard key={badge.projectName} {...badge} />
              ))}
              <div
                onClick={() => onNavigate?.("discovery")}
                className="border-2 border-dashed border-lalim/25 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center min-h-[220px] cursor-pointer hover:border-laot hover:bg-white transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-buhangin text-laot flex items-center justify-center">
                  <Icon name="plus" size={18} />
                </div>
                <p className="text-xs text-tinta/60 max-w-[160px]">Join a new Balangay to earn a badge</p>
              </div>
            </div>
          </section>
        </main>

        {/* ============ RIGHT — Activity ============ */}
        <aside className="flex flex-col gap-4 order-3">
          {/* Availability status — one of the 20% dark surfaces */}
          <section className="bg-dagat rounded-2xl p-5 text-layag">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-liwayway mb-1">Status</p>
                <p className="text-sm font-semibold">{openToInvites ? "Open to crew invites" : "Not taking invites"}</p>
              </div>
              <button
                role="switch"
                aria-checked={openToInvites}
                onClick={() => setOpenToInvites((v) => !v)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                  openToInvites ? "bg-laot" : "bg-layag/20"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-layag transition-transform ${openToInvites ? "translate-x-5" : ""}`}
                />
              </button>
            </div>
          </section>

          <Panel title="Currently rowing" action={<span className="text-[11px] font-semibold text-laot">{ACTIVE.length}</span>}>
            <ul className="flex flex-col gap-3.5">
              {ACTIVE.map((a) => {
                const pct = Math.round((a.done / a.total) * 100);
                return (
                  <li key={a.name}>
                    <button onClick={() => onNavigate?.("workspace")} className="w-full text-left group cursor-pointer">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="text-sm font-semibold text-tinta group-hover:text-laot truncate">{a.name}</p>
                        <span className="text-[11px] text-tinta/50 shrink-0">Due {a.due}</span>
                      </div>
                      <div className="mt-2 h-1.5 rounded-full bg-buhangin overflow-hidden">
                        <div className="h-full rounded-full bg-laot" style={{ width: `${pct}%` }} />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Panel>

        </aside>
      </div>
    </div>
  );
}
