/* ------------------------------------------------------------------ */
/*  Build page model — types, demo data, and the rules that enforce    */
/*  capacity ceilings, single ownership, and sprint limits.            */
/* ------------------------------------------------------------------ */

export type Status = "todo" | "doing" | "done";
export type ViewMode = "focus" | "board" | "timeline";
export type ToolId = "github" | "figma" | "gdocs" | "gforms" | "canva" | "notion" | "gdrive" | "m365";

export const ME = "AK";
export const SPRINT = { name: "Sprint 3", start: 22, end: 30 }; // September days
export const TODAY = 24;
export const DOING_LIMIT = 2; // Linear-style individual sprint limit
export const MAX_TOOLS = 5;

/* ---------------- People ---------------- */

export type Member = {
  initials: string;
  name: string;
  role: string;
  lead?: boolean;
  declared: number; // declared weekly hours (Asana / Monday style)
  history: number[]; // hours actually delivered, last 4 sprints
  view: ViewMode; // interface that fits how this person works
};

export const TEAM: Member[] = [
  { initials: "MR", name: "Mika Ramos", role: "Project Lead · Developer", lead: true, declared: 12, history: [11, 12, 10, 11], view: "timeline" },
  { initials: "AK", name: "Andrea Kalaw", role: "UI/UX Designer", declared: 10, history: [8, 9, 7, 8], view: "board" },
  { initials: "SP", name: "Sam Pascual", role: "UX Researcher", declared: 12, history: [7, 8, 6, 7], view: "focus" },
  { initials: "JT", name: "Jolo Tan", role: "Marketing Lead", declared: 8, history: [8, 9, 8, 9], view: "focus" },
];

export const member = (i: string) => TEAM.find((m) => m.initials === i)!;
export const firstName = (i: string) => member(i)?.name.split(" ")[0] ?? i;

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Capacity ceiling = the lower of what they declared and what they have actually delivered. */
export function ceilingOf(m: Member) {
  const delivered = avg(m.history);
  return { ceiling: Math.min(m.declared, Math.floor(delivered)), delivered: Math.round(delivered * 10) / 10 };
}

/* ---------------- Tools (integrations) ---------------- */

export const TOOLS: Record<ToolId, { name: string; tracks: string; signals: string }> = {
  github: { name: "GitHub", tracks: "Repos, pull requests", signals: "PR opened → Doing · PR merged → Done" },
  figma: { name: "Figma", tracks: "Design files", signals: "File edited → Doing · Marked ready → Done" },
  gdocs: { name: "Google Docs", tracks: "Docs and drafts", signals: "Doc edited → Doing · Marked final → Done" },
  gforms: { name: "Google Forms", tracks: "Surveys, sign-ups", signals: "First response → Doing · Target reached → Done" },
  canva: { name: "Canva", tracks: "Graphics, decks", signals: "Design created → Doing · Shared → Done" },
  notion: { name: "Notion", tracks: "Pages, databases", signals: "Page created → Doing · Status set to Done → Done" },
  gdrive: { name: "Google Drive", tracks: "Files and folders", signals: "File uploaded → Doing · Moved to /final → Done" },
  m365: { name: "Microsoft 365", tracks: "Word, Excel, PowerPoint", signals: "File edited → Doing · Marked final → Done" },
};

/* ---------------- Tasks ---------------- */

export type Task = {
  id: number;
  title: string;
  owner: string; // exactly one owner
  status: Status;
  estimate: number; // hours
  start: number; // day of September (31+ = October)
  due: number;
  priority: "low" | "medium" | "high";
  source?: { tool: ToolId; ref: string };
  lastAuto?: { tool: ToolId; when: string };
};

export const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Run 15 student interviews on study habits", owner: "SP", status: "todo", estimate: 4, start: 24, due: 27, priority: "high", source: { tool: "gforms", ref: "Interview sign-up form" } },
  { id: 2, title: "Draft pitch deck for the campus innovation expo", owner: "JT", status: "todo", estimate: 3, start: 25, due: 29, priority: "medium", source: { tool: "gdocs", ref: "Expo pitch deck outline" } },
  { id: 3, title: "Plan launch posts for org partners", owner: "JT", status: "todo", estimate: 2, start: 27, due: 30, priority: "low", source: { tool: "canva", ref: "Launch post set" } },
  { id: 4, title: "Design onboarding and weekly-plan screens", owner: "AK", status: "doing", estimate: 5, start: 20, due: 26, priority: "high", source: { tool: "figma", ref: "Onboarding v3" } },
  { id: 5, title: "Build scheduling prototype for pilot testers", owner: "MR", status: "doing", estimate: 6, start: 19, due: 28, priority: "medium", source: { tool: "github", ref: "studysched/app · PR #14" } },
  { id: 8, title: "Synthesize survey findings", owner: "SP", status: "doing", estimate: 3, start: 21, due: 25, priority: "medium", source: { tool: "gdocs", ref: "Survey findings memo" } },
  { id: 9, title: "Set up pilot feedback channel", owner: "MR", status: "todo", estimate: 2, start: 26, due: 28, priority: "low", source: { tool: "notion", ref: "Pilot feedback database" } },
  { id: 6, title: "Write survey questionnaire (120 responses)", owner: "SP", status: "done", estimate: 3, start: 15, due: 19, priority: "high", source: { tool: "gforms", ref: "Study habits survey" } },
  { id: 7, title: "Apply KollaBayan brand guide v1.0", owner: "AK", status: "done", estimate: 2, start: 16, due: 18, priority: "low", source: { tool: "figma", ref: "Brand kit" } },
];

/** Hours committed = estimates of everything not yet done. */
export const loadOf = (tasks: Task[], owner: string, exceptId?: number) =>
  tasks.filter((t) => t.owner === owner && t.status !== "done" && t.id !== exceptId).reduce((a, t) => a + t.estimate, 0);

export const doingCount = (tasks: Task[], owner: string, exceptId?: number) =>
  tasks.filter((t) => t.owner === owner && t.status === "doing" && t.id !== exceptId).length;

export type Risk = { level: "healthy" | "near" | "at"; label: string; trendingOver: boolean };

export function riskOf(tasks: Task[], m: Member): Risk & { load: number; ceiling: number; delivered: number } {
  const { ceiling, delivered } = ceilingOf(m);
  const load = loadOf(tasks, m.initials);
  const ratio = load / ceiling;
  const trendingOver = delivered > m.declared;
  const level = ratio >= 1 ? "at" : ratio >= 0.8 || trendingOver ? "near" : "healthy";
  const label = level === "at" ? "At ceiling" : level === "near" ? (trendingOver ? "Working past declared hours" : "Near limit") : "Healthy";
  return { level, label, trendingOver, load, ceiling, delivered };
}

/** Can this owner take `hours` more (optionally excluding a task being edited)? */
export function canTake(tasks: Task[], owner: string, hours: number, exceptId?: number) {
  const m = member(owner);
  const { ceiling } = ceilingOf(m);
  const after = loadOf(tasks, owner, exceptId) + hours;
  return { ok: after <= ceiling, after, ceiling, reason: `${m.name.split(" ")[0]} would be at ${after}h of a ${ceiling}h ceiling` };
}

/** Linear-style sprint limit for moving into Doing. */
export function canStart(tasks: Task[], owner: string, exceptId?: number) {
  const n = doingCount(tasks, owner, exceptId);
  return { ok: n < DOING_LIMIT, reason: `${firstName(owner)} already has ${n} tasks in Doing (limit ${DOING_LIMIT})` };
}

/* ---------------- Background activity (simulated webhooks) ---------------- */

/** A background event from a connected tool. Moves a task, or versions a link. */
export type ToolEvent = { id: string; tool: ToolId; text: string } & ({ taskId: number; to: Status; linkId?: never } | { linkId: string; url?: string; taskId?: never; to?: never });

export const EVENT_SCRIPT: ToolEvent[] = [
  { id: "e1", tool: "figma", taskId: 4, to: "done", text: "Andrea marked “Onboarding v3” ready for handoff" },
  { id: "l1", tool: "gdocs", linkId: "brief", text: "Mika edited Project Brief: added pilot timeline" },
  { id: "e2", tool: "gdocs", taskId: 2, to: "doing", text: "Jolo started editing “Expo pitch deck outline”" },
  { id: "e3", tool: "github", taskId: 5, to: "done", text: "Mika merged PR #14 “Weekly plan generator”" },
  { id: "l2", tool: "gdrive", linkId: "files", text: "Sam uploaded “Interview notes batch 1” to Shared Files" },
  { id: "e4", tool: "gforms", taskId: 1, to: "doing", text: "First 6 sign-ups on “Interview sign-up form”" },
  { id: "e5", tool: "gdocs", taskId: 8, to: "done", text: "Sam marked “Survey findings memo” as final" },
  { id: "e6", tool: "canva", taskId: 3, to: "doing", text: "Jolo created “Launch post set”" },
  { id: "e7", tool: "notion", taskId: 9, to: "doing", text: "Mika created “Pilot feedback database”" },
  { id: "e8", tool: "gforms", taskId: 1, to: "done", text: "“Interview sign-up form” reached 15 sign-ups" },
];

const ORDER: Record<Status, number> = { todo: 0, doing: 1, done: 2 };
/** Tools only move work forward; never backwards. */
export const eventApplies = (e: ToolEvent, tasks: Task[]) => {
  if (e.linkId) return true;
  const t = tasks.find((x) => x.id === e.taskId);
  return !!t && t.source?.tool === e.tool && ORDER[e.to] > ORDER[t.status];
};

export type Activity = {
  id: string;
  kind: "auto" | "manual" | "blocked" | "system" | "version";
  text: string;
  detail?: string;
  tool?: ToolId;
  who?: string;
  when: string;
  taskId?: number;
  linkId?: string;
};

export const INITIAL_ACTIVITY: Activity[] = [
  { id: "a4", kind: "version", text: "Project Brief updated to v3", detail: "Narrowed scope", who: "MR", linkId: "brief", when: "Sep 22" },
  { id: "a3", kind: "auto", tool: "gdocs", text: "Sam started “Survey findings memo”", detail: "#8 → Doing", taskId: 8, when: "Sep 21" },
  { id: "a1", kind: "auto", tool: "gforms", text: "“Study habits survey” reached 120 responses", detail: "#6 → Done", taskId: 6, when: "Sep 19" },
  { id: "a2", kind: "auto", tool: "figma", text: "Andrea marked “Brand kit” ready", detail: "#7 → Done", taskId: 7, when: "Sep 18" },
];

/* ---------------- Working agreements + decisions (Notion style) ---------------- */

export type Comment = { id: string; by: string; text: string; when: string };

export type Agreement = { id: string; text: string; acks: string[]; by: string; thread: Comment[] };

export const INITIAL_AGREEMENTS: Agreement[] = [
  { id: "g1", text: "One owner per task. Help is welcome; ownership isn't shared.", acks: ["MR", "AK", "SP", "JT"], by: "MR", thread: [] },
  {
    id: "g2",
    text: `Max ${DOING_LIMIT} tasks in Doing per person per sprint.`,
    acks: ["MR", "AK", "SP"],
    by: "MR",
    thread: [
      { id: "c1", by: "JT", text: "Can launch posts count as one task? Scheduling them is tiny.", when: "Sep 22" },
      { id: "c2", by: "MR", text: "Yes, bundle them as one card. The limit is about focus, not size.", when: "Sep 22" },
    ],
  },
  {
    id: "g3",
    text: "Status comes from our tools. No status-update meetings.",
    acks: ["MR", "AK"],
    by: "AK",
    thread: [{ id: "c3", by: "SP", text: "Interviews happen offline. How does that show up?", when: "Sep 23" }],
  },
  { id: "g4", text: "Capacity ceilings are final. If you're at yours, say no.", acks: ["MR", "SP", "JT"], by: "SP", thread: [] },
  { id: "g5", text: "Big calls go in a decision doc. Reply within 24 hours.", acks: ["MR", "AK", "SP", "JT"], by: "MR", thread: [] },
];

export type Decision = {
  id: string;
  title: string;
  context: string;
  options: string[];
  votes: Record<string, number>; // initials → option index
  status: "open" | "decided";
  outcome?: number;
  due: string;
  by: string;
  taskIds: number[];
  thread: Comment[];
};

export const INITIAL_DECISIONS: Decision[] = [
  {
    id: "d1",
    title: "Pilot with 2 orgs or 4?",
    context: "Two orgs gives deeper feedback and fits our capacity. Four gives more data but Sam is already at his ceiling.",
    options: ["2 orgs, deeper feedback", "4 orgs, more data"],
    votes: { MR: 0, SP: 0 },
    status: "open",
    due: "Sep 26",
    by: "MR",
    taskIds: [1, 9],
    thread: [
      { id: "c4", by: "SP", text: "I can only run interviews for 2 orgs within my hours. 4 would need a second researcher.", when: "Sep 23" },
      { id: "c5", by: "MR", text: "Agreed. Andrea, you know the org heads. Any preference?", when: "Sep 23" },
    ],
  },
  {
    id: "d2",
    title: "Keep reminders in v1?",
    context: "Survey says cramming is the top pain point. Reminders are the direct fix, but cost 3 extra build hours.",
    options: ["Keep reminders", "Move to v2"],
    votes: { MR: 0, AK: 0, SP: 0, JT: 1 },
    status: "decided",
    outcome: 0,
    due: "Sep 21",
    by: "MR",
    taskIds: [5],
    thread: [{ id: "c6", by: "JT", text: "Fine with keeping them. I voted v2 only because of the deadline.", when: "Sep 20" }],
  },
];

/** Majority wins; a tie goes to the lead's vote. */
export function tally(d: Decision) {
  const counts = d.options.map((_, i) => Object.values(d.votes).filter((v) => v === i).length);
  const max = Math.max(...counts);
  const leaders = counts.flatMap((c, i) => (c === max ? [i] : []));
  const lead = TEAM.find((m) => m.lead)!.initials;
  const winner = leaders.length === 1 ? leaders[0] : d.votes[lead] ?? leaders[0];
  return { counts, winner };
}

/* ---------------- Dates ---------------- */

export const dayLabel = (d: number) => (d > 30 ? `Oct ${d - 30}` : `Sep ${d}`);

/* ---------------- Links with automated version history ---------------- */

export type Version = { v: number; url: string; note: string; by: string; when: string; auto?: ToolId };
/** A link can be tied to a tool; when that tool is connected, edits there become versions here. */
export type ProjectLink = { id: string; label: string; tool?: ToolId; history: Version[] };

export const INITIAL_LINKS: ProjectLink[] = [
  {
    id: "brief",
    label: "Project Brief",
    tool: "gdocs",
    history: [
      { v: 3, url: "docs.google.com/d/brief", note: "Narrowed scope to weekly plan + reminders", by: "MR", when: "Sep 22" },
      { v: 2, url: "docs.google.com/d/brief", note: "Added pilot orgs and success metrics", by: "SP", when: "Sep 18" },
      { v: 1, url: "docs.google.com/d/brief", note: "First draft", by: "MR", when: "Sep 15" },
    ],
  },
  {
    id: "files",
    label: "Shared Files",
    tool: "gdrive",
    history: [
      { v: 2, url: "drive.google.com/drive/studysched", note: "Moved survey results into /research", by: "SP", when: "Sep 21" },
      { v: 1, url: "drive.google.com/drive/studysched", note: "Folder created", by: "MR", when: "Sep 15" },
    ],
  },
  {
    id: "budget",
    label: "Pilot budget",
    history: [{ v: 1, url: "sheets.google.com/budget", note: "Link added", by: "JT", when: "Sep 20" }],
  },
];
