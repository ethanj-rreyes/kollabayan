import BrandMark from "./BrandMark";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "light";
  tagline?: boolean;
}

const SIZES = {
  sm: { mark: 26, word: "text-[20px]", tag: "text-[8px]" },
  md: { mark: 34, word: "text-[26px]", tag: "text-[9px]" },
  lg: { mark: 56, word: "text-[42px]", tag: "text-[11px]" },
};

/** Primary lockup: brandmark + Literata wordmark. Big K and B, no hyphen. */
export default function Logo({ size = "sm", tone = "ink", tagline = false }: LogoProps) {
  const s = SIZES[size];
  const text = tone === "ink" ? "text-tinta" : "text-layag";
  const sub = tone === "ink" ? "text-lalim" : "text-layag/70";

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <BrandMark size={s.mark} tone={tone} />
      <span className="flex flex-col">
        <span className={`font-display ${s.word} ${text} leading-none`}>KollaBayan</span>
        {tagline && (
          <span className={`${s.tag} ${sub} font-semibold uppercase tracking-[0.22em] mt-1`}>
            Find. Build. Show.
          </span>
        )}
      </span>
    </span>
  );
}
