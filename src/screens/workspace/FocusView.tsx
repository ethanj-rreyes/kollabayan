import { TOOLS, dayLabel, firstName, member, riskOf } from "./model";
import type { Status, Task, ToolId } from "./model";

/**
 * Focus view — a terminal-like list of *my* tasks. For makers who want the
 * next thing to do, not a board. Same data as Board and Timeline.
 */
const GLYPH: Record<Status, string> = { doing: "●", todo: "○", done: "✓" };
const TAG: Record<Status, string> = { doing: "DOING", todo: "TODO ", done: "DONE " };

interface Props {
  tasks: Task[];
  viewer: string;
  connected: ToolId[];
  onOpen: (t: Task) => void;
  onMove: (t: Task, to: Status) => void;
}

export default function FocusView({ tasks, viewer, connected, onOpen, onMove }: Props) {
  const mine = tasks
    .filter((t) => t.owner === viewer)
    .sort((a, b) => ({ doing: 0, todo: 1, done: 2 })[a.status] - ({ doing: 0, todo: 1, done: 2 })[b.status] || a.due - b.due);
  const r = riskOf(tasks, member(viewer));
  const next = mine.find((t) => t.status !== "done");
  const user = firstName(viewer).toLowerCase();

  return (
    <div className="bg-tinta rounded-2xl text-layag/90 font-mono text-[13px] leading-relaxed overflow-hidden h-full flex flex-col">
      {/* window bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-layag/10 text-[11px] text-layag/50">
        <span className="w-2.5 h-2.5 rounded-full bg-layag/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-layag/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-layag/15" />
        <span className="ml-2">{user}@kollabayan: ~/studysched</span>
      </div>

      <div className="flex-1 overflow-auto px-5 py-4">
        <p className="text-layag/50">
          <span className="text-laot brightness-150">$</span> tasks --mine --sprint 3
        </p>

        <ul className="mt-3 flex flex-col">
          {mine.map((t) => {
            const src = t.source;
            const live = src && connected.includes(src.tool);
            return (
              <li key={t.id} className="group flex items-center gap-3 py-1 hover:bg-layag/5 -mx-2 px-2 rounded">
                <span className={t.status === "done" ? "text-layag/35" : t.status === "doing" ? "text-[#7FC4BD]" : "text-layag/70"}>
                  {GLYPH[t.status]} {TAG[t.status]}
                </span>
                <span className="text-layag/40 w-8 shrink-0">#{t.id}</span>
                <button
                  onClick={() => onOpen(t)}
                  className={`flex-1 min-w-0 truncate text-left cursor-pointer hover:underline ${t.status === "done" ? "text-layag/40 line-through" : ""}`}
                >
                  {t.title}
                </button>
                <span className="text-layag/50 w-8 text-right shrink-0">{t.estimate}h</span>
                <span className="text-layag/40 w-16 shrink-0">{t.status === "done" ? "" : dayLabel(t.due)}</span>
                <span className={`w-28 truncate shrink-0 ${live ? "text-[#7FC4BD]" : "text-layag/30"}`} title={live ? "auto-synced" : "not connected"}>
                  {src ? `${live ? "⟲" : "·"} ${TOOLS[src.tool].name.toLowerCase().replace(/\s/g, "")}` : ""}
                </span>
                {t.status !== "done" ? (
                  <button
                    onClick={() => onMove(t, t.status === "todo" ? "doing" : "done")}
                    className="w-14 text-right text-layag/40 hover:text-layag opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                  >
                    [{t.status === "todo" ? "start" : "done"}]
                  </button>
                ) : (
                  <span className="w-14 shrink-0" />
                )}
              </li>
            );
          })}
          {mine.length === 0 && <li className="text-layag/40">no tasks assigned. you're clear.</li>}
        </ul>

        <div className="mt-5 pt-4 border-t border-layag/10 flex flex-col gap-1 text-layag/60">
          <p>
            capacity <span className="text-layag">{r.load}/{r.ceiling}h</span>{" "}
            <span className={r.level === "at" ? "text-[#E3A08F]" : r.level === "near" ? "text-layag" : "text-[#7FC4BD]"}>
              [{r.label.toLowerCase()}]
            </span>
          </p>
          {next && (
            <p>
              next <span className="text-layag">#{next.id} {next.title}</span>
            </p>
          )}
          <p className="text-layag/35">status syncs from your tools. [start]/[done] are manual overrides.</p>
        </div>
      </div>
    </div>
  );
}
