interface AvatarProps {
  size?: number;
  initials?: string;
  ring?: boolean;
}

// Brand-safe avatar fills (Liwayway is reserved for the sun + verified badge)
const TONES = [
  "bg-laot text-layag",
  "bg-dagat text-layag",
  "bg-lalim text-layag",
  "bg-buhangin text-lalim",
];

function toneFor(initials = "") {
  const n = initials.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return TONES[n % TONES.length];
}

export default function AvatarPlaceholder({ size = 32, initials, ring = false }: AvatarProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center shrink-0 ${
        initials ? toneFor(initials) : "bg-buhangin text-lalim"
      } ${ring ? "ring-2 ring-white" : ""}`}
      style={{ width: size, height: size }}
    >
      {initials ? (
        <span className="font-semibold tracking-wide" style={{ fontSize: size * 0.36 }}>
          {initials}
        </span>
      ) : (
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M3 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
