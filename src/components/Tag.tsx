interface TagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export default function Tag({ label, selected = false, onClick, size = "md" }: TagProps) {
  const pad = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center rounded-full font-semibold border transition-colors select-none ${pad} ${
        onClick ? "cursor-pointer" : "cursor-default"
      } ${
        selected
          ? "bg-laot text-layag border-laot"
          : "bg-white text-tinta/75 border-buhangin hover:border-lalim/50 hover:text-tinta"
      }`}
    >
      {label}
    </button>
  );
}
