import { useState } from "react";
import Tag from "./Tag";

interface CollabPostCardProps {
  title: string;
  description: string;
  rolesNeeded: string[];
  timeline: string;
  commitment: "Passion" | "Equity" | "Paid";
  vibeTags: string[];
  author: string;
  authorInitials: string;
  school: string;
  onInterested?: () => void;
}

export default function CollabPostCard({
  title,
  description,
  rolesNeeded,
  timeline,
  commitment,
  vibeTags,
  author,
  authorInitials,
  school,
  onInterested,
}: CollabPostCardProps) {
  const [interested, setInterested] = useState(false);

  const commitmentStyle: Record<string, string> = {
    Passion: "bg-slate-100 text-slate-600 border-slate-200",
    Equity: "bg-slate-200 text-slate-700 border-slate-300",
    Paid: "bg-slate-800 text-white border-slate-800",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col gap-4 hover:border-slate-400 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 leading-snug">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-slate-500">{authorInitials}</span>
            </div>
            <span className="text-xs text-slate-500">
              {author} · {school}
            </span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded border shrink-0 ${commitmentStyle[commitment]}`}>
          {commitment}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 leading-relaxed">{description}</p>

      {/* Roles needed */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Roles Needed</p>
        <div className="flex flex-wrap gap-1.5">
          {rolesNeeded.map((r) => (
            <span key={r} className="text-xs font-medium px-2 py-1 bg-slate-50 border border-slate-200 rounded text-slate-700">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Vibe tags */}
      <div className="flex flex-wrap gap-1.5">
        {vibeTags.map((t) => (
          <Tag key={t} label={t} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <span className="text-xs text-slate-400">
          ⏱ {timeline}
        </span>
        <button
          onClick={() => {
            setInterested(true);
            onInterested?.();
          }}
          className={`text-xs font-semibold px-4 py-2 rounded transition-colors cursor-pointer ${
            interested
              ? "bg-slate-200 text-slate-500 cursor-default"
              : "bg-slate-900 text-white hover:bg-slate-700"
          }`}
        >
          {interested ? "Interest Sent ✓" : "I'm Interested"}
        </button>
      </div>
    </div>
  );
}
