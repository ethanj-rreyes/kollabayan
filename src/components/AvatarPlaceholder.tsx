interface AvatarProps {
  size?: number;
  initials?: string;
}

export default function AvatarPlaceholder({ size = 32, initials }: AvatarProps) {
  return (
    <div
      className="rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      {initials ? (
        <span className="text-slate-500 font-semibold" style={{ fontSize: size * 0.36 }}>
          {initials}
        </span>
      ) : (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="#94a3b8" strokeWidth="1.5" />
          <path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
