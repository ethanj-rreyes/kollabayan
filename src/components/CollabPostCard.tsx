import Tag from "./Tag";
import Icon from "./Icon";
import AvatarPlaceholder from "./AvatarPlaceholder";

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
  projectType?: string;
  /** True once an application was actually submitted */
  applied?: boolean;
  /** Shown on posts you created */
  mine?: boolean;
  onInterested?: () => void;
}

export const COMMITMENT_STYLE: Record<string, string> = {
  Passion: "bg-buhangin text-tinta/80",
  Equity: "bg-lalim/10 text-lalim",
  Paid: "bg-dagat text-layag",
};

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
  projectType,
  applied = false,
  mine = false,
  onInterested,
}: CollabPostCardProps) {

  return (
    <article className="bg-white border border-buhangin rounded-2xl p-6 flex flex-col gap-4 hover:border-lalim/40 hover:shadow-[0_8px_24px_-12px_rgba(13,52,70,0.25)] transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {projectType && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-lalim mb-1.5">{projectType}</p>
          )}
          <h3 className="text-[17px] font-semibold text-tinta leading-snug">{title}</h3>
          <div className="flex items-center gap-2 mt-2">
            <AvatarPlaceholder size={22} initials={authorInitials} />
            <span className="text-xs text-tinta/60">
              {author} · {school}
            </span>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${COMMITMENT_STYLE[commitment]}`}>
          {commitment}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-tinta/75 leading-relaxed">{description}</p>

      {/* Roles needed */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-lalim mb-2">Crew needed</p>
        <div className="flex flex-wrap gap-1.5">
          {rolesNeeded.map((r) => (
            <span key={r} className="text-xs font-medium px-2.5 py-1 bg-layag border border-buhangin rounded-md text-tinta">
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* Vibe tags */}
      <div className="flex flex-wrap gap-1.5">
        {vibeTags.map((t) => (
          <Tag key={t} label={t} size="sm" />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-buhangin">
        <span className="flex items-center gap-1.5 text-xs text-tinta/60">
          <Icon name="clock" size={14} className="text-lalim" />
          {timeline}
        </span>
        <button
          onClick={() => !applied && !mine && onInterested?.()}
          disabled={applied || mine}
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
            applied || mine
              ? "bg-buhangin text-lalim cursor-default"
              : "bg-laot text-layag hover:bg-dagat cursor-pointer"
          }`}
        >
          {mine ? (
            "Your post"
          ) : applied ? (
            <>
              <Icon name="check" size={14} strokeWidth={2.2} /> Request sent
            </>
          ) : (
            <>
              Join the Balangay <Icon name="arrow-right" size={14} />
            </>
          )}
        </button>
      </div>
    </article>
  );
}
