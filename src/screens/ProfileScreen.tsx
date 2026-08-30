import { useState } from "react";
import Tag from "../components/Tag";
import ShippedBadgeCard from "../components/ShippedBadgeCard";
import AvatarPlaceholder from "../components/AvatarPlaceholder";

const SKILLS = ["React", "TypeScript", "UI/UX Design", "Figma", "Python", "Data Analysis"];

const SHIPPED = [
  {
    projectName: "AI Study Scheduler",
    role: "UI/UX Designer & Frontend",
    teammates: [{ initials: "MR" }, { initials: "JT" }, { initials: "SP" }],
    outputUrl: "studyschedai.vercel.app",
  },
  {
    projectName: "Local Vintage Marketplace",
    role: "Brand Designer",
    teammates: [{ initials: "JT" }, { initials: "KL" }],
    outputUrl: "vintagenear.me",
  },
  {
    projectName: "Open-Source Analytics SDK",
    role: "Design System Lead",
    teammates: [{ initials: "SP" }, { initials: "DF" }, { initials: "RW" }, { initials: "NB" }],
    outputUrl: "github.com/oss-analytics",
  },
];

export default function ProfileScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Arjun Kapoor");
  const [school, setSchool] = useState("University of Michigan");
  const [aspiration, setAspiration] = useState("Building tools that make collaboration feel less like work and more like play.");

  return (
    <div className="min-h-full bg-slate-50">
      {/* TOP SECTION */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-8 py-10">
          <div className="flex items-start justify-between gap-6">
            {/* Avatar + Meta */}
            <div className="flex items-start gap-5">
              <AvatarPlaceholder size={72} initials="AK" />
              <div className="flex flex-col gap-3">
                {editing ? (
                  <div className="flex flex-col gap-2">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-2xl font-bold text-slate-900 border-b-2 border-slate-300 focus:border-slate-700 focus:outline-none bg-transparent w-64 transition-colors"
                    />
                    <input
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="text-sm text-slate-500 border-b border-slate-200 focus:border-slate-500 focus:outline-none bg-transparent w-56 transition-colors"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                    <p className="text-sm text-slate-500 mt-0.5">{school}</p>
                  </div>
                )}

                {/* Aspiration */}
                {editing ? (
                  <input
                    value={aspiration}
                    onChange={(e) => setAspiration(e.target.value)}
                    className="text-sm text-slate-600 italic border-b border-slate-200 focus:border-slate-500 focus:outline-none bg-transparent w-full max-w-sm transition-colors"
                  />
                ) : (
                  <p className="text-sm text-slate-600 italic max-w-sm">{aspiration}</p>
                )}

                {/* Skill tags */}
                <div className="flex flex-wrap gap-1.5">
                  {SKILLS.map((s) => (
                    <Tag key={s} label={s} selected />
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex gap-5 pt-1">
                  {[
                    { label: "Projects shipped", value: "3" },
                    { label: "Collaborators", value: "9" },
                    { label: "Availability", value: "12h/wk" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setEditing((e) => !e)}
              className={`px-4 py-2 text-xs font-semibold border rounded transition-colors cursor-pointer shrink-0 ${
                editing
                  ? "bg-slate-900 text-white border-slate-900 hover:bg-slate-700"
                  : "bg-white text-slate-600 border-slate-300 hover:border-slate-500 hover:text-slate-800"
              }`}
            >
              {editing ? "Save Profile" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION — Shipped projects */}
      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Shipped Projects</h2>
            <p className="text-xs text-slate-400 mt-0.5">Verified collaboration history</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
            <span className="text-xs font-semibold text-slate-500">{SHIPPED.length} verified</span>
          </div>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-4">
          {SHIPPED.map((badge) => (
            <ShippedBadgeCard key={badge.projectName} {...badge} />
          ))}
          {/* Empty state placeholder */}
          <div
            onClick={() => onNavigate?.("discovery")}
            className="border-2 border-dashed border-slate-200 rounded-lg p-5 flex flex-col items-center justify-center gap-2 text-center min-h-[180px] cursor-pointer hover:border-slate-400 hover:bg-slate-50 transition-all"
          >
            <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
              <span className="text-slate-400 text-lg leading-none">+</span>
            </div>
            <p className="text-xs text-slate-400 max-w-[120px]">Join a project to add a badge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
