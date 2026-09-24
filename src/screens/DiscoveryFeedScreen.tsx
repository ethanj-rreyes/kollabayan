import { useMemo, useState } from "react";
import CollabPostCard, { COMMITMENT_STYLE } from "../components/CollabPostCard";
import Tag from "../components/Tag";
import Icon from "../components/Icon";
import AvatarPlaceholder from "../components/AvatarPlaceholder";
import { VerifiedDot } from "../components/VerifiedBadge";
import Sheet, { fieldInput, fieldLabel, primaryBtn, ghostBtn } from "../components/Sheet";
import { SKILL_GROUPS, PROJECT_TYPES } from "../data/taxonomy";

const TIMELINE_FILTERS = ["< 1 month", "1–3 months", "3–6 months", "6+ months"];

type Post = {
  id: number;
  title: string;
  description: string;
  rolesNeeded: string[];
  skills: string[]; // from the shared skill taxonomy
  projectType: string; // from PROJECT_TYPES
  timeline: string;
  timelineBucket: string; // from TIMELINE_FILTERS
  commitment: "Passion" | "Equity" | "Paid";
  vibeTags: string[];
  author: string;
  authorInitials: string;
  school: string;
};

const POSTS: Post[] = [
  {
    id: 1,
    title: "AI-powered study scheduler for college students",
    description: "A smart scheduling tool that adapts to your syllabus and learning pace. We have the ML backbone — need design, research, and marketing to make it usable and get it into students' hands.",
    rolesNeeded: ["UI/UX Designer", "UX Researcher", "Marketing Lead"],
    skills: ["UI/UX Design", "AI & Machine Learning", "Survey Design", "Marketing"],
    projectType: "Startups",
    timeline: "2–3 months",
    timelineBucket: "1–3 months",
    commitment: "Passion",
    vibeTags: ["Late Nights OK", "Async-First", "Ship Fast"],
    author: "Mika Ramos",
    authorInitials: "MR",
    school: "Ateneo de Manila",
  },
  {
    id: 2,
    title: "Water quality study of Laguna de Bay tributaries",
    description: "Thesis-grade research sampling six tributaries over one semester. Looking for teammates to run lab tests, handle statistics, and help write the paper for a regional science congress.",
    rolesNeeded: ["Lab Assistant", "Statistician", "Research Writer"],
    skills: ["Laboratory Work", "Statistics", "Scientific Writing", "Environmental Science", "Data Gathering"],
    projectType: "Research Projects",
    timeline: "4–5 months",
    timelineBucket: "3–6 months",
    commitment: "Passion",
    vibeTags: ["Field Work", "Weekend Sampling", "Publishable"],
    author: "Sam Pascual",
    authorInitials: "SP",
    school: "UP Los Baños",
  },
  {
    id: 3,
    title: "Marketplace for local ukay-ukay sellers",
    description: "Like Carousell but hyper-local — connecting ukay and thrift sellers with buyers within 10 km. MVP target: 50 sellers in 60 days.",
    rolesNeeded: ["Operations Lead", "Social Media Manager", "Brand Designer"],
    skills: ["Operations", "Social Media", "Graphic Design", "Sales", "Entrepreneurship"],
    projectType: "Businesses",
    timeline: "6–8 weeks",
    timelineBucket: "1–3 months",
    commitment: "Equity",
    vibeTags: ["Structured Standups", "Equity Split", "IRL-Friendly"],
    author: "Jolo Tan",
    authorInitials: "JT",
    school: "De La Salle University",
  },
  {
    id: 4,
    title: "Short documentary for a national film competition",
    description: "A 12-minute documentary on Manila's last traditional sign painters. Script is done; we need a crew to shoot, edit, and score it before the submission deadline.",
    rolesNeeded: ["Videographer", "Video Editor", "Sound Designer"],
    skills: ["Videography", "Video Editing", "Music & Audio", "Storytelling"],
    projectType: "Competitions",
    timeline: "3 weeks",
    timelineBucket: "< 1 month",
    commitment: "Passion",
    vibeTags: ["Tight Deadline", "On Location", "Creative Freedom"],
    author: "Bea Villanueva",
    authorInitials: "BV",
    school: "UST",
  },
  {
    id: 5,
    title: "Health coaching program for first-gen college students",
    description: "Culturally aware wellness and nutrition coaching, delivered through campus orgs. Seed funding pending — paid roles open if we close the round.",
    rolesNeeded: ["Program Coordinator", "Peer Counselor", "Fundraising Lead"],
    skills: ["Counseling & Guidance", "Community Organizing", "Fundraising", "Project Management"],
    projectType: "Startups",
    timeline: "4–6 months",
    timelineBucket: "3–6 months",
    commitment: "Paid",
    vibeTags: ["Mission-Driven", "User Interviews", "Paid"],
    author: "Andrea Kalaw",
    authorInitials: "AK",
    school: "UST",
  },
  {
    id: 6,
    title: "Solar-powered drying rack for small farms",
    description: "Class capstone turned spinoff: a low-cost crop dryer built from local materials. Need help with CAD, fabrication, and a pilot with two farming co-ops in Tarlac.",
    rolesNeeded: ["CAD Designer", "Fabricator", "Field Coordinator"],
    skills: ["CAD & Drafting", "Fabrication", "Prototyping", "Agriculture", "Logistics"],
    projectType: "Spinoffs",
    timeline: "6+ months",
    timelineBucket: "6+ months",
    commitment: "Equity",
    vibeTags: ["Hands-On", "Provincial Pilot", "Hardware"],
    author: "Rafa Dizon",
    authorInitials: "RD",
    school: "Mapúa University",
  },
];

/* Checkbox + radio rows used by the non-skill filters */
function CheckRow({ label, on, onClick, radio = false }: { label: string; on: boolean; onClick: () => void; radio?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2.5 cursor-pointer group text-left">
      <span
        className={`w-[18px] h-[18px] border transition-colors flex items-center justify-center shrink-0 ${
          radio ? "rounded-full" : "rounded-md"
        } ${on ? (radio ? "border-laot" : "bg-laot border-laot") : "border-buhangin group-hover:border-lalim"}`}
      >
        {on && (radio ? <span className="w-2 h-2 rounded-full bg-laot" /> : <Icon name="check" size={11} strokeWidth={2.8} className="text-layag" />)}
      </span>
      <span className="text-sm text-tinta/75 group-hover:text-tinta transition-colors">{label}</span>
    </button>
  );
}

function FilterHeading({ children, count }: { children: string; count?: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">{children}</p>
      {count ? <span className="text-[11px] font-semibold text-laot tabular-nums">{count} selected</span> : null}
    </div>
  );
}

export default function DiscoveryFeedScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [projectTypes, setProjectTypes] = useState<string[]>([]);
  const [commitment, setCommitment] = useState<string>("All");
  const [selectedTimelines, setSelectedTimelines] = useState<string[]>([]);
  const [posts, setPosts] = useState<Post[]>(POSTS);
  const [applied, setApplied] = useState<number[]>([]);
  const [mine, setMine] = useState<number[]>([]);
  const [postOpen, setPostOpen] = useState(false);
  const [np, setNp] = useState({
    title: "",
    description: "",
    roles: "",
    skills: [] as string[],
    projectType: PROJECT_TYPES[0],
    timelineBucket: TIMELINE_FILTERS[1],
    commitment: "Passion" as Post["commitment"],
  });
  const [npSkillQuery, setNpSkillQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPost, setDrawerPost] = useState<Post | null>(null);
  const [drawerRole, setDrawerRole] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleIn = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  /* --- Skills search (same behaviour as Onboarding) --------------- */
  const searching = skillQuery.trim().length > 0;
  const filteredGroups = useMemo(() => {
    const q = skillQuery.trim().toLowerCase();
    if (!q) return SKILL_GROUPS;
    return SKILL_GROUPS.map((g) => ({ ...g, skills: g.skills.filter((sk) => sk.toLowerCase().includes(q)) })).filter(
      (g) => g.skills.length > 0,
    );
  }, [skillQuery]);
  const countIn = (skills: string[]) => skills.filter((sk) => selectedSkills.includes(sk)).length;

  /* --- Apply filters ------------------------------------------------ */
  const results = posts.filter(
    (p) =>
      (selectedSkills.length === 0 || p.skills.some((sk) => selectedSkills.includes(sk))) &&
      (projectTypes.length === 0 || projectTypes.includes(p.projectType)) &&
      (commitment === "All" || p.commitment === commitment) &&
      (selectedTimelines.length === 0 || selectedTimelines.includes(p.timelineBucket)),
  );

  const anyFilter =
    selectedSkills.length > 0 || projectTypes.length > 0 || commitment !== "All" || selectedTimelines.length > 0;
  const clearAll = () => {
    setSelectedSkills([]);
    setSkillQuery("");
    setProjectTypes([]);
    setCommitment("All");
    setSelectedTimelines([]);
  };

  const npValid = np.title.trim() && np.description.trim() && np.roles.trim() && np.skills.length > 0;
  const npSkillMatches = npSkillQuery.trim()
    ? SKILL_GROUPS.flatMap((g) => g.skills).filter(
        (sk) => sk.toLowerCase().includes(npSkillQuery.trim().toLowerCase()) && !np.skills.includes(sk),
      ).slice(0, 8)
    : [];

  const publishPost = () => {
    if (!npValid) return;
    const id = Math.max(...posts.map((p) => p.id)) + 1;
    const created: Post = {
      id,
      title: np.title.trim(),
      description: np.description.trim(),
      rolesNeeded: np.roles.split(",").map((r) => r.trim()).filter(Boolean),
      skills: np.skills,
      projectType: np.projectType,
      timeline: np.timelineBucket,
      timelineBucket: np.timelineBucket,
      commitment: np.commitment,
      vibeTags: ["New"],
      author: "Andrea Kalaw",
      authorInitials: "AK",
      school: "UST",
    };
    setPosts((p) => [created, ...p]);
    setMine((m) => [...m, id]);
    setPostOpen(false);
    setNp({ title: "", description: "", roles: "", skills: [], projectType: PROJECT_TYPES[0], timelineBucket: TIMELINE_FILTERS[1], commitment: "Passion" });
    setNpSkillQuery("");
    clearAll();
  };

  const openDrawer = (post: Post) => {
    setDrawerPost(post);
    setDrawerRole(post.rolesNeeded[0]);
    setSubmitted(false);
    setDrawerOpen(true);
  };

  return (
    <div className="h-full flex relative overflow-hidden bg-layag">
      {/* LEFT SIDEBAR — Filters */}
      <aside className="w-[320px] shrink-0 border-r border-buhangin bg-white overflow-y-auto p-6 flex flex-col gap-7">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-tinta">Filters</h2>
          {anyFilter && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-semibold text-dagat hover:text-laot transition-colors cursor-pointer"
            >
              <Icon name="close" size={12} /> Clear all
            </button>
          )}
        </div>

        {/* Skills Needed — same taxonomy + interaction as Onboarding */}
        <div>
          <FilterHeading count={selectedSkills.length}>Skills Needed</FilterHeading>
          <div className="relative mb-3">
            <Icon name="search" size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tinta/40" />
            <input
              type="text"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full bg-white border border-buhangin rounded-xl pl-10 pr-3 py-2.5 text-sm text-tinta placeholder:text-tinta/35 focus:outline-none focus:border-laot focus:ring-4 focus:ring-laot/10 transition-colors"
            />
          </div>

          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedSkills.map((sk) => (
                <Tag key={sk} label={`${sk}  ×`} size="sm" selected onClick={() => toggleIn(selectedSkills, setSelectedSkills, sk)} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            {filteredGroups.map((group) => {
              const isOpen = searching || openCategory === group.category;
              const picked = countIn(group.skills);
              return (
                <div key={group.category} className="rounded-xl border border-buhangin overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setOpenCategory((c) => (c === group.category ? null : group.category))}
                    aria-expanded={isOpen}
                    className={`flex w-full items-center justify-between px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                      isOpen ? "bg-layag" : "bg-white hover:bg-layag"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className="text-[13px] font-semibold text-tinta truncate">{group.category}</span>
                      {picked > 0 && (
                        <span className="rounded-full bg-laot px-1.5 py-0.5 text-[10px] font-semibold text-layag tabular-nums">{picked}</span>
                      )}
                    </span>
                    <Icon name="chevron-down" size={15} className={`text-lalim transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="flex flex-wrap gap-1.5 border-t border-buhangin bg-layag/50 px-3.5 py-3">
                      {group.skills.map((sk) => (
                        <Tag
                          key={sk}
                          label={sk}
                          size="sm"
                          selected={selectedSkills.includes(sk)}
                          onClick={() => toggleIn(selectedSkills, setSelectedSkills, sk)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {filteredGroups.length === 0 && (
              <p className="text-sm text-tinta/50 py-4 text-center">No skills match "{skillQuery}".</p>
            )}
          </div>
        </div>

        {/* Project Type — same options as Onboarding */}
        <div>
          <FilterHeading count={projectTypes.length}>Project Type</FilterHeading>
          <div className="flex flex-col gap-2">
            {PROJECT_TYPES.map((t) => (
              <CheckRow key={t} label={t} on={projectTypes.includes(t)} onClick={() => toggleIn(projectTypes, setProjectTypes, t)} />
            ))}
          </div>
        </div>

        {/* Commitment Level */}
        <div>
          <FilterHeading>Commitment Level</FilterHeading>
          <div className="flex flex-col gap-2">
            {["All", "Passion", "Equity", "Paid"].map((c) => (
              <CheckRow key={c} label={c} radio on={commitment === c} onClick={() => setCommitment(c)} />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <FilterHeading count={selectedTimelines.length}>Expected Timeline</FilterHeading>
          <div className="flex flex-col gap-2">
            {TIMELINE_FILTERS.map((t) => (
              <CheckRow key={t} label={t} on={selectedTimelines.includes(t)} onClick={() => toggleIn(selectedTimelines, setSelectedTimelines, t)} />
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN FEED */}
      <main className="flex-1 overflow-y-auto px-8 py-7">
        <div className="w-full">
          {/* Feed header */}
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lalim mb-2">Find</p>
              <h1 className="font-display text-4xl text-tinta">Find the right crew.</h1>
              <p className="text-sm text-tinta/60 mt-2">
                {results.length} {results.length === 1 ? "Balangay" : "Balangays"} looking for crew
                {anyFilter && <span className="text-tinta/45"> · filtered from {posts.length}</span>}
              </p>
            </div>
            <button
              onClick={() => setPostOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 bg-white border border-buhangin rounded-full text-tinta hover:border-lalim/50 transition-colors cursor-pointer"
            >
              <Icon name="plus" size={15} className="text-laot" /> Post a Project
            </button>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4">
            {results.map((post) => (
              <CollabPostCard
                key={post.id}
                {...post}
                applied={applied.includes(post.id)}
                mine={mine.includes(post.id)}
                onInterested={() => openDrawer(post)}
              />
            ))}
            {results.length === 0 && (
              <div className="border-2 border-dashed border-lalim/25 rounded-2xl py-14 flex flex-col items-center gap-3 text-center">
                <p className="font-display text-2xl text-tinta">No Balangays match yet.</p>
                <p className="text-sm text-tinta/60 max-w-xs">Try fewer skills or a different project type.</p>
                <button
                  onClick={clearAll}
                  className="text-sm font-semibold text-layag bg-laot px-5 py-2.5 rounded-full hover:bg-dagat transition-colors cursor-pointer mt-1"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* APPLICATION DRAWER — Screen 4 */}
      {drawerOpen && drawerPost && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-tinta/40 backdrop-blur-[2px] z-10"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white z-20 flex flex-col shadow-[-24px_0_48px_-24px_rgba(10,37,50,0.4)]">
            {/* Drawer header */}
            <div className="px-6 py-6 bg-dagat flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-liwayway mb-2">Join the Balangay</p>
                <h3 className="font-display text-2xl text-layag leading-tight">{drawerPost.title}</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-layag/60 hover:text-layag transition-colors mt-1 cursor-pointer"
                aria-label="Close"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
              {!submitted ? (
                <>
                  {/* Project meta recap */}
                  <div className="p-4 bg-layag border border-buhangin rounded-xl flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <AvatarPlaceholder size={22} initials={drawerPost.authorInitials} />
                      <span className="text-xs text-tinta/75">{drawerPost.author} · {drawerPost.school}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-tinta/65">
                      <Icon name="clock" size={14} className="text-lalim" /> {drawerPost.timeline}
                      <span className={`ml-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${COMMITMENT_STYLE[drawerPost.commitment]}`}>{drawerPost.commitment}</span>
                    </div>
                  </div>

                  {/* Role selector */}
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim mb-2 block">
                      Target Role
                    </label>
                    <select
                      value={drawerRole}
                      onChange={(e) => setDrawerRole(e.target.value)}
                      className="w-full border border-buhangin rounded-xl px-4 py-3 text-sm text-tinta focus:outline-none focus:border-laot focus:ring-4 focus:ring-laot/10 transition-colors bg-white cursor-pointer"
                    >
                      {drawerPost.rolesNeeded.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <p className="text-xs text-tinta/50 mt-2">
                      Your profile and skills are shared automatically. No cover letter required.
                    </p>
                  </div>

                  {/* Availability note */}
                  <div className="p-3.5 rounded-xl text-xs text-tinta/75 bg-buhangin/60">
                    <span className="font-semibold text-tinta">Your availability:</span> 12h/week
                    <span className="text-tinta/50"> · Set in onboarding</span>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(true);
                        setApplied((a) => [...a, drawerPost.id]);
                      }}
                      className="w-full py-3.5 bg-laot text-layag text-sm font-semibold rounded-full hover:bg-dagat transition-colors cursor-pointer"
                    >
                      Submit application
                    </button>
                    <p className="text-xs text-center text-tinta/50">
                      No cold DMs. They'll reach out if it's a fit.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12">
                  <VerifiedDot size={56} />
                  <div>
                    <h4 className="font-display text-2xl text-tinta">Request sent.</h4>
                    <p className="text-sm text-tinta/65 mt-2 max-w-[260px] mx-auto">
                      {drawerPost.author} will reach out if <strong>{drawerRole}</strong> is a match.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onNavigate?.("workspace");
                    }}
                    className="text-sm font-semibold text-layag bg-laot px-5 py-2.5 rounded-full hover:bg-dagat transition-colors cursor-pointer mt-2"
                  >
                    Go to Workspace
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="text-xs font-semibold text-dagat hover:text-laot transition-colors cursor-pointer mt-1"
                  >
                    Back to feed
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {/* POST A PROJECT */}
      <Sheet
        open={postOpen}
        onClose={() => setPostOpen(false)}
        eyebrow="Build"
        title="Launch a Balangay"
        width={460}
        footer={
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-tinta/50">{npValid ? "Ready to post" : "Title, description, roles, and one skill"}</span>
            <div className="flex gap-2">
              <button onClick={() => setPostOpen(false)} className={ghostBtn}>Cancel</button>
              <button onClick={publishPost} disabled={!npValid} className={primaryBtn}>
                Post project
              </button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div>
            <label className={fieldLabel}>Project title</label>
            <input value={np.title} onChange={(e) => setNp({ ...np, title: e.target.value })} placeholder="Community mural for a barangay hall" className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Description</label>
            <textarea
              value={np.description}
              onChange={(e) => setNp({ ...np, description: e.target.value.slice(0, 280) })}
              rows={3}
              placeholder="What are you making, and what does done look like?"
              className={`${fieldInput} resize-none`}
            />
            <p className="text-xs text-tinta/45 mt-1 text-right">{np.description.length}/280</p>
          </div>
          <div>
            <label className={fieldLabel}>Crew needed</label>
            <input value={np.roles} onChange={(e) => setNp({ ...np, roles: e.target.value })} placeholder="Muralist, Project Manager, Fundraiser" className={fieldInput} />
            <p className="text-xs text-tinta/45 mt-1">Separate roles with commas.</p>
          </div>
          <div>
            <label className={fieldLabel}>Skills needed</label>
            {np.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {np.skills.map((sk) => (
                  <Tag key={sk} label={`${sk}  ×`} size="sm" selected onClick={() => setNp({ ...np, skills: np.skills.filter((x) => x !== sk) })} />
                ))}
              </div>
            )}
            <input value={npSkillQuery} onChange={(e) => setNpSkillQuery(e.target.value)} placeholder="Search skills..." className={fieldInput} />
            {npSkillMatches.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {npSkillMatches.map((sk) => (
                  <Tag
                    key={sk}
                    label={`+ ${sk}`}
                    size="sm"
                    onClick={() => {
                      setNp({ ...np, skills: [...np.skills, sk] });
                      setNpSkillQuery("");
                    }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={fieldLabel}>Project type</label>
              <select value={np.projectType} onChange={(e) => setNp({ ...np, projectType: e.target.value })} className={`${fieldInput} cursor-pointer`}>
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={fieldLabel}>Timeline</label>
              <select value={np.timelineBucket} onChange={(e) => setNp({ ...np, timelineBucket: e.target.value })} className={`${fieldInput} cursor-pointer`}>
                {TIMELINE_FILTERS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Commitment</label>
            <div className="flex gap-2">
              {(["Passion", "Equity", "Paid"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNp({ ...np, commitment: c })}
                  aria-pressed={np.commitment === c}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                    np.commitment === c ? "border-laot bg-laot text-layag" : "border-buhangin bg-white text-tinta hover:border-lalim/50"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
