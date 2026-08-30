import AvatarPlaceholder from "./AvatarPlaceholder";

interface KanbanCardProps {
  title: string;
  assignee: string;
  initials: string;
  priority?: "low" | "medium" | "high";
}

export default function KanbanCard({ title, assignee, initials, priority = "medium" }: KanbanCardProps) {
  const priorityColors: Record<string, string> = {
    low: "bg-slate-200 text-slate-500",
    medium: "bg-slate-300 text-slate-600",
    high: "bg-slate-700 text-white",
  };

  return (
    <div className="bg-white border border-slate-200 rounded p-3 flex flex-col gap-2.5 hover:border-slate-400 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 leading-snug">{title}</p>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${priorityColors[priority]}`}>
          {priority}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AvatarPlaceholder size={22} initials={initials} />
          <span className="text-xs text-slate-500">{assignee}</span>
        </div>
        <button className="text-xs text-slate-400 hover:text-slate-700 transition-colors opacity-0 group-hover:opacity-100">
          Move →
        </button>
      </div>
    </div>
  );
}
