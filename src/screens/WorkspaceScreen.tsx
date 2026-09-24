import { useEffect, useState } from "react";
import AvatarPlaceholder from "../components/AvatarPlaceholder";
import Icon from "../components/Icon";
import VerifiedBadge from "../components/VerifiedBadge";
import Sheet, { fieldInput, fieldLabel, primaryBtn, ghostBtn } from "../components/Sheet";
import BoardView, { STATUS_LABEL, SourceChip } from "./workspace/BoardView";
import FocusView from "./workspace/FocusView";
import TimelineView from "./workspace/TimelineView";
import { CapacityPanel, HubRail } from "./workspace/Panels";
import { AgreementsTab, DecisionsTab } from "./workspace/Collab";
import {
  DOING_LIMIT,
  EVENT_SCRIPT,
  INITIAL_ACTIVITY,
  INITIAL_AGREEMENTS,
  INITIAL_DECISIONS,
  INITIAL_LINKS,
  INITIAL_TASKS,
  MAX_TOOLS,
  ME,
  SPRINT,
  TEAM,
  TOOLS,
  TODAY,
  canStart,
  canTake,
  ceilingOf,
  riskOf,
  dayLabel,
  eventApplies,
  firstName,
  loadOf,
  member,
  tally,
} from "./workspace/model";
import type { Activity, Agreement, Comment, Decision, ProjectLink, Status, Task, ToolId, ViewMode } from "./workspace/model";

/* ------------------------------------------------------------------ */
/*  Links with per-link version history (unchanged behaviour)          */
/* ------------------------------------------------------------------ */

const DISCIPLINES = ["Tech & Data", "Research", "Design", "Marketing"];
const withProtocol = (u: string) => (/^https?:\/\//.test(u) ? u : `https://${u}`);
const VIEWS: { id: ViewMode; label: string; icon: "terminal" | "columns" | "gantt"; who: string }[] = [
  { id: "focus", label: "Focus", icon: "terminal", who: "My tasks, nothing else" },
  { id: "board", label: "Board", icon: "columns", who: "Everyone's work by status" },
  { id: "timeline", label: "Timeline", icon: "gantt", who: "Dates, owners, capacity" },
];

let uid = 100;
const nextUid = () => `x${uid++}`;

/* ------------------------------------------------------------------ */
/*  Screen                                                             */
/* ------------------------------------------------------------------ */

export default function WorkspaceScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  /* ---- core data ---- */
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [connected, setConnected] = useState<ToolId[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [fired, setFired] = useState<string[]>([]);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  const [decisions, setDecisions] = useState<Decision[]>(INITIAL_DECISIONS);

  /* ---- adaptive interface ---- */
  const [viewer, setViewer] = useState(ME);
  const [view, setView] = useState<ViewMode>(member(ME).view);
  const [tab, setTab] = useState<"tasks" | "decisions" | "agreements">("tasks");

  /* ---- header / misc ---- */
  const [shipped, setShipped] = useState(false);
  const [confirmShip, setConfirmShip] = useState(false);
  const [outputLink, setOutputLink] = useState("drive.google.com/studysched-pilot");
  const [toolPicker, setToolPicker] = useState(false);
  const [drawer, setDrawer] = useState<"info" | "crew" | null>(null);
  // Project hub (right rail): open by default on Board; Focus and Timeline start collapsed
  const [hubOpen, setHubOpen] = useState<Record<ViewMode, boolean>>({ focus: false, board: true, timeline: false });
  const [fileTaskId, setFileTaskId] = useState<number | null>(null);
  const [onlyMine, setOnlyMine] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [notice, setNotice] = useState<{ text: string; tone: "ok" | "block" } | null>(null);

  /* ---- links ---- */
  const [links, setLinks] = useState<ProjectLink[]>(INITIAL_LINKS);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [updNote, setUpdNote] = useState("");
  const [updUrl, setUpdUrl] = useState("");
  const [linkSheet, setLinkSheet] = useState(false);
  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  /* ---- task sheets ---- */
  const [openTaskId, setOpenTaskId] = useState<number | null>(null);
  const [addStatus, setAddStatus] = useState<Status | null>(null);
  const [nt, setNt] = useState({ title: "", owner: ME, estimate: 2, priority: "medium" as Task["priority"], tool: "" as ToolId | "", ref: "", due: 28 });

  const openTask = tasks.find((t) => t.id === openTaskId) ?? null;
  const say = (text: string, tone: "ok" | "block" = "ok") => setNotice({ text, tone });
  const log = (a: Omit<Activity, "id" | "when">) => setActivity((xs) => [{ ...a, id: nextUid(), when: "Just now" }, ...xs]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3800);
    return () => clearTimeout(t);
  }, [notice]);

  /* ================= Zero-UI: background events from connected tools ================= */
  const pendingEvent = EVENT_SCRIPT.find((e) => !fired.includes(e.id) && connected.includes(e.tool) && eventApplies(e, tasks));

  const fireNext = () => {
    const e = pendingEvent;
    if (!e) return;
    if (e.linkId) {
      // Automated version: an edit in the connected app becomes a new version of the link
      const l = links.find((x) => x.id === e.linkId);
      if (l) {
        const v = l.history[0].v + 1;
        setLinks((ls) => ls.map((x) => (x.id === e.linkId ? { ...x, history: [{ v, url: x.history[0].url, note: e.text, by: "MR", when: "Just now", auto: e.tool }, ...x.history] } : x)));
        log({ kind: "version", tool: e.tool, linkId: e.linkId, text: `${l.label} → v${v}`, detail: e.text.split(":")[1]?.trim() || e.text });
      }
      setFired((f) => [...f, e.id]);
      return;
    }
    const t = tasks.find((x) => x.id === e.taskId)!;
    const overLimit = e.to === "doing" && !canStart(tasks, t.owner, t.id).ok;
    setTasks((ts) => ts.map((x) => (x.id === e.taskId ? { ...x, status: e.to!, lastAuto: { tool: e.tool, when: "just now" } } : x)));
    setFired((f) => [...f, e.id]);
    log({ kind: "auto", tool: e.tool, taskId: t.id, text: e.text, detail: `#${t.id} → ${STATUS_LABEL[e.to!]}${overLimit ? " · over Doing limit, flagged" : ""}` });
  };

  useEffect(() => {
    if (!autoSync || !pendingEvent) return;
    const t = setTimeout(fireNext, 9000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSync, pendingEvent?.id, tasks]);

  /* ================= Manual moves (guarded) ================= */
  const moveTask = (t: Task, to: Status) => {
    if (to === "doing" && t.status !== "doing") {
      const c = canStart(tasks, t.owner, t.id);
      if (!c.ok) {
        log({ kind: "blocked", text: `Couldn't start #${t.id}`, detail: c.reason, who: viewer });
        return say(`${c.reason}. Finish one first.`, "block");
      }
    }
    if (t.status === "done" && to !== "done") {
      const c = canTake(tasks, t.owner, t.estimate, t.id);
      if (!c.ok) {
        log({ kind: "blocked", text: `Couldn't reopen #${t.id}`, detail: c.reason, who: viewer });
        return say(`${c.reason}.`, "block");
      }
    }
    setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, status: to, lastAuto: undefined } : x)));
    log({ kind: "manual", who: viewer, taskId: t.id, text: `${firstName(viewer)} moved #${t.id} by hand`, detail: `→ ${STATUS_LABEL[to]}` });
  };

  /* ================= Capacity-guarded edits ================= */
  const updateTask = (t: Task, patch: Partial<Task>) => {
    const owner = patch.owner ?? t.owner;
    const est = patch.estimate ?? t.estimate;
    if (t.status !== "done") {
      const c = canTake(tasks, owner, est, t.id);
      if (!c.ok) {
        log({ kind: "blocked", text: `Assignment blocked on #${t.id}`, detail: c.reason, who: viewer });
        return say(`${c.reason}. Pick someone with room or cut the estimate.`, "block");
      }
      if (t.status === "doing" && patch.owner && patch.owner !== t.owner) {
        const s = canStart(tasks, owner);
        if (!s.ok) return say(`${s.reason}.`, "block");
      }
    }
    setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, ...patch } : x)));
    if (patch.owner && patch.owner !== t.owner) log({ kind: "manual", who: viewer, text: `#${t.id} handed to ${firstName(patch.owner)}`, detail: "single owner" });
  };

  const ntCheck = canTake(tasks, nt.owner, nt.estimate);
  const ntStart = addStatus === "doing" ? canStart(tasks, nt.owner) : { ok: true, reason: "" };
  const ntValid = nt.title.trim() && ntCheck.ok && ntStart.ok;

  const addTask = () => {
    if (!addStatus || !ntValid) return;
    const id = Math.max(...tasks.map((t) => t.id)) + 1;
    setTasks((ts) => [
      ...ts,
      {
        id,
        title: nt.title.trim(),
        owner: nt.owner,
        status: addStatus,
        estimate: nt.estimate,
        start: Math.max(TODAY, SPRINT.start),
        due: nt.due,
        priority: nt.priority,
        source: nt.tool ? { tool: nt.tool, ref: nt.ref.trim() || nt.title.trim() } : undefined,
      },
    ]);
    log({ kind: "manual", who: viewer, text: `${firstName(viewer)} added #${id} for ${firstName(nt.owner)}`, detail: `${nt.estimate}h` });
    setAddStatus(null);
    setNt({ title: "", owner: ME, estimate: 2, priority: "medium", tool: "", ref: "", due: 28 });
  };

  /* ================= Tools (integrations) ================= */
  const toggleTool = (id: ToolId) => {
    if (connected.includes(id)) {
      setConnected((c) => c.filter((x) => x !== id));
      log({ kind: "system", text: `Disconnected ${TOOLS[id].name}` });
      return;
    }
    if (connected.length >= MAX_TOOLS) return say(`You can connect up to ${MAX_TOOLS} tools.`, "block");
    setConnected((c) => [...c, id]);
    const n = tasks.filter((t) => t.source?.tool === id && t.status !== "done").length;
    log({ kind: "system", text: `Connected ${TOOLS[id].name}`, detail: `${n} open task${n === 1 ? "" : "s"} now auto-tracked` });
  };

  /* ================= Decisions + agreements ================= */
  const vote = (id: string, option: number) =>
    setDecisions((ds) =>
      ds.map((d) => {
        if (d.id !== id) return d;
        const votes = { ...d.votes, [viewer]: option };
        const next = { ...d, votes };
        if (Object.keys(votes).length === TEAM.length) return { ...next, status: "decided" as const, outcome: tally(next).winner };
        return next;
      }),
    );
  const closeDecision = (id: string) => setDecisions((ds) => ds.map((d) => (d.id === id ? { ...d, status: "decided", outcome: tally(d).winner } : d)));
  const decisionsFor = (taskId: number) => decisions.filter((d) => d.taskIds.includes(taskId)).length;
  const openDecisions = decisions.filter((d) => d.status === "open").length;

  /* ================= Links ================= */
  const openLink = links.find((l) => l.id === historyId) ?? null;
  const cur = (l: ProjectLink) => l.history[0];
  const pushVersion = (id: string, url: string, note: string) => {
    const l = links.find((x) => x.id === id);
    if (!l) return;
    const v = cur(l).v + 1;
    setLinks((ls) => ls.map((x) => (x.id === id ? { ...x, history: [{ v, url, note, by: viewer, when: "Just now" }, ...x.history] } : x)));
    log({ kind: "version", who: viewer, linkId: id, text: `${l.label} → v${v}`, detail: note });
  };
  const reply = (text: string): Comment => ({ id: nextUid(), by: viewer, text, when: "Just now" });
  const fileTask = tasks.find((t) => t.id === fileTaskId) ?? null;

  /* ================= Derived ================= */
  const allCards = tasks.length;
  const doneCards = tasks.filter((t) => t.status === "done").length;
  const openTasks = allCards - doneCards;
  const tracked = tasks.filter((t) => t.source && connected.includes(t.source.tool)).length;
  const risks = TEAM.map((m) => ({ m, r: riskOf(tasks, m) }));
  const atCeiling = risks.filter((x) => x.r.level === "at");
  const healthy = risks.filter((x) => x.r.level === "healthy").length;
  const needVote = decisions.filter((d) => d.status === "open" && d.votes[viewer] === undefined);
  const needAck = agreements.filter((a) => !a.acks.includes(viewer));
  const autoCount = activity.filter((a) => a.kind === "auto").length;
  const openDrawer = (d: "info" | "crew") => setDrawer(d);
  const showHub = tab === "tasks" && hubOpen[view];
  const visibleTasks = onlyMine ? tasks.filter((t) => t.owner === viewer) : tasks;
  const myCount = tasks.filter((t) => t.owner === viewer && t.status !== "done").length;

  /* Only surface what needs action right now */
  const alerts: { id: string; text: string; action: string; go: () => void }[] = [
    ...atCeiling.map(({ m, r }) => ({
      id: `cap-${m.initials}-${r.load}`,
      text: `${firstName(m.initials)} is at the ${r.ceiling}h ceiling. New assignments to ${firstName(m.initials)} are blocked.`,
      action: "View crew",
      go: () => openDrawer("crew"),
    })),
    ...needVote.map((d) => ({
      id: `vote-${d.id}-${viewer}`,
      text: `“${d.title}” needs your vote by ${d.due}.`,
      action: "Vote",
      go: () => setTab("decisions"),
    })),
    ...(needAck.length
      ? [{ id: `ack-${viewer}-${needAck.length}`, text: `${needAck.length} working agreement${needAck.length === 1 ? "" : "s"} waiting on you.`, action: "Review", go: () => setTab("agreements") }]
      : []),
  ].filter((a) => !dismissed.includes(a.id));

  const switchViewer = (i: string) => {
    setViewer(i);
    setView(member(i).view);
  };

  return (
    <div className="h-full flex flex-col bg-layag overflow-hidden">
      {/* ================= HEADER — one line ================= */}
      <header className="bg-dagat px-6 h-16 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <h1 className="font-display text-[24px] text-layag truncate">AI Study Scheduler</h1>
          {shipped && (
            <span className="shrink-0">
              <VerifiedBadge subtitle={false} />
            </span>
          )}
          <span className="hidden md:inline text-[11px] font-semibold text-layag/60 whitespace-nowrap shrink-0">
            {SPRINT.name} · due Sep 30
          </span>
        </div>
        <button
          onClick={() => openDrawer("info")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-layag/80 hover:text-layag border border-layag/20 hover:border-layag/40 px-3.5 py-2 rounded-full cursor-pointer whitespace-nowrap shrink-0"
        >
          <Icon name="doc" size={14} /> Project info
          {connected.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] text-layag/70">
              · <span className={`w-1.5 h-1.5 rounded-full ${autoSync ? "bg-[#7FC4BD] animate-pulse" : "bg-layag/40"}`} /> {connected.length} tool{connected.length === 1 ? "" : "s"}
            </span>
          )}
        </button>
        <button
          onClick={() => !shipped && setConfirmShip(true)}
          className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full shrink-0 whitespace-nowrap ${
            shipped ? "bg-layag/10 text-layag/70 cursor-default" : "bg-layag text-dagat hover:bg-white cursor-pointer"
          }`}
        >
          {shipped ? (
            <>
              <Icon name="check" size={15} strokeWidth={2.2} /> Reached the shore
            </>
          ) : (
            "Mark as Shipped"
          )}
        </button>
      </header>

      {/* ================= TOOLBAR — tabs · view · pills · viewer ================= */}
      <div className="px-6 pt-4 pb-3 flex items-center gap-3 flex-nowrap overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 bg-white border border-buhangin rounded-full p-1 shrink-0">
          {(
            [
              ["tasks", "Tasks", 0],
              ["decisions", "Decisions", needVote.length],
              ["agreements", "Agreements", needAck.length],
            ] as const
          ).map(([id, label, badge]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                tab === id ? "bg-dagat text-layag" : "text-tinta/65 hover:text-tinta"
              }`}
            >
              {label}
              {badge > 0 && (
                <span className={`w-4 h-4 text-[10px] rounded-full inline-flex items-center justify-center ${tab === id ? "bg-layag/20" : "bg-laot text-layag"}`}>{badge}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "tasks" && (
          <div className="flex items-center gap-1 bg-white border border-buhangin rounded-full p-1 shrink-0" aria-label="View">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                title={v.who}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer inline-flex items-center gap-1.5 ${
                  view === v.id ? "bg-laot text-layag" : "text-tinta/65 hover:text-tinta"
                }`}
              >
                <Icon name={v.icon} size={13} /> {v.label}
              </button>
            ))}
          </div>
        )}

        {tab === "tasks" && view !== "focus" && (
          <button
            onClick={() => setOnlyMine((v) => !v)}
            aria-pressed={onlyMine}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 border cursor-pointer whitespace-nowrap shrink-0 ${
              onlyMine ? "bg-laot text-layag border-laot" : "bg-white text-tinta border-buhangin hover:border-lalim/50"
            }`}
          >
            <AvatarPlaceholder size={16} initials={viewer} />
            My tasks
            <span className={onlyMine ? "text-layag/75" : "text-tinta/50"}>{myCount} open</span>
          </button>
        )}

        <div className="ml-auto flex items-center gap-2 shrink-0">
          {/* Summary pills — hidden in Focus so makers only see their list */}
          {(
            <>
              {!(tab === "tasks" && view === "focus") && <button
                onClick={() => openDrawer("crew")}
                className="inline-flex items-center gap-2 text-xs font-semibold text-tinta bg-white border border-buhangin rounded-full pl-2 pr-3 py-1.5 hover:border-lalim/50 cursor-pointer whitespace-nowrap"
              >
                <span className="flex -space-x-1.5">
                  {TEAM.map((m) => (
                    <AvatarPlaceholder key={m.initials} size={18} initials={m.initials} ring />
                  ))}
                </span>
                Crew
                <span className={atCeiling.length ? "text-sabit" : "text-laot"}>
                  {atCeiling.length ? `${healthy} healthy · ${atCeiling.length} at ceiling` : `${healthy} healthy`}
                </span>
              </button>}
              {tab === "tasks" && (
                <button
                  onClick={() => setHubOpen((h) => ({ ...h, [view]: !h[view] }))}
                  aria-pressed={showHub}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3 py-1.5 cursor-pointer whitespace-nowrap border ${
                    showHub ? "bg-dagat text-layag border-dagat" : "bg-white text-tinta border-buhangin hover:border-lalim/50"
                  }`}
                >
                  <Icon name="sync" size={13} className={showHub ? "text-layag" : "text-laot"} />
                  Project hub
                  <span className={showHub ? "text-layag/70" : "text-tinta/50"}>
                    {connected.length} app{connected.length === 1 ? "" : "s"} · {autoCount} auto
                  </span>
                </button>
              )}
            </>
          )}
          <div className="relative">
            <select
              value={viewer}
              onChange={(e) => switchViewer(e.target.value)}
              aria-label="Viewing as"
              className="appearance-none text-xs font-semibold text-tinta bg-white border border-buhangin rounded-full pl-3 pr-8 py-1.5 cursor-pointer focus:outline-none focus:border-laot"
            >
              {TEAM.map((m) => (
                <option key={m.initials} value={m.initials}>
                  Viewing as {m.name.split(" ")[0]}
                </option>
              ))}
            </select>
            <Icon name="chevron-down" size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-lalim pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ================= ALERT — only when something needs action ================= */}
      {alerts.length > 0 && !(tab === "tasks" && view === "focus") && (
        <div className="mx-6 mb-3 flex items-center gap-3 rounded-xl bg-white border border-buhangin border-l-4 border-l-sabit px-4 py-2 shrink-0 flex-nowrap overflow-hidden">
          <Icon name="alert" size={15} className="text-sabit shrink-0" />
          <span className="text-xs text-tinta truncate flex-1">{alerts[0].text}</span>
          {alerts.length > 1 && <span className="text-[11px] text-tinta/45 shrink-0 whitespace-nowrap">+{alerts.length - 1} more</span>}
          <button onClick={alerts[0].go} className="text-xs font-semibold text-dagat hover:text-laot cursor-pointer shrink-0 whitespace-nowrap">
            {alerts[0].action}
          </button>
          <button onClick={() => setDismissed((d) => [...d, alerts[0].id])} aria-label="Dismiss" className="text-tinta/40 hover:text-tinta cursor-pointer shrink-0">
            <Icon name="close" size={13} />
          </button>
        </div>
      )}

      {/* ================= BODY ================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Timeline docks crew capacity — it's the lead's planning view */}
        {tab === "tasks" && view === "timeline" && (
          <aside className="w-[280px] shrink-0 ml-6 mb-6 bg-white border border-buhangin rounded-2xl overflow-y-auto">
            <CapacityPanel tasks={tasks} viewer={viewer} onPick={switchViewer} />
          </aside>
        )}
        <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto px-6 pb-6">
            {tab === "tasks" && view === "board" && (
              <BoardView
                compact={showHub}
                tasks={visibleTasks}
                connected={connected}
                decisionsFor={decisionsFor}
                onOpen={(t) => setOpenTaskId(t.id)}
                onMove={moveTask}
                onAdd={(s) => {
                  setAddStatus(s);
                  setNt((n) => ({ ...n, owner: viewer }));
                }}
              />
            )}
            {tab === "tasks" && view === "focus" && (
              <FocusView tasks={tasks} viewer={viewer} connected={connected} onOpen={(t) => setOpenTaskId(t.id)} onMove={moveTask} />
            )}
            {tab === "tasks" && view === "timeline" && <TimelineView tasks={visibleTasks} onOpen={(t) => setOpenTaskId(t.id)} />}
            {tab === "decisions" && (
              <DecisionsTab
                decisions={decisions}
                tasks={tasks}
                viewer={viewer}
                onVote={vote}
                onClose={closeDecision}
                onOpenTask={(t) => setOpenTaskId(t.id)}
                onCreate={(d) => {
                  const id = nextUid();
                  setDecisions((ds) => [{ ...d, id, votes: {}, status: "open", due: "Sep 26", by: viewer, thread: [] }, ...ds]);
                  return id;
                }}
                onReply={(id, text) => setDecisions((ds) => ds.map((d) => (d.id === id ? { ...d, thread: [...d.thread, reply(text)] } : d)))}
              />
            )}
            {tab === "agreements" && (
              <AgreementsTab
                agreements={agreements}
                viewer={viewer}
                onAck={(id) => setAgreements((as) => as.map((a) => (a.id === id && !a.acks.includes(viewer) ? { ...a, acks: [...a.acks, viewer] } : a)))}
                onAdd={(text) => text && setAgreements((as) => [...as, { id: nextUid(), text, acks: [viewer], by: viewer, thread: [] }])}
                onReply={(id, text) => setAgreements((as) => as.map((a) => (a.id === id ? { ...a, thread: [...a.thread, reply(text)] } : a)))}
              />
            )}
          </div>
        </main>

        {/* Project hub — always mounted so it can slide in/out.
            On Board it takes the space the narrowed columns free up (824px = 3×248 + gaps + padding). */}
        <div
          className="shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
          style={{ width: showHub ? (view === "board" ? "max(320px, calc(100% - 824px))" : "320px") : "0px" }}
          aria-hidden={!showHub}
          inert={!showHub}
        >
            <HubRail
              tasks={tasks}
              connected={connected}
              autoSync={autoSync}
              links={links}
              activity={activity}
              onToggleSync={() => setAutoSync((v) => !v)}
              onManageTools={() => setToolPicker(true)}
              onOpenLink={setHistoryId}
              onOpenFile={setFileTaskId}
              onAddLink={() => setLinkSheet(true)}
              onSimulate={fireNext}
              canSimulate={!!pendingEvent}
              onCollapse={() => setHubOpen((h) => ({ ...h, [view]: false }))}
            />
        </div>
      </div>

      {/* ================= DRAWERS ================= */}
      <Sheet open={drawer === "crew"} onClose={() => setDrawer(null)} eyebrow={`${SPRINT.name} · capacity`} title="Crew" width={400}>
        <CapacityPanel tasks={tasks} viewer={viewer} onPick={(i) => { switchViewer(i); setDrawer(null); }} bare />
      </Sheet>


      <Sheet open={drawer === "info"} onClose={() => setDrawer(null)} eyebrow={`${SPRINT.name} · ${dayLabel(SPRINT.start)} – ${dayLabel(SPRINT.end)}`} title="Project info" width={440}>
        <div className="flex flex-col gap-6">
          <div>
            <p className={fieldLabel}>Description</p>
            <p className="text-sm text-tinta/80">A study scheduler that adapts to each student's pace.</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {DISCIPLINES.map((d) => (
                <span key={d} className="text-[11px] font-medium bg-lalim/10 px-2.5 py-0.5 rounded-full text-lalim">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3">
            <div>
              <label className={fieldLabel}>Output link</label>
              <input value={outputLink} onChange={(e) => setOutputLink(e.target.value)} className={fieldInput} />
            </div>
            <div>
              <label className={fieldLabel}>Deadline</label>
              <input defaultValue="Sep 30, 2026" className={`${fieldInput} w-36`} />
            </div>
          </div>

          <p className="text-xs text-tinta/55">Connected apps, links, and the activity log live in the Project hub on the Tasks tab.</p>
        </div>
      </Sheet>

      {/* ================= NOTICE ================= */}
      {notice && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-[0_12px_32px_-12px_rgba(10,37,50,0.5)] text-sm max-w-[560px] ${
            notice.tone === "block" ? "bg-tinta text-layag" : "bg-laot text-layag"
          }`}
        >
          <Icon name={notice.tone === "block" ? "lock" : "check"} size={16} />
          {notice.text}
        </div>
      )}

      {/* ================= TASK DETAIL ================= */}
      <Sheet open={openTask !== null} onClose={() => setOpenTaskId(null)} eyebrow={openTask ? `#${openTask.id} · ${STATUS_LABEL[openTask.status]}` : ""} title={openTask?.title ?? ""} width={460}>
        {openTask && (
          <div className="flex flex-col gap-6">
            {/* Status */}
            <div>
              <label className={fieldLabel}>Status</label>
              <div className="flex gap-2">
                {(["todo", "doing", "done"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => s !== openTask.status && moveTask(openTask, s)}
                    className={`flex-1 rounded-xl border px-3 py-2 text-sm font-semibold cursor-pointer ${
                      openTask.status === s ? "border-laot bg-laot text-layag" : "border-buhangin bg-white text-tinta hover:border-lalim/50"
                    }`}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
              {openTask.source && connected.includes(openTask.source.tool) ? (
                <p className="text-xs text-laot mt-2 inline-flex items-center gap-1.5">
                  <Icon name="sync" size={12} /> Updates itself from {TOOLS[openTask.source.tool].name}. Buttons are a manual override.
                </p>
              ) : (
                <p className="text-xs text-tinta/50 mt-2">Manual. Connect this task's tool to track it automatically.</p>
              )}
            </div>

            {/* Owner — exactly one, capacity-checked */}
            <div>
              <label className={fieldLabel}>Owner (one per task)</label>
              <div className="flex flex-col gap-1.5">
                {TEAM.map((m) => {
                  const isOwner = m.initials === openTask.owner;
                  const c = canTake(tasks, m.initials, openTask.estimate, openTask.id);
                  const blocked = !isOwner && openTask.status !== "done" && !c.ok;
                  return (
                    <button
                      key={m.initials}
                      disabled={blocked}
                      onClick={() => !isOwner && updateTask(openTask, { owner: m.initials })}
                      className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left ${
                        isOwner ? "border-laot bg-laot/5" : blocked ? "border-buhangin bg-layag/60 opacity-60 cursor-not-allowed" : "border-buhangin hover:border-lalim/50 cursor-pointer"
                      }`}
                    >
                      <AvatarPlaceholder size={24} initials={m.initials} />
                      <span className="flex-1 text-sm font-semibold text-tinta">{m.name}</span>
                      <span className={`text-[11px] tabular-nums ${blocked ? "text-sabit font-semibold" : "text-tinta/55"}`}>
                        {blocked ? (
                          <span className="inline-flex items-center gap-1">
                            <Icon name="lock" size={11} /> {c.after}/{c.ceiling}h
                          </span>
                        ) : (
                          `${loadOf(tasks, m.initials)}/${ceilingOf(m).ceiling}h`
                        )}
                      </span>
                      {isOwner && <Icon name="check" size={14} strokeWidth={2.4} className="text-laot" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimate */}
            <div>
              <label className={fieldLabel}>Estimate</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openTask.estimate > 1 && updateTask(openTask, { estimate: openTask.estimate - 1 })}
                  className="w-9 h-9 rounded-full border border-buhangin text-tinta hover:border-lalim/50 cursor-pointer"
                  aria-label="Less"
                >
                  −
                </button>
                <span className="text-lg font-semibold text-tinta tabular-nums w-12 text-center">{openTask.estimate}h</span>
                <button
                  onClick={() => updateTask(openTask, { estimate: openTask.estimate + 1 })}
                  className="w-9 h-9 rounded-full border border-buhangin text-tinta hover:border-lalim/50 cursor-pointer"
                  aria-label="More"
                >
                  +
                </button>
                <span className="text-xs text-tinta/50">
                  {dayLabel(openTask.start)} – {dayLabel(openTask.due)}
                </span>
              </div>
            </div>

            {/* Source */}
            {openTask.source && (
              <div>
                <label className={fieldLabel}>Where the work happens</label>
                <SourceChip task={openTask} connected={connected} />
                <p className="text-xs text-tinta/55 mt-2">{TOOLS[openTask.source.tool].signals}</p>
                {!connected.includes(openTask.source.tool) && (
                  <button onClick={() => toggleTool(openTask.source!.tool)} className="mt-2 text-xs font-semibold text-dagat hover:text-laot cursor-pointer">
                    Connect {TOOLS[openTask.source.tool].name}
                  </button>
                )}
              </div>
            )}

            {/* Linked decisions */}
            {decisionsFor(openTask.id) > 0 && (
              <div>
                <label className={fieldLabel}>Linked decisions</label>
                <ul className="flex flex-col gap-1.5">
                  {decisions
                    .filter((d) => d.taskIds.includes(openTask.id))
                    .map((d) => (
                      <li key={d.id}>
                        <button
                          onClick={() => {
                            setOpenTaskId(null);
                            setTab("decisions");
                          }}
                          className="w-full text-left rounded-xl bg-layag border border-buhangin px-3 py-2 hover:border-lalim/50 cursor-pointer"
                        >
                          <span className="text-sm font-semibold text-tinta">{d.title}</span>
                          <span className="block text-[11px] text-tinta/55">
                            {d.status === "open" ? `Open · due ${d.due}` : `Decided: ${d.options[d.outcome ?? 0]}`}
                          </span>
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Sheet>

      {/* ================= ADD TASK ================= */}
      <Sheet
        open={addStatus !== null}
        onClose={() => setAddStatus(null)}
        eyebrow={addStatus ? `New task · ${STATUS_LABEL[addStatus]}` : ""}
        title="Add a task"
        width={460}
        footer={
          <div className="flex items-center justify-between gap-3">
            <span className={`text-xs ${ntCheck.ok && ntStart.ok ? "text-tinta/50" : "text-sabit font-semibold"}`}>
              {!ntCheck.ok ? ntCheck.reason : !ntStart.ok ? ntStart.reason : "One owner, within capacity."}
            </span>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setAddStatus(null)} className={ghostBtn}>
                Cancel
              </button>
              <button onClick={addTask} disabled={!ntValid} className={primaryBtn}>
                Add task
              </button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div>
            <label className={fieldLabel}>Task</label>
            <input autoFocus value={nt.title} onChange={(e) => setNt({ ...nt, title: e.target.value })} placeholder="What needs doing?" className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>Estimate</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 6, 8].map((h) => (
                <button
                  key={h}
                  onClick={() => setNt({ ...nt, estimate: h })}
                  className={`flex-1 rounded-xl border py-2 text-sm font-semibold cursor-pointer ${
                    nt.estimate === h ? "border-laot bg-laot text-layag" : "border-buhangin text-tinta hover:border-lalim/50"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={fieldLabel}>Owner</label>
            <div className="flex flex-col gap-1.5">
              {TEAM.map((m) => {
                const c = canTake(tasks, m.initials, nt.estimate);
                const s = addStatus === "doing" ? canStart(tasks, m.initials) : { ok: true };
                const blocked = !c.ok || !s.ok;
                const sel = nt.owner === m.initials;
                return (
                  <button
                    key={m.initials}
                    disabled={blocked}
                    onClick={() => setNt({ ...nt, owner: m.initials })}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-left ${
                      sel && !blocked ? "border-laot bg-laot/5" : blocked ? "border-buhangin bg-layag/60 opacity-60 cursor-not-allowed" : "border-buhangin hover:border-lalim/50 cursor-pointer"
                    }`}
                  >
                    <AvatarPlaceholder size={24} initials={m.initials} />
                    <span className="flex-1 text-sm font-semibold text-tinta">{m.name}</span>
                    <span className={`text-[11px] tabular-nums ${blocked ? "text-sabit font-semibold inline-flex items-center gap-1" : "text-tinta/55"}`}>
                      {blocked && <Icon name="lock" size={11} />}
                      {!s.ok ? `Doing ${DOING_LIMIT}/${DOING_LIMIT}` : `${c.after}/${c.ceiling}h after`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={fieldLabel}>Tracked in</label>
              <select value={nt.tool} onChange={(e) => setNt({ ...nt, tool: e.target.value as ToolId | "" })} className={`${fieldInput} cursor-pointer`}>
                <option value="">Not linked</option>
                {(Object.keys(TOOLS) as ToolId[]).map((id) => (
                  <option key={id} value={id}>
                    {TOOLS[id].name}
                    {connected.includes(id) ? " · connected" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={fieldLabel}>Due</label>
              <select value={nt.due} onChange={(e) => setNt({ ...nt, due: Number(e.target.value) })} className={`${fieldInput} cursor-pointer`}>
                {Array.from({ length: SPRINT.end - TODAY + 1 }, (_, i) => TODAY + i).map((d) => (
                  <option key={d} value={d}>
                    {dayLabel(d)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {nt.tool && (
            <div>
              <label className={fieldLabel}>File, doc, or PR name</label>
              <input value={nt.ref} onChange={(e) => setNt({ ...nt, ref: e.target.value })} placeholder="e.g. Budget sheet v2" className={fieldInput} />
              <p className="text-xs text-tinta/50 mt-1">{TOOLS[nt.tool].signals}</p>
            </div>
          )}
        </div>
      </Sheet>

      {/* ================= CONNECT TOOLS ================= */}
      <Sheet
        open={toolPicker}
        onClose={() => setToolPicker(false)}
        variant="center"
        width={520}
        eyebrow={`Connected ${connected.length}/${MAX_TOOLS}`}
        title="Connect where the work happens"
      >
        <p className="text-sm text-tinta/65 mb-4">Tasks update themselves from activity in these tools. Nobody has to move a card or post a status update.</p>
        <ul className="flex flex-col gap-2">
          {(Object.keys(TOOLS) as ToolId[]).map((id) => {
            const on = connected.includes(id);
            const full = !on && connected.length >= MAX_TOOLS;
            const n = tasks.filter((t) => t.source?.tool === id && t.status !== "done").length;
            return (
              <li key={id} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${on ? "border-laot bg-laot/5" : "border-buhangin"}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-tinta">
                    {TOOLS[id].name}
                    {n > 0 && <span className="ml-2 text-[11px] font-semibold text-lalim">{n} open task{n === 1 ? "" : "s"} linked</span>}
                  </p>
                  <p className="text-[11px] text-tinta/55 truncate">{TOOLS[id].signals}</p>
                </div>
                <button
                  onClick={() => toggleTool(id)}
                  disabled={full}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full shrink-0 ${
                    on ? "bg-white border border-buhangin text-tinta hover:border-lalim/50 cursor-pointer" : full ? "bg-buhangin text-tinta/40 cursor-not-allowed" : "bg-laot text-layag hover:bg-dagat cursor-pointer"
                  }`}
                >
                  {on ? "Disconnect" : full ? "Limit reached" : "Connect"}
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>

      {/* ================= FILE FROM A CONNECTED APP ================= */}
      <Sheet
        open={fileTask !== null}
        onClose={() => setFileTaskId(null)}
        eyebrow={fileTask?.source ? `${TOOLS[fileTask.source.tool].name} · automated log` : ""}
        title={fileTask?.source?.ref ?? ""}
        width={440}
      >
        {fileTask && fileTask.source && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-buhangin/60 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Linked to task</p>
                <button
                  onClick={() => {
                    setFileTaskId(null);
                    setOpenTaskId(fileTask.id);
                  }}
                  className="text-sm font-semibold text-tinta hover:text-laot truncate mt-0.5 cursor-pointer text-left"
                >
                  #{fileTask.id} {fileTask.title}
                </button>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white text-tinta shrink-0">{STATUS_LABEL[fileTask.status]}</span>
            </div>
            <div>
              <p className={fieldLabel}>What moves this task</p>
              <p className="text-sm text-tinta/70">{TOOLS[fileTask.source.tool].signals}</p>
            </div>
            <div>
              <p className={fieldLabel}>Log</p>
              <ol className="flex flex-col">
                {activity
                  .filter((a) => a.taskId === fileTask.id)
                  .map((a, i, arr) => (
                    <li key={a.id} className="flex gap-3 pb-4 last:pb-0 relative">
                      {i < arr.length - 1 && <span className="absolute left-[7px] top-4 bottom-0 w-px bg-buhangin" />}
                      <span className={`mt-1 w-[15px] h-[15px] rounded-full border-2 shrink-0 ${a.tool ? "bg-laot border-laot" : "bg-white border-lalim/40"}`} />
                      <div className="min-w-0">
                        <p className="text-sm text-tinta/85">{a.text}</p>
                        <p className="text-[11px] text-tinta/45 mt-0.5">
                          {a.tool ? `Auto · ${TOOLS[a.tool].name}` : "Manual"}
                          {a.detail ? ` · ${a.detail}` : ""} · {a.when}
                        </p>
                      </div>
                    </li>
                  ))}
                {activity.filter((a) => a.taskId === fileTask.id).length === 0 && (
                  <li className="text-sm text-tinta/45">No activity yet. It will appear here as work happens in {TOOLS[fileTask.source.tool].name}.</li>
                )}
              </ol>
            </div>
          </div>
        )}
      </Sheet>

      {/* ================= LINK HISTORY ================= */}
      <Sheet open={openLink !== null} onClose={() => setHistoryId(null)} eyebrow="Version history" title={openLink?.label ?? ""} width={440}>
        {openLink && (
          <div className="flex flex-col gap-6">
            <div className="p-4 rounded-xl bg-buhangin/60 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Current · v{cur(openLink).v}</p>
                <p className="text-sm font-semibold text-tinta truncate mt-0.5">{cur(openLink).url}</p>
              </div>
              <a
                href={withProtocol(cur(openLink).url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-layag bg-laot px-3.5 py-2 rounded-full hover:bg-dagat shrink-0"
              >
                Open <Icon name="arrow-up-right" size={13} />
              </a>
            </div>
            {openLink.tool && (
              <p className={`text-xs -mt-3 inline-flex items-center gap-1.5 ${connected.includes(openLink.tool) ? "text-laot" : "text-tinta/50"}`}>
                <Icon name="sync" size={12} />
                {connected.includes(openLink.tool)
                  ? `Edits in ${TOOLS[openLink.tool].name} are versioned here automatically.`
                  : `Connect ${TOOLS[openLink.tool].name} to version this link automatically.`}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <div>
                <label className={fieldLabel}>What changed?</label>
                <input value={updNote} onChange={(e) => setUpdNote(e.target.value)} placeholder="Added budget section" className={fieldInput} />
              </div>
              <div>
                <label className={fieldLabel}>New URL (optional)</label>
                <input value={updUrl} onChange={(e) => setUpdUrl(e.target.value)} placeholder={cur(openLink).url} className={fieldInput} />
              </div>
              <div className="flex justify-end">
                <button
                  disabled={!updNote.trim()}
                  className={primaryBtn}
                  onClick={() => {
                    pushVersion(openLink.id, updUrl.trim() || cur(openLink).url, updNote.trim());
                    setUpdNote("");
                    setUpdUrl("");
                  }}
                >
                  Log update
                </button>
              </div>
            </div>
            <ol className="flex flex-col">
              {openLink.history.map((h, i) => (
                <li key={h.v} className="flex gap-3 pb-5 last:pb-0 relative">
                  {i < openLink.history.length - 1 && <span className="absolute left-[7px] top-4 bottom-0 w-px bg-buhangin" />}
                  <span className={`mt-1 w-[15px] h-[15px] rounded-full border-2 shrink-0 ${i === 0 ? "bg-laot border-laot" : "bg-white border-lalim/40"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm font-semibold text-tinta">
                        v{h.v}
                        {i === 0 && <span className="ml-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-laot">Current</span>}
                      </span>
                      <span className="text-[11px] text-tinta/45 shrink-0">{h.when}</span>
                    </div>
                    <p className="text-sm text-tinta/75 mt-0.5">{h.note}</p>
                    <p className="text-[11px] text-tinta/50 truncate mt-1 inline-flex items-center gap-1">
                      {h.auto ? (
                        <>
                          <Icon name="sync" size={11} className="text-laot" /> Auto from {TOOLS[h.auto].name}
                        </>
                      ) : (
                        member(h.by).name
                      )}{" "}
                      · {h.url}
                    </p>
                    {i > 0 && h.url !== cur(openLink).url && (
                      <button onClick={() => pushVersion(openLink.id, h.url, `Restored v${h.v}`)} className="mt-1.5 text-xs font-semibold text-dagat hover:text-laot cursor-pointer">
                        Restore this version
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Sheet>

      <Sheet
        open={linkSheet}
        onClose={() => setLinkSheet(false)}
        variant="center"
        width={440}
        eyebrow="Links"
        title="Add a link"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setLinkSheet(false)} className={ghostBtn}>
              Cancel
            </button>
            <button
              disabled={!linkLabel.trim() || !linkUrl.trim()}
              className={primaryBtn}
              onClick={() => {
                setLinks((ls) => [...ls, { id: nextUid(), label: linkLabel.trim(), history: [{ v: 1, url: linkUrl.trim(), note: "Link added", by: viewer, when: "Today" }] }]);
                setLinkLabel("");
                setLinkUrl("");
                setLinkSheet(false);
              }}
            >
              Add link
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-5">
          <div>
            <label className={fieldLabel}>Label</label>
            <input value={linkLabel} onChange={(e) => setLinkLabel(e.target.value)} placeholder="Budget sheet" className={fieldInput} />
          </div>
          <div>
            <label className={fieldLabel}>URL</label>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="docs.google.com/..." className={fieldInput} />
          </div>
        </div>
      </Sheet>

      {/* ================= CONFIRM SHIP ================= */}
      <Sheet
        open={confirmShip}
        onClose={() => setConfirmShip(false)}
        variant="center"
        width={460}
        eyebrow="Show"
        title="Reached the shore?"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setConfirmShip(false)} className={ghostBtn}>
              Not yet
            </button>
            <button
              disabled={!outputLink.trim()}
              className={primaryBtn}
              onClick={() => {
                setShipped(true);
                setConfirmShip(false);
              }}
            >
              Mark as Shipped
            </button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 text-sm text-tinta/80">
          <p>Your crew will be asked to verify the project. Once verified, it appears as a badge on everyone's profile.</p>
          <div className="p-4 rounded-xl bg-buhangin/60 flex flex-col gap-1.5 text-xs text-tinta/60">
            <span>
              Output: <span className="font-semibold text-tinta">{outputLink || "Add an output link first"}</span>
            </span>
            <span>
              Tasks done:{" "}
              <span className="font-semibold text-tinta">
                {doneCards} of {allCards}
              </span>
            </span>
          </div>
          {openTasks > 0 && <p className="text-xs text-tinta/55">{openTasks} tasks are still open. You can still ship.</p>}
        </div>
      </Sheet>
    </div>
  );
}
