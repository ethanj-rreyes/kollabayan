/** Small line icons — replaces emoji and glyphs from the wireframe (brand: no emoji). */
type IconName = "clock" | "check" | "arrow-right" | "arrow-left" | "arrow-up-right" | "send" | "plus" | "close" | "chevron-down" | "search" | "mail" | "users" | "doc" | "code" | "folder" | "link" | "notes" | "pin" | "calendar" | "quote" | "sync" | "alert" | "lock" | "list" | "columns" | "gantt" | "terminal";

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const PATHS: Record<IconName, string> = {
  clock: "M12 7v5l3 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  check: "M5 12.5l4.5 4.5L19 7.5",
  "arrow-right": "M5 12h14 M13 6l6 6-6 6",
  "arrow-left": "M19 12H5 M11 6l-6 6 6 6",
  "arrow-up-right": "M7 17 17 7 M8 7h9v9",
  send: "M12 19V5 M6 11l6-6 6 6",
  plus: "M12 5v14 M5 12h14",
  close: "M6 6l12 12 M18 6 6 18",
  "chevron-down": "M6 9l6 6 6-6",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z M20 20l-4-4",
  mail: "M4 6h16v12H4z M4 7l8 6 8-6",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6 M16 4.3a3.5 3.5 0 0 1 0 6.4 M18 14.3c2.1.7 3.5 2.8 3.5 5.7",
  doc: "M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6",
  code: "M8 8l-4 4 4 4 M16 8l4 4-4 4 M13.5 5l-3 14",
  folder: "M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  notes: "M5 4h14v16H5z M9 9h6 M9 13h6 M9 17h3",
  pin: "M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11Z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  calendar: "M4 6h16v14H4z M4 10h16 M8 3v4 M16 3v4",
  sync: "M20 11a8 8 0 0 0-14.3-4.9L4 8 M4 4v4h4 M4 13a8 8 0 0 0 14.3 4.9L20 16 M20 20v-4h-4",
  alert: "M12 4 2.5 20h19L12 4Z M12 10v4.5 M12 17.5v.01",
  lock: "M6 11h12v9H6z M8.5 11V8a3.5 3.5 0 0 1 7 0v3",
  list: "M9 6h11 M9 12h11 M9 18h11 M4.5 6h.01 M4.5 12h.01 M4.5 18h.01",
  columns: "M4 5h4.5v14H4z M9.75 5h4.5v14h-4.5z M15.5 5H20v14h-4.5z",
  gantt: "M4 5v14 M7 7h7 M10 11h9 M7 15h6",
  terminal: "M4 5h16v14H4z M7.5 9.5 10 12l-2.5 2.5 M12.5 15h4",
  quote: "M7 17c-2 0-3-1.5-3-3.5C4 10 6 7.5 9 7 M16 17c-2 0-3-1.5-3-3.5C13 10 15 7.5 18 7 M4 13.5h5v3.5H4z M13 13.5h5v3.5h-5z",
};

export default function Icon({ name, size = 16, className = "", strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
