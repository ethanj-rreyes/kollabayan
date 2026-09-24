import AvatarPlaceholder from "../../components/AvatarPlaceholder";
import Icon from "../../components/Icon";
import { useState } from "react";
import type { ReactNode } from "react";
import { DOING_LIMIT, MAX_TOOLS, TEAM, TOOLS, doingCount, firstName, riskOf } from "./model";
import type { Activity, ProjectLink, Task, ToolId } from "./model";

/* ------------------------------------------------------------------ */
/*  Crew capacity — ceilings from declared hours + delivery history    */
/* ------------------------------------------------------------------ */

const LEVEL_STYLE = {
  healthy: { bar: "bg-laot", text: "text-laot" },
  near: { bar: "bg-lalim", text: "text-lalim" },
  at: { bar: "bg-sabit", text: "text-sabit" },
};

export function CapacityPanel({
  tasks,
  viewer,
  onPick,
  bare = false,
}: {
  tasks: Task[];
  viewer: string;
  onPick: (i: string) => void;
  /** true inside a drawer (no own padding/border) */
  bare?: boolean;
}) {
  return (
    <div className={bare ? "" : "px-4 py-4"}>
{!bare && (
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Crew capacity</p>
        <span className="text-[10px] text-tinta/45">this sprint</span>
      </div>
      )}
      <p className="text-[11px] text-tinta/50 mb-3 leading-snug">Ceiling = lower of declared hours and 4-sprint average delivered.</p>
      <ul className="flex flex-col gap-3.5">
        {TEAM.map((m) => {
          const r = riskOf(tasks, m);
          const pct = Math.min(100, Math.round((r.load / r.ceiling) * 100));
          const st = LEVEL_STYLE[r.level];
          const doing = doingCount(tasks, m.initials);
          return (
            <li key={m.initials}>
              <button onClick={() => onPick(m.initials)} className={`w-full text-left group cursor-pointer rounded-lg -mx-1 px-1 py-0.5 ${viewer === m.initials ? "bg-layag" : ""}`}>
                <div className="flex items-center gap-2">
                  <AvatarPlaceholder size={26} initials={m.initials} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold text-tinta truncate group-hover:text-laot">
                      {m.name}
                      {m.lead && <span className="ml-1 text-[10px] font-semibold text-lalim">· Lead</span>}
                    </span>
                    <span className="block text-[11px] text-tinta/50 truncate">{m.role}</span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums text-tinta shrink-0">
                    {r.load}/{r.ceiling}h
                  </span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-buhangin overflow-hidden">
                  <div className={`h-full rounded-full ${st.bar} transition-all`} style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className={`font-semibold ${st.text} inline-flex items-center gap-1`}>
                    {r.level === "at" && <Icon name="lock" size={11} />}
                    {r.label}
                  </span>
                  <span className="text-tinta/45 tabular-nums">
                    Doing {doing}/{DOING_LIMIT} · declared {m.declared}h · avg {r.delivered}h
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Project hub — connected apps, links, automated activity log        */
/* ------------------------------------------------------------------ */

function Section({ title, meta, action, children, defaultOpen = true }: { title: string; meta?: ReactNode; action?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-buhangin last:border-b-0">
      <div className="flex items-center gap-2 px-4 py-3">
        <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 cursor-pointer flex-1 min-w-0 text-left" aria-expanded={open}>
          <Icon name="chevron-down" size={13} className={`text-lalim transition-transform ${open ? "" : "-rotate-90"}`} />
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim whitespace-nowrap">{title}</span>
          {meta && <span className="text-[10px] text-tinta/45 truncate">{meta}</span>}
        </button>
        {action}
      </div>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}

type Filter = "all" | "tasks" | "versions" | "blocked";

export function HubRail({
  tasks,
  connected,
  autoSync,
  links,
  activity,
  onToggleSync,
  onManageTools,
  onOpenLink,
  onOpenFile,
  onAddLink,
  onSimulate,
  canSimulate,
  onCollapse,
}: {
  tasks: Task[];
  connected: ToolId[];
  autoSync: boolean;
  links: ProjectLink[];
  activity: Activity[];
  onToggleSync: () => void;
  onManageTools: () => void;
  onOpenLink: (id: string) => void;
  onOpenFile: (taskId: number) => void;
  onAddLink: () => void;
  onSimulate: () => void;
  canSimulate: boolean;
  onCollapse: () => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const auto = activity.filter((a) => a.kind === "auto" || (a.kind === "version" && a.tool)).length;
  const manual = activity.filter((a) => a.kind === "manual" || (a.kind === "version" && !a.tool)).length;
  const blocked = activity.filter((a) => a.kind === "blocked").length;
  const share = auto + manual ? Math.round((auto / (auto + manual)) * 100) : 0;
  const files = tasks.filter((t) => t.source && connected.includes(t.source.tool));
  const shown = activity.filter((a) =>
    filter === "all" ? true : filter === "tasks" ? a.kind === "auto" || a.kind === "manual" : filter === "versions" ? a.kind === "version" : a.kind === "blocked",
  );

  return (
    <aside className="@container h-full w-full min-w-[320px] border-l border-buhangin bg-white flex flex-col overflow-y-auto">
      <div className="px-4 py-3 flex items-center justify-between border-b border-buhangin">
        <p className="text-xs font-semibold text-tinta">Project hub</p>
        <button onClick={onCollapse} aria-label="Hide project hub" className="text-tinta/40 hover:text-tinta cursor-pointer">
          <Icon name="arrow-right" size={15} />
        </button>
      </div>

      <div className="flex flex-col @xl:grid @xl:grid-cols-2 @xl:items-start @xl:flex-1">
      <div className="@xl:border-r @xl:border-buhangin @xl:min-h-full">
      {/* ---------- Connected apps ---------- */}
      <Section
        title="Connected apps"
        meta={`${connected.length}/${MAX_TOOLS}`}
        action={
          <button onClick={onManageTools} className="text-[11px] font-semibold text-dagat hover:text-laot cursor-pointer">
            {connected.length ? "Manage" : "Connect"}
          </button>
        }
      >
        {connected.length === 0 ? (
          <button onClick={onManageTools} className="w-full text-left rounded-xl border border-dashed border-lalim/30 px-3 py-3 hover:border-laot cursor-pointer">
            <p className="text-xs font-semibold text-tinta">Connect where the work happens</p>
            <p className="text-[11px] text-tinta/55 mt-0.5">GitHub, Figma, Google Docs, and more. Tasks and links then update themselves.</p>
          </button>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {connected.map((id) => {
              const n = tasks.filter((t) => t.source?.tool === id && t.status !== "done").length;
              const l = links.filter((x) => x.tool === id).length;
              return (
                <li key={id} className="flex items-center gap-2.5 rounded-lg bg-layag px-3 py-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${autoSync ? "bg-laot animate-pulse" : "bg-tinta/30"}`} />
                  <span className="text-xs font-semibold text-tinta flex-1 truncate">{TOOLS[id].name}</span>
                  <span className="text-[10px] text-tinta/50 shrink-0">
                    {n} task{n === 1 ? "" : "s"}
                    {l ? ` · ${l} link` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <button role="switch" aria-checked={autoSync} onClick={onToggleSync} className="mt-3 flex items-center justify-between w-full text-[11px] font-semibold text-tinta/70 cursor-pointer">
          Auto-sync status from apps
          <span className={`w-8 h-[18px] rounded-full p-0.5 transition-colors ${autoSync ? "bg-laot" : "bg-buhangin"}`}>
            <span className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform ${autoSync ? "translate-x-3.5" : ""}`} />
          </span>
        </button>
      </Section>

      {/* ---------- Links ---------- */}
      <Section
        title="Links"
        meta={`${links.length + files.length}`}
        action={
          <button onClick={onAddLink} className="text-[11px] font-semibold text-dagat hover:text-laot cursor-pointer inline-flex items-center gap-0.5">
            <Icon name="plus" size={11} /> Add
          </button>
        }
      >
        <ul className="flex flex-col gap-0.5">
          {links.map((l) => {
            const v = l.history[0];
            const synced = l.tool && connected.includes(l.tool);
            return (
              <li key={l.id}>
                <button onClick={() => onOpenLink(l.id)} className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-layag cursor-pointer text-left">
                  <Icon name="link" size={14} className="text-lalim shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-semibold text-tinta truncate">{l.label}</span>
                    <span className="block text-[10px] text-tinta/50 truncate">
                      v{v.v} · {v.when} · {v.auto ? `auto from ${TOOLS[v.auto].name}` : firstName(v.by)}
                    </span>
                  </span>
                  {synced && <span className="w-1.5 h-1.5 rounded-full bg-laot shrink-0" title={`Auto-versioned from ${TOOLS[l.tool!].name}`} />}
                </button>
              </li>
            );
          })}
        </ul>
        {files.length > 0 && (
          <>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-tinta/40 mt-3 mb-1 px-2">Found in your apps</p>
            <ul className="flex flex-col gap-0.5">
              {files.map((t) => (
                <li key={t.id}>
                  <button onClick={() => onOpenFile(t.id)} className="w-full flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-layag cursor-pointer text-left">
                    <Icon name="doc" size={14} className="text-laot shrink-0" />
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold text-tinta truncate">{t.source!.ref}</span>
                      <span className="block text-[10px] text-tinta/50 truncate">
                        {TOOLS[t.source!.tool].name} · task #{t.id}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      </div>
      <div>
      {/* ---------- Activity + versions ---------- */}
      <Section title="Activity & versions" meta={`${share}% automatic`}>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-laot/10 py-1.5">
            <p className="text-base font-semibold text-laot tabular-nums leading-none">{auto}</p>
            <p className="text-[10px] text-laot mt-1">Auto</p>
          </div>
          <div className="rounded-lg bg-buhangin/70 py-1.5">
            <p className="text-base font-semibold text-tinta tabular-nums leading-none">{manual}</p>
            <p className="text-[10px] text-tinta/60 mt-1">Manual</p>
          </div>
          <div className="rounded-lg bg-sabit/10 py-1.5">
            <p className="text-base font-semibold text-sabit tabular-nums leading-none">{blocked}</p>
            <p className="text-[10px] text-sabit mt-1">Blocked</p>
          </div>
        </div>

        <div className="flex gap-1 mt-3 flex-nowrap">
          {(["all", "tasks", "versions", "blocked"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize cursor-pointer ${filter === f ? "bg-dagat text-layag" : "text-tinta/60 hover:text-tinta"}`}
            >
              {f}
            </button>
          ))}
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {shown.map((a) => (
            <li key={a.id} className="flex gap-2.5">
              <span
                className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                  a.kind === "blocked" ? "bg-sabit/10 text-sabit" : a.tool ? "bg-laot/10 text-laot" : "bg-buhangin text-tinta/60"
                }`}
              >
                <Icon name={a.kind === "blocked" ? "lock" : a.kind === "version" ? "notes" : a.kind === "system" ? "link" : a.tool ? "sync" : "arrow-right"} size={12} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-tinta/85 leading-snug">{a.text}</p>
                <p className="text-[10px] text-tinta/45 mt-0.5">
                  {a.tool ? TOOLS[a.tool].name : a.kind === "blocked" ? "Capacity guard" : a.kind === "system" ? "Integrations" : a.who ? firstName(a.who) : "Manual"}
                  {a.detail ? ` · ${a.detail}` : ""} · {a.when}
                </p>
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="text-xs text-tinta/45">Nothing here yet.</li>}
        </ul>

        <button
          onClick={onSimulate}
          disabled={!canSimulate}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-lalim/30 text-xs font-semibold text-lalim/80 hover:text-laot hover:border-laot cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          title="Demo control: stands in for live events from your connected apps"
        >
          <Icon name="sync" size={13} /> {canSimulate ? "Simulate app activity" : "Connect an app to see activity"}
        </button>
      </Section>
      </div>
      </div>
    </aside>
  );
}
