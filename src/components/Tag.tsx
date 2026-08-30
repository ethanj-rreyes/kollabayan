interface TagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function Tag({ label, selected = false, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer select-none ${
        selected
          ? "bg-slate-800 text-white border-slate-800"
          : "bg-white text-slate-600 border-slate-300 hover:border-slate-500 hover:text-slate-800"
      }`}
    >
      {label}
    </button>
  );
}
