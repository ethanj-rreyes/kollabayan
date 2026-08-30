import { useState } from "react";
import CollabPostCard from "../components/CollabPostCard";

const SKILL_FILTERS = ["React", "Python", "UI/UX Design", "Machine Learning", "iOS Dev", "Data Analysis", "Node.js", "DevOps"];
const TIMELINE_FILTERS = ["< 1 month", "1–3 months", "3–6 months", "6+ months"];

const POSTS = [
  {
    id: 1,
    title: "AI-powered study scheduler for college students",
    description: "Building a smart scheduling tool that adapts to your syllabus and learning pace. We have the ML backbone — need frontend and design to make it usable.",
    rolesNeeded: ["React Developer", "UI/UX Designer", "ML Engineer"],
    timeline: "2–3 months",
    commitment: "Passion" as const,
    vibeTags: ["Late Nights OK", "Async-First", "Ship Fast"],
    author: "Maya Rosenberg",
    authorInitials: "MR",
    school: "Stanford",
  },
  {
    id: 2,
    title: "Marketplace for local vintage sellers",
    description: "Think Depop but hyper-local — connecting vintage and thrift sellers with buyers within 15 miles. MVP target: 50 sellers in 60 days.",
    rolesNeeded: ["Full-Stack Dev", "Marketing Lead", "Brand Designer"],
    timeline: "6–8 weeks",
    commitment: "Equity" as const,
    vibeTags: ["Structured Standups", "Equity Split", "IRL-Friendly"],
    author: "Jordan Tate",
    authorInitials: "JT",
    school: "NYU",
  },
  {
    id: 3,
    title: "Open-source analytics SDK for indie devs",
    description: "Privacy-first, lightweight alternative to Mixpanel. Apache 2.0 licensed. Looking for backend engineers who care about clean APIs.",
    rolesNeeded: ["Backend Engineer", "DevOps", "Technical Writer"],
    timeline: "3–4 months",
    commitment: "Passion" as const,
    vibeTags: ["Open Source", "Documentation-First", "No PM Overhead"],
    author: "Sione Palu",
    authorInitials: "SP",
    school: "Georgia Tech",
  },
  {
    id: 4,
    title: "Health coaching app for first-gen college students",
    description: "Culturally aware mental health + nutrition coaching platform. Seed funding pending. Paying roles available if we close the round.",
    rolesNeeded: ["React Native Dev", "Product Manager", "UX Researcher"],
    timeline: "4–6 months",
    commitment: "Paid" as const,
    vibeTags: ["Mission-Driven", "User Interviews", "Paid"],
    author: "Arjun Kapoor",
    authorInitials: "AK",
    school: "Michigan",
  },
];

export default function DiscoveryFeedScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [commitment, setCommitment] = useState<string>("All");
  const [selectedTimelines, setSelectedTimelines] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPost, setDrawerPost] = useState<typeof POSTS[0] | null>(null);
  const [drawerRole, setDrawerRole] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleSkill = (s: string) =>
    setSelectedSkills((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  const toggleTimeline = (t: string) =>
    setSelectedTimelines((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const openDrawer = (post: typeof POSTS[0]) => {
    setDrawerPost(post);
    setDrawerRole(post.rolesNeeded[0]);
    setSubmitted(false);
    setDrawerOpen(true);
  };

  return (
    <div className="h-full flex relative overflow-hidden bg-slate-50">
      {/* LEFT SIDEBAR — Filters */}
      <aside className="w-[280px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto p-6 flex flex-col gap-7">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Filters</h2>

          {/* Skills Needed */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Skills Needed</p>
            <div className="flex flex-col gap-2">
              {SKILL_FILTERS.map((s) => (
                <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleSkill(s)}
                    className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 ${
                      selectedSkills.includes(s)
                        ? "bg-slate-800 border-slate-800"
                        : "border-slate-300 group-hover:border-slate-500"
                    }`}
                  >
                    {selectedSkills.includes(s) && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => toggleSkill(s)}
                    className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors"
                  >
                    {s}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Commitment Level */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Commitment Level</p>
            <div className="flex flex-col gap-2">
              {["All", "Passion", "Equity", "Paid"].map((c) => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => setCommitment(c)}
                    className={`w-4 h-4 rounded-full border transition-colors flex items-center justify-center shrink-0 ${
                      commitment === c
                        ? "border-slate-800"
                        : "border-slate-300 group-hover:border-slate-500"
                    }`}
                  >
                    {commitment === c && <div className="w-2 h-2 rounded-full bg-slate-800" />}
                  </div>
                  <span
                    onClick={() => setCommitment(c)}
                    className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors"
                  >
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Expected Timeline</p>
            <div className="flex flex-col gap-2">
              {TIMELINE_FILTERS.map((t) => (
                <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    onClick={() => toggleTimeline(t)}
                    className={`w-4 h-4 rounded border transition-colors flex items-center justify-center shrink-0 ${
                      selectedTimelines.includes(t)
                        ? "bg-slate-800 border-slate-800"
                        : "border-slate-300 group-hover:border-slate-500"
                    }`}
                  >
                    {selectedTimelines.includes(t) && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span
                    onClick={() => toggleTimeline(t)}
                    className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors"
                  >
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active filters pill */}
        {(selectedSkills.length > 0 || commitment !== "All" || selectedTimelines.length > 0) && (
          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setSelectedSkills([]);
                setCommitment("All");
                setSelectedTimelines([]);
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ✕ Clear all filters
            </button>
          </div>
        )}
      </aside>

      {/* MAIN FEED */}
      <main className="flex-1 overflow-y-auto px-8 py-7">
        <div className="w-full">
          {/* Feed header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-slate-900">Open KollaBayans</h1>
              <p className="text-sm text-slate-500 mt-0.5">{POSTS.length} projects looking for collaborators</p>
            </div>
            <button
              onClick={() => openDrawer(POSTS[0])}
              className="text-xs font-semibold px-3 py-2 border border-slate-200 rounded text-slate-600 hover:border-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
            >
              + Post a Project
            </button>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4">
            {POSTS.map((post) => (
              <CollabPostCard
                key={post.id}
                {...post}
                onInterested={() => openDrawer(post)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* APPLICATION DRAWER — Screen 4 */}
      {drawerOpen && drawerPost && (
        <>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/30 z-10"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-[380px] bg-white border-l border-slate-200 z-20 flex flex-col shadow-xl">
            {/* Drawer header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Apply to</p>
                <h3 className="text-base font-bold text-slate-900 leading-snug">{drawerPost.title}</h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors mt-1 cursor-pointer text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Drawer content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
              {!submitted ? (
                <>
                  {/* Project meta recap */}
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500">
                        {drawerPost.authorInitials}
                      </div>
                      <span className="text-xs text-slate-600">{drawerPost.author} · {drawerPost.school}</span>
                    </div>
                    <p className="text-xs text-slate-500">⏱ {drawerPost.timeline} · {drawerPost.commitment}</p>
                  </div>

                  {/* Role selector */}
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
                      Target Role
                    </label>
                    <select
                      value={drawerRole}
                      onChange={(e) => setDrawerRole(e.target.value)}
                      className="w-full border border-slate-200 rounded px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-500 transition-colors bg-white cursor-pointer"
                    >
                      {drawerPost.rolesNeeded.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-2">
                      Your profile and skills are shared automatically. No cover letter required.
                    </p>
                  </div>

                  {/* Availability note */}
                  <div className="p-3 border border-slate-200 rounded text-xs text-slate-600 bg-white">
                    <span className="font-semibold text-slate-800">Your availability:</span> 12h/week
                    <span className="text-slate-400"> · Set in onboarding</span>
                  </div>

                  {/* Submit */}
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => setSubmitted(true)}
                      className="w-full py-3.5 bg-slate-900 text-white text-sm font-semibold rounded hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Submit Application
                    </button>
                    <p className="text-xs text-center text-slate-400">
                      No cold outreach. They'll reach out if it's a fit.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">Application sent</h4>
                    <p className="text-sm text-slate-500 mt-1">
                      {drawerPost.author} will reach out if <strong>{drawerRole}</strong> is a match.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDrawerOpen(false);
                      onNavigate?.("workspace");
                    }}
                    className="text-xs font-semibold text-white bg-slate-900 px-4 py-2 rounded hover:bg-slate-700 transition-colors cursor-pointer mt-2"
                  >
                    Go to Workspace
                  </button>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mt-1"
                  >
                    Back to feed
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
