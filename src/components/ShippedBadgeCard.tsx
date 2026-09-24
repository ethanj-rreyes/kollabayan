import AvatarPlaceholder from "./AvatarPlaceholder";
import Icon from "./Icon";
import { VerifiedDot } from "./VerifiedBadge";

interface ShippedBadgeCardProps {
  projectName: string;
  role: string;
  teammates: { initials: string }[];
  outputUrl: string;
}

export default function ShippedBadgeCard({ projectName, role, teammates, outputUrl }: ShippedBadgeCardProps) {
  return (
    <div className="bg-white border border-buhangin rounded-2xl p-5 flex flex-col gap-4 hover:border-lalim/40 hover:shadow-[0_8px_24px_-12px_rgba(13,52,70,0.25)] transition-all">
      {/* Badge mark */}
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 bg-dagat text-layag rounded-full pl-1 pr-3 py-1">
          <VerifiedDot size={18} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Verified</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Shipped</span>
      </div>

      {/* Project name */}
      <h4 className="text-base font-semibold text-tinta leading-snug">{projectName}</h4>

      {/* Role */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim mb-1">My role</p>
        <p className="text-sm text-tinta/80">{role}</p>
      </div>

      {/* Teammates */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim mb-1.5">Balangay crew</p>
        <div className="flex items-center">
          {teammates.map((t, i) => (
            <div key={i} className="-ml-1.5 first:ml-0">
              <AvatarPlaceholder size={28} initials={t.initials} ring />
            </div>
          ))}
        </div>
      </div>

      {/* Output link */}
      <div className="pt-3 mt-auto border-t border-buhangin">
        <a
          href={/^https?:\/\//.test(outputUrl) ? outputUrl : `https://${outputUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-dagat hover:text-laot underline underline-offset-4 decoration-buhangin hover:decoration-laot transition-colors cursor-pointer">
          <Icon name="arrow-up-right" size={13} /> {outputUrl}
        </a>
      </div>
    </div>
  );
}
