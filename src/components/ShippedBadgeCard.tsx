import AvatarPlaceholder from "./AvatarPlaceholder";

interface ShippedBadgeCardProps {
  projectName: string;
  role: string;
  teammates: { initials: string }[];
  outputUrl: string;
}

export default function ShippedBadgeCard({ projectName, role, teammates, outputUrl }: ShippedBadgeCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col gap-3 hover:border-slate-400 transition-all">
      {/* Badge mark */}
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2l1.5 3.5L13 6l-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5L8 2z" fill="white" />
          </svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shipped</span>
      </div>

      {/* Project name */}
      <h4 className="text-sm font-bold text-slate-900 leading-snug">{projectName}</h4>

      {/* Role */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">My Role</p>
        <p className="text-xs font-semibold text-slate-700">{role}</p>
      </div>

      {/* Teammates */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Team</p>
        <div className="flex items-center gap-1">
          {teammates.map((t, i) => (
            <div key={i} className="-ml-1 first:ml-0">
              <AvatarPlaceholder size={26} initials={t.initials} />
            </div>
          ))}
        </div>
      </div>

      {/* Output link */}
      <div className="pt-2 border-t border-slate-100">
        <a className="text-xs font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2 transition-colors cursor-pointer">
          ↗ {outputUrl}
        </a>
      </div>
    </div>
  );
}
