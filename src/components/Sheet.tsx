import { useEffect, useRef } from "react";

const stack: symbol[] = [];
import type { ReactNode } from "react";
import Icon from "./Icon";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** "side" slides in from the right; "center" is a dialog */
  variant?: "side" | "center";
  width?: number;
}

/** Shared drawer / dialog. Closes on backdrop click and Escape. */
export default function Sheet({ open, onClose, eyebrow, title, children, footer, variant = "side", width = 420 }: SheetProps) {
  // Esc closes only the topmost open sheet (sheets can stack)
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const id = Symbol("sheet");
    stack.push(id);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && stack[stack.length - 1] === id) {
        e.stopImmediatePropagation();
        closeRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      const i = stack.indexOf(id);
      if (i >= 0) stack.splice(i, 1);
    };
  }, [open]);

  if (!open) return null;

  const panel =
    variant === "side"
      ? "absolute right-0 top-0 bottom-0 rounded-l-2xl"
      : "relative max-h-[85%] rounded-2xl mx-4";

  return (
    <div className={`fixed inset-0 z-50 flex ${variant === "center" ? "items-center justify-center" : ""}`}>
      <div className="absolute inset-0 bg-tinta/40 backdrop-blur-[2px]" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`${panel} bg-white flex flex-col overflow-hidden shadow-[-24px_0_48px_-24px_rgba(10,37,50,0.4)]`}
        style={{ width }}
      >
        <div className="px-6 py-5 bg-dagat flex items-start justify-between gap-4 shrink-0">
          <div className="min-w-0">
            {eyebrow && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-liwayway mb-2">{eyebrow}</p>
            )}
            <h3 className="font-display text-2xl text-layag leading-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-layag/60 hover:text-layag transition-colors mt-1 cursor-pointer"
            aria-label="Close"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-buhangin bg-layag/60 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

/* Shared form styles so every sheet looks the same */
export const fieldLabel = "text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim mb-2 block";
export const fieldInput =
  "w-full bg-white border border-buhangin rounded-xl px-4 py-3 text-sm text-tinta placeholder:text-tinta/35 focus:outline-none focus:border-laot focus:ring-4 focus:ring-laot/10 transition-colors";
export const primaryBtn =
  "inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-laot text-layag text-sm font-semibold rounded-full hover:bg-dagat transition-colors cursor-pointer disabled:bg-buhangin disabled:text-tinta/40 disabled:cursor-not-allowed";
export const ghostBtn =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-dagat hover:text-laot transition-colors cursor-pointer";
