/**
 * Verified project pill — one of the few places Liwayway (dawn gold) is allowed.
 * "Together at the oar, together at the shore."
 */
export function VerifiedDot({ size = 18 }: { size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-liwayway shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.2 5 8.6l4.5-5" stroke="#0A2532" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default function VerifiedBadge({ subtitle = true }: { subtitle?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 bg-white rounded-full pl-1.5 pr-4 py-1.5 shadow-[0_4px_14px_-6px_rgba(10,37,50,0.35)]">
      <VerifiedDot size={20} />
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-tinta">Verified project</span>
        {subtitle && <span className="text-[10px] text-tinta/60">Together at the oar, together at the shore</span>}
      </span>
    </span>
  );
}
