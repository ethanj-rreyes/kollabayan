/**
 * KollaBayan brandmark — a low balangay hull on a single water line,
 * a page-shaped sail with a gold fold (Build), a kubo at the stern with a
 * gold frame (Show), and a four-point compass sun (Find).
 *
 * tone="ink"   → for Layag or white backgrounds (Tinta marks)
 * tone="light" → for Dagat / Laot / Lalim backgrounds (Layag marks)
 * mono         → single colour, drops the sun and stripes (min 16px)
 */
interface BrandMarkProps {
  size?: number;
  tone?: "ink" | "light";
  mono?: boolean;
  className?: string;
}

export default function BrandMark({ size = 32, tone = "ink", mono = false, className = "" }: BrandMarkProps) {
  const body = tone === "ink" ? "#0A2532" : "#F3F7F5";
  const cut = tone === "ink" ? "#F3F7F5" : "#0D3446";
  const gold = mono ? body : "#D7A441";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label="KollaBayan"
    >
      {/* Sail — page shape, tilted, with folded corner */}
      <path d="M18.6 5.2 L29.4 7.8 L26.4 28.8 L16.4 27.4 Z" fill={body} />
      <path d="M25.4 6.8 L29.4 7.8 L28.8 11.9 Z" fill={gold} />
      {!mono && (
        <>
          <path d="M19.6 12.2 L26.2 13.8" stroke={gold} strokeWidth="1.7" strokeLinecap="round" />
          <path d="M19.1 16.1 L24.8 17.4" stroke={gold} strokeWidth="1.7" strokeLinecap="round" />
        </>
      )}

      {/* Kubo at the stern with gold frame */}
      <rect x="30" y="23.6" width="7.4" height="5.6" rx="0.6" fill={body} />
      <rect x="32.3" y="25.2" width="3" height="2.4" fill={gold} />

      {/* Hull — low balangay body */}
      <path d="M6 29.6 H42.4 C41 33.4 38.2 35.6 34.4 35.6 H14 C10.4 35.6 7.6 33.4 6 29.6 Z" fill={body} />
      <path d="M11 32.4 H37.4" stroke={cut} strokeWidth="0.9" strokeLinecap="round" opacity="0.35" />

      {/* Water line */}
      <path
        d="M5 40.6 C8.2 38.6 11.4 38.6 14.6 40.6 S21 42.6 24.2 40.6 S30.6 38.6 33.8 40.6 S40.2 42.6 43.4 40.6"
        stroke={body}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Sun — four-point compass in the upper corner */}
      {!mono && (
        <g transform="translate(36.6 11)">
          <circle r="2.1" fill={gold} />
          <path d="M0 -5 V-3 M0 3 V5 M-5 0 H-3 M3 0 H5" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
