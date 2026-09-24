import AvatarPlaceholder from "../../components/AvatarPlaceholder";
import { SPRINT, TEAM, TODAY, dayLabel, riskOf } from "./model";
import type { Task } from "./model";

/**
 * Timeline view — Gantt chart for leads. Rows grouped by owner with their
 * capacity, bars coloured by status, today + deadline markers.
 */
const FIRST = 15;
const LAST = 32; // Oct 2
const DAY_W = 34;
const DAYS = Array.from({ length: LAST - FIRST + 1 }, (_, i) => FIRST + i);

const BAR: Record<Task["status"], string> = {
  todo: "bg-lalim/20 text-tinta/80 border border-lalim/30",
  doing: "bg-laot text-layag",
  done: "bg-dagat/35 text-tinta/70",
};

export default function TimelineView({ tasks, onOpen }: { tasks: Task[]; onOpen: (t: Task) => void }) {
  const x = (d: number) => (d - FIRST) * DAY_W;
  const gridW = DAYS.length * DAY_W;

  return (
    <div className="bg-white border border-buhangin rounded-2xl overflow-auto h-full">
      <div style={{ minWidth: 240 + gridW }}>
        {/* Header */}
        <div className="flex sticky top-0 bg-white z-10 border-b border-buhangin">
          <div className="w-[240px] shrink-0 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Owner · task</div>
          <div className="relative flex" style={{ width: gridW }}>
            {DAYS.map((d) => {
              const inSprint = d >= SPRINT.start && d <= SPRINT.end;
              return (
                <div
                  key={d}
                  className={`text-center py-2.5 text-[10px] tabular-nums ${d === TODAY ? "font-semibold text-tinta" : "text-tinta/45"} ${inSprint ? "bg-laot/5" : ""}`}
                  style={{ width: DAY_W }}
                >
                  {d === FIRST || d === 31 ? dayLabel(d) : d > 30 ? d - 30 : d}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rows */}
        <div className="relative">
          {/* markers */}
          <div className="absolute top-0 bottom-0 w-px bg-tinta z-[1]" style={{ left: 240 + x(TODAY) + DAY_W / 2 }}>
            <span className="absolute -top-0 left-1 text-[9px] font-semibold uppercase tracking-wider text-tinta bg-white px-1">Today</span>
          </div>
          <div className="absolute top-0 bottom-0 border-l border-dashed border-lalim/60 z-[1]" style={{ left: 240 + x(30) + DAY_W }}>
            <span className="absolute top-0 left-1 text-[9px] font-semibold uppercase tracking-wider text-lalim bg-white px-1">Deadline</span>
          </div>

          {TEAM.map((m) => {
            const own = tasks.filter((t) => t.owner === m.initials).sort((a, b) => a.start - b.start);
            if (own.length === 0) return null;
            const r = riskOf(tasks, m);
            return (
              <div key={m.initials}>
                <div className="flex items-center bg-layag/70 border-y border-buhangin">
                  <div className="w-[240px] shrink-0 px-4 py-2 flex items-center gap-2">
                    <AvatarPlaceholder size={22} initials={m.initials} />
                    <span className="text-xs font-semibold text-tinta truncate">{m.name}</span>
                    <span
                      className={`ml-auto text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-full ${
                        r.level === "at" ? "bg-sabit/15 text-sabit" : r.level === "near" ? "bg-lalim/10 text-lalim" : "bg-laot/10 text-laot"
                      }`}
                    >
                      {r.load}/{r.ceiling}h
                    </span>
                  </div>
                  <div style={{ width: gridW }} />
                </div>
                {own.map((t) => (
                  <div key={t.id} className="flex items-center border-b border-buhangin/60 hover:bg-layag/40">
                    <button onClick={() => onOpen(t)} className="w-[240px] shrink-0 px-4 py-2 text-left text-xs text-tinta/80 truncate cursor-pointer hover:text-laot">
                      #{t.id} {t.title}
                    </button>
                    <div className="relative h-9" style={{ width: gridW }}>
                      <button
                        onClick={() => onOpen(t)}
                        className={`absolute top-1.5 h-6 rounded-md text-[10px] font-semibold px-2 flex items-center truncate cursor-pointer ${BAR[t.status]}`}
                        style={{ left: x(t.start) + 2, width: Math.max(DAY_W - 4, (t.due - t.start + 1) * DAY_W - 4) }}
                        title={`${dayLabel(t.start)} – ${dayLabel(t.due)} · ${t.estimate}h`}
                      >
                        {t.estimate}h
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 px-4 py-3 text-[11px] text-tinta/60">
          {(["todo", "doing", "done"] as const).map((s) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className={`w-4 h-2.5 rounded-sm ${BAR[s]}`} /> {s === "todo" ? "To Do" : s === "doing" ? "Doing" : "Done"}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5">
            <span className="w-4 h-2.5 rounded-sm bg-laot/10" /> {SPRINT.name}
          </span>
        </div>
      </div>
    </div>
  );
}
