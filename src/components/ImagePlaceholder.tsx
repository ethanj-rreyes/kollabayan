interface ImagePlaceholderProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function ImagePlaceholder({ width = "100%", height = 120, className = "" }: ImagePlaceholderProps) {
  return (
    <div
      className={`bg-slate-100 border border-slate-200 flex items-center justify-center relative ${className}`}
      style={{ width, height }}
    >
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#cbd5e1" strokeWidth="1" />
      </svg>
      <span className="relative text-slate-400 text-xs font-medium">Image</span>
    </div>
  );
}
