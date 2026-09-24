import AvatarPlaceholder from "../../components/AvatarPlaceholder";
import Icon from "../../components/Icon";
import { TOOLS, firstName } from "./model";
import type { Status, Task, ToolId } from "./model";

export const STATUS_LABEL: Record<Status, string> = { todo: "To Do", doing: "Doing", done: "Done" };
const NEXT: Record<Status, Status> = { todo: "doing", doing: "done", done: "todo" };
const MOVE_LABEL: Record<Status, string> = { todo: "Start", doing: "Done", done: "Reopen" };

/** Source chip — shows whether the task is tracked automatically. */
export function SourceChip({ task, connected }: { task: Task; connected: ToolId[] }) {
  if (!task.source) return null;
  const on = connected.includes(task.source.tool);
  return (
    <span
      className={`inline-flex items-center gap-1.5 max-w-full text-[11px] rounded-full px-2 py-0.5 ${
        on ? "bg-laot/10 text-laot" : "bg-buhangin/70 text-tinta/50"
      }`}
      title={on ? `Auto-tracked from ${TOOLS[task.source.tool].name}` : `Connect ${TOOLS[task.source.tool].name} to auto-track`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${on ? "bg-laot animate-pulse" : "bg-tinta/30"}`} />
      <span className="font-semibold shrink-0">{TOOLS[task.source.tool].name}</span>
      <span className="truncate">· {task.source.ref}</span>
    </span>
  );
}

interface ViewProps {
  tasks: Task[];
  connected: ToolId[];
  decisionsFor: (id: number) => number;
  onOpen: (t: Task) => void;
  onMove: (t: Task, to: Status) => void;
  onAdd: (status: Status) => void;
  /** Project hub open: columns shrink to 248px. Closed: they share the full width. */
  compact?: boolean;
}

export default function BoardView({ tasks, connected, decisionsFor, onOpen, onMove, onAdd, compact = false }: ViewProps) {
  return (
    <div className="flex gap-4 h-full">
      {(["todo", "doing", "done"] as const).map((col) => {
        const list = tasks.filter((t) => t.status === col);
        const hours = list.reduce((a, t) => a + t.estimate, 0);
        return (
          <div
            key={col}
            className="flex flex-col min-w-0 transition-[flex-grow] duration-300 ease-out"
            style={{ flexGrow: compact ? 0 : 1, flexShrink: 0, flexBasis: 248 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-lalim">{STATUS_LABEL[col]}</h3>
              <span className="text-[11px] font-semibold text-tinta/60 bg-buhangin px-2 py-0.5 rounded-full">{list.length}</span>
              <span className="text-[11px] text-tinta/40 ml-auto tabular-nums">{hours}h</span>
            </div>
            <div className="flex-1 bg-buhangin/50 rounded-2xl p-3 flex flex-col gap-2.5 overflow-y-auto">
              {list.map((t) => {
                const auto = t.lastAuto;
                const nDec = decisionsFor(t.id);
                const live = !!t.source && connected.includes(t.source.tool);
                return (
                  <div
                    key={t.id}
                    onClick={() => onOpen(t)}
                    className="bg-white border border-buhangin rounded-xl px-3.5 py-3 flex flex-col gap-2 hover:border-lalim/40 hover:shadow-[0_6px_16px_-10px_rgba(13,52,70,0.3)] transition-all group cursor-pointer"
                  >
                    {/* Always visible: title, owner, sync state */}
                    <p className={`text-sm font-semibold leading-snug ${col === "done" ? "text-tinta/55 line-through decoration-tinta/30" : "text-tinta"}`}>
                      {t.priority === "high" && col !== "done" && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-dagat mr-1.5 mb-0.5 align-middle" title="High priority" />
                      )}
                      {t.title}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <AvatarPlaceholder size={20} initials={t.owner} />
                        <span className="text-xs text-tinta/60 truncate">{firstName(t.owner)}</span>
                      </div>
                      {live ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-laot shrink-0" title={`Auto-tracked from ${TOOLS[t.source!.tool].name}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-laot animate-pulse" />
                          {auto ? "Synced" : "Live"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-tinta/35 shrink-0 group-hover:hidden">Manual</span>
                      )}
                    </div>

                    {/* On hover: the details */}
                    <div className="hidden group-hover:flex flex-col gap-2 pt-2 border-t border-buhangin">
                      <SourceChip task={t} connected={connected} />
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-[11px] text-tinta/55 tabular-nums">
                          {t.estimate}h · {t.priority}
                          {nDec > 0 && <span className="text-[10px] font-semibold text-lalim bg-lalim/10 px-1.5 py-0.5 rounded-full">Decision</span>}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMove(t, NEXT[col]);
                          }}
                          title="Manual override. Connected tools update this for you."
                          className="inline-flex items-center gap-1 text-xs font-semibold text-laot cursor-pointer shrink-0"
                        >
                          {MOVE_LABEL[col]} <Icon name={col === "done" ? "arrow-left" : "arrow-right"} size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => onAdd(col)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-lalim/30 rounded-xl text-xs font-semibold text-lalim/80 hover:text-laot hover:border-laot hover:bg-white/60 transition-colors cursor-pointer"
              >
                <Icon name="plus" size={13} /> Add task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
