import { useState } from "react";
import type { ReactNode } from "react";
import AvatarPlaceholder from "../../components/AvatarPlaceholder";
import Icon from "../../components/Icon";
import { fieldInput, fieldLabel, primaryBtn } from "../../components/Sheet";
import { TEAM, firstName, member, tally } from "./model";
import type { Agreement, Comment, Decision, Task } from "./model";

/* ------------------------------------------------------------------ */
/*  Shared: two-pane layout + reply thread                             */
/* ------------------------------------------------------------------ */

function TwoPane({ list, detail }: { list: ReactNode; detail: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(300px,380px)_minmax(0,1fr)] gap-5 h-full min-h-0">
      <div className="min-h-0 overflow-y-auto pr-1 flex flex-col gap-2">{list}</div>
      <div className="min-h-0 bg-white border border-buhangin rounded-2xl overflow-hidden flex flex-col">{detail}</div>
    </div>
  );
}

export function Thread({ thread, viewer, onReply, placeholder }: { thread: Comment[]; viewer: string; onReply: (text: string) => void; placeholder: string }) {
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    onReply(draft.trim());
    setDraft("");
  };
  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Discussion</p>
        <span className="text-[11px] text-tinta/45">
          {thread.length} repl{thread.length === 1 ? "y" : "ies"}
        </span>
      </div>
      <ul className="flex-1 min-h-0 overflow-y-auto px-6 flex flex-col gap-4 pb-4">
        {thread.length === 0 && <li className="text-sm text-tinta/45">No replies yet. Start the discussion.</li>}
        {thread.map((c) => (
          <li key={c.id} className="flex gap-3">
            <AvatarPlaceholder size={28} initials={c.by} />
            <div className="min-w-0 flex-1">
              <p className="text-xs">
                <span className="font-semibold text-tinta">{member(c.by).name}</span>
                <span className="text-tinta/45"> · {c.when}</span>
              </p>
              <p className="text-sm text-tinta/85 leading-relaxed mt-0.5">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="px-6 py-4 border-t border-buhangin flex items-center gap-3 bg-layag/50">
        <AvatarPlaceholder size={28} initials={viewer} />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={placeholder}
          className={`${fieldInput} flex-1 py-2.5`}
        />
        <button onClick={send} disabled={!draft.trim()} className={primaryBtn}>
          Reply
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Working agreements                                                 */
/* ------------------------------------------------------------------ */

export function AgreementsTab({
  agreements,
  viewer,
  onAck,
  onAdd,
  onReply,
}: {
  agreements: Agreement[];
  viewer: string;
  onAck: (id: string) => void;
  onAdd: (text: string) => void;
  onReply: (id: string, text: string) => void;
}) {
  const [selId, setSelId] = useState(agreements[0]?.id);
  const [draft, setDraft] = useState("");
  const sel = agreements.find((a) => a.id === selId) ?? agreements[0];
  const fully = agreements.filter((a) => a.acks.length === TEAM.length).length;

  const list = (
    <>
      <div className="mb-2">
        <h2 className="font-display text-[26px] text-tinta">Working agreements</h2>
        <p className="text-xs text-tinta/55 mt-1">
          {fully} of {agreements.length} agreed by the whole crew
        </p>
      </div>
      {agreements.map((a) => {
        const all = a.acks.length === TEAM.length;
        const mine = a.acks.includes(viewer);
        return (
          <button
            key={a.id}
            onClick={() => setSelId(a.id)}
            className={`text-left rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
              sel?.id === a.id ? "border-laot bg-white shadow-[0_6px_16px_-12px_rgba(13,52,70,0.4)]" : "border-buhangin bg-white/70 hover:bg-white"
            }`}
          >
            <p className="text-sm font-semibold text-tinta leading-snug">{a.text}</p>
            <p className="text-[11px] mt-1.5 flex items-center gap-2">
              <span className={all ? "text-laot font-semibold" : "text-tinta/50"}>
                {a.acks.length}/{TEAM.length} agreed
              </span>
              {!mine && <span className="text-[10px] font-semibold text-layag bg-laot px-1.5 py-0.5 rounded-full">Needs you</span>}
              {a.thread.length > 0 && (
                <span className="text-tinta/45">
                  · {a.thread.length} repl{a.thread.length === 1 ? "y" : "ies"}
                </span>
              )}
            </p>
          </button>
        );
      })}
      <div className="mt-2 flex flex-col gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              onAdd(draft.trim());
              setDraft("");
            }
          }}
          placeholder="Propose an agreement…"
          className={fieldInput}
        />
      </div>
    </>
  );

  const detail = sel ? (
    <>
      <div className="px-6 py-5 border-b border-buhangin flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">Proposed by {firstName(sel.by)}</p>
            <h3 className="text-xl font-semibold text-tinta mt-1.5 leading-snug">{sel.text}</h3>
          </div>
          <button
            onClick={() => onAck(sel.id)}
            disabled={sel.acks.includes(viewer)}
            className={`text-sm font-semibold px-4 py-2 rounded-full shrink-0 ${
              sel.acks.includes(viewer) ? "bg-buhangin text-lalim cursor-default" : "bg-laot text-layag hover:bg-dagat cursor-pointer"
            }`}
          >
            {sel.acks.includes(viewer) ? "You agreed" : "I agree"}
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {TEAM.map((m) => {
            const ok = sel.acks.includes(m.initials);
            return (
              <span
                key={m.initials}
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-full pl-1 pr-2.5 py-1 ${ok ? "bg-laot/10 text-laot" : "bg-buhangin/70 text-tinta/50"}`}
              >
                <AvatarPlaceholder size={18} initials={m.initials} />
                {firstName(m.initials)} {ok ? "agreed" : "pending"}
              </span>
            );
          })}
        </div>
      </div>
      <Thread thread={sel.thread} viewer={viewer} onReply={(t) => onReply(sel.id, t)} placeholder="Ask a question or suggest a change…" />
    </>
  ) : null;

  return <TwoPane list={list} detail={detail} />;
}

/* ------------------------------------------------------------------ */
/*  Async decision docs                                                */
/* ------------------------------------------------------------------ */

export function DecisionsTab({
  decisions,
  tasks,
  viewer,
  onVote,
  onClose,
  onCreate,
  onOpenTask,
  onReply,
}: {
  decisions: Decision[];
  tasks: Task[];
  viewer: string;
  onVote: (id: string, option: number) => void;
  onClose: (id: string) => void;
  onCreate: (d: { title: string; context: string; options: string[]; taskIds: number[] }) => string | void;
  onOpenTask: (t: Task) => void;
  onReply: (id: string, text: string) => void;
}) {
  const [selId, setSelId] = useState(decisions[0]?.id);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [options, setOptions] = useState("");
  const [linked, setLinked] = useState<number[]>([]);
  const opts = options.split(",").map((o) => o.trim()).filter(Boolean);
  const valid = title.trim() && opts.length >= 2;
  const isLead = member(viewer).lead;
  const sel = decisions.find((d) => d.id === selId) ?? decisions[0];

  const list = (
    <>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-[26px] text-tinta">Decisions</h2>
          <p className="text-xs text-tinta/55 mt-1">Majority wins; a tie goes to the lead.</p>
        </div>
        <button onClick={() => setCreating(true)} className="inline-flex items-center gap-1 text-xs font-semibold text-dagat hover:text-laot cursor-pointer shrink-0">
          <Icon name="plus" size={13} /> New
        </button>
      </div>
      {decisions.map((d) => {
        const open = d.status === "open";
        const needs = open && d.votes[viewer] === undefined;
        return (
          <button
            key={d.id}
            onClick={() => {
              setSelId(d.id);
              setCreating(false);
            }}
            className={`text-left rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
              !creating && sel?.id === d.id ? "border-laot bg-white shadow-[0_6px_16px_-12px_rgba(13,52,70,0.4)]" : "border-buhangin bg-white/70 hover:bg-white"
            }`}
          >
            <span className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${open ? "text-lalim" : "text-laot"}`}>
              {open ? `Open · due ${d.due}` : `Decided · ${d.options[d.outcome ?? 0]}`}
            </span>
            <p className="text-sm font-semibold text-tinta mt-1 leading-snug">{d.title}</p>
            <p className="text-[11px] mt-1.5 flex items-center gap-2 text-tinta/50">
              {Object.keys(d.votes).length}/{TEAM.length} voted
              {needs && <span className="text-[10px] font-semibold text-layag bg-laot px-1.5 py-0.5 rounded-full">Needs your vote</span>}
              {d.thread.length > 0 && <span>· {d.thread.length} repl{d.thread.length === 1 ? "y" : "ies"}</span>}
            </p>
          </button>
        );
      })}
    </>
  );

  const createForm = (
    <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
      <h3 className="text-xl font-semibold text-tinta">New decision</h3>
      <div>
        <label className={fieldLabel}>Question</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Should we…?" className={fieldInput} />
      </div>
      <div>
        <label className={fieldLabel}>Context</label>
        <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={3} placeholder="What's at stake, what we know." className={`${fieldInput} resize-none`} />
      </div>
      <div>
        <label className={fieldLabel}>Options</label>
        <input value={options} onChange={(e) => setOptions(e.target.value)} placeholder="Option A, Option B" className={fieldInput} />
        <p className="text-xs text-tinta/45 mt-1">Separate with commas. At least two.</p>
      </div>
      <div>
        <label className={fieldLabel}>Affects tasks</label>
        <div className="flex flex-wrap gap-1.5">
          {tasks
            .filter((t) => t.status !== "done")
            .map((t) => {
              const on = linked.includes(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => setLinked((l) => (on ? l.filter((x) => x !== t.id) : [...l, t.id]))}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                    on ? "bg-laot text-layag border-laot" : "bg-white text-tinta/70 border-buhangin hover:border-lalim/50"
                  }`}
                >
                  #{t.id} {t.title.length > 30 ? t.title.slice(0, 30) + "…" : t.title}
                </button>
              );
            })}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={() => setCreating(false)} className="text-sm font-semibold text-dagat px-4 py-2 cursor-pointer hover:text-laot">
          Cancel
        </button>
        <button
          disabled={!valid}
          onClick={() => {
            const id = onCreate({ title: title.trim(), context: context.trim(), options: opts, taskIds: linked });
            if (id) setSelId(id);
            setTitle("");
            setContext("");
            setOptions("");
            setLinked([]);
            setCreating(false);
          }}
          className={primaryBtn}
        >
          Post decision
        </button>
      </div>
    </div>
  );

  let detail: ReactNode = null;
  if (creating) detail = createForm;
  else if (sel) {
    const { counts, winner } = tally(sel);
    const open = sel.status === "open";
    const waiting = TEAM.filter((m) => sel.votes[m.initials] === undefined);
    detail = (
      <>
        <div className="px-6 py-5 border-b border-buhangin flex flex-col gap-4 overflow-y-auto max-h-[60%]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-lalim">
                {open ? `Open · due ${sel.due}` : "Decided"} · by {firstName(sel.by)}
              </p>
              <h3 className="text-xl font-semibold text-tinta mt-1.5">{sel.title}</h3>
              {sel.context && <p className="text-sm text-tinta/70 mt-1.5 leading-relaxed">{sel.context}</p>}
            </div>
          </div>

          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(sel.options.length, 3)}, minmax(0, 1fr))` }}>
            {sel.options.map((o, i) => {
              const chosen = !open && sel.outcome === i;
              const mine = sel.votes[viewer] === i;
              const voters = Object.entries(sel.votes).filter(([, v]) => v === i).map(([k]) => k);
              return (
                <button
                  key={i}
                  onClick={() => open && onVote(sel.id, i)}
                  disabled={!open}
                  className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                    chosen ? "border-laot bg-laot/10" : mine ? "border-laot" : "border-buhangin"
                  } ${open ? "cursor-pointer hover:border-lalim/60" : "cursor-default"}`}
                >
                  <span className="text-sm font-semibold text-tinta inline-flex items-center gap-1.5">
                    {chosen && <Icon name="check" size={14} strokeWidth={2.4} className="text-laot" />}
                    {o}
                  </span>
                  <span className="mt-2 flex items-center justify-between">
                    <span className="flex -space-x-1.5">
                      {voters.map((v) => (
                        <AvatarPlaceholder key={v} size={20} initials={v} ring />
                      ))}
                    </span>
                    <span className="text-[11px] text-tinta/55">
                      {counts[i]} vote{counts[i] === 1 ? "" : "s"}
                      {mine && " · you"}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-3 flex-nowrap">
            <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
              <span className="text-[11px] text-tinta/45 shrink-0">Affects</span>
              {sel.taskIds.map((id) => {
                const t = tasks.find((x) => x.id === id);
                return t ? (
                  <button
                    key={id}
                    onClick={() => onOpenTask(t)}
                    className="text-[11px] font-semibold text-dagat bg-layag border border-buhangin px-2 py-0.5 rounded-full hover:text-laot cursor-pointer shrink-0 max-w-[220px] truncate"
                  >
                    #{id} {t.title}
                  </button>
                ) : null;
              })}
            </div>
            {open ? (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-tinta/50">{waiting.length ? `Waiting on ${waiting.map((m) => firstName(m.initials)).join(", ")}` : "Everyone voted"}</span>
                {isLead && (
                  <button onClick={() => onClose(sel.id)} className="text-xs font-semibold text-dagat hover:text-laot cursor-pointer">
                    Close with “{sel.options[winner]}”
                  </button>
                )}
              </div>
            ) : (
              <span className="text-[11px] text-tinta/50 shrink-0">Outcome: {sel.options[sel.outcome ?? 0]}</span>
            )}
          </div>
        </div>
        <Thread thread={sel.thread} viewer={viewer} onReply={(t) => onReply(sel.id, t)} placeholder="Add your reasoning or a question…" />
      </>
    );
  }

  return <TwoPane list={list} detail={detail} />;
}
