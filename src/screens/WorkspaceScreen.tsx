import { useState } from "react";
import KanbanCard from "../components/KanbanCard";
import AvatarPlaceholder from "../components/AvatarPlaceholder";

const TEAM = [
  { initials: "MR", name: "Maya Rosenberg", role: "ML Engineer" },
  { initials: "JT", name: "Jordan Tate", role: "React Developer" },
  { initials: "SP", name: "Sione Palu", role: "Backend" },
  { initials: "AK", name: "Arjun Kapoor", role: "UI/UX Designer" },
];

const INITIAL_BOARD = {
  todo: [
    { id: 1, title: "Set up authentication flow with Supabase", assignee: "Sione Palu", initials: "SP", priority: "high" as const },
    { id: 2, title: "Design onboarding wizard screens", assignee: "Arjun Kapoor", initials: "AK", priority: "medium" as const },
    { id: 3, title: "Write project README and contribution guide", assignee: "Jordan Tate", initials: "JT", priority: "low" as const },
  ],
  doing: [
    { id: 4, title: "Train recommendation model on collab dataset", assignee: "Maya Rosenberg", initials: "MR", priority: "high" as const },
    { id: 5, title: "Build discovery feed component with filters", assignee: "Jordan Tate", initials: "JT", priority: "medium" as const },
  ],
  done: [
    { id: 6, title: "Define data schema and ERD", assignee: "Sione Palu", initials: "SP", priority: "high" as const },
    { id: 7, title: "Initial brand + grayscale design system", assignee: "Arjun Kapoor", initials: "AK", priority: "low" as const },
  ],
};

const CHAT = [
  { from: "MR", text: "Just pushed the model weights — accuracy is at 87% on test set.", time: "9:42 AM" },
  { from: "JT", text: "Nice! I'll integrate the API endpoint into the feed today.", time: "9:55 AM" },
  { from: "SP", text: "Auth is blocked on the Supabase RLS policy. Anyone available to pair?", time: "10:12 AM" },
  { from: "AK", text: "I can hop on at 2pm. Also — need feedback on the card designs before EOD.", time: "10:18 AM" },
  { from: "MR", text: "2pm works. Let's also finalize the demo script for the Friday output drop.", time: "10:31 AM" },
];

export default function WorkspaceScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState(CHAT);
  const [shipped, setShipped] = useState(false);
  const [outputLink, setOutputLink] = useState("https://studyschedai.vercel.app");

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages((m) => [...m, { from: "AK", text: chatMsg, time: "Now" }]);
    setChatMsg("");
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* TOP HEADER */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-4 shrink-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-base font-bold text-slate-900 truncate">AI Study Scheduler</h1>
            {shipped && (
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-800 text-white rounded-full">
                Shipped ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 shrink-0">Output Link</label>
              <input
                type="text"
                value={outputLink}
                onChange={(e) => setOutputLink(e.target.value)}
                className="text-xs border border-slate-200 rounded px-2.5 py-1 text-slate-700 w-52 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 shrink-0">Deadline</label>
              <input
                type="text"
                defaultValue="Sep 30, 2026"
                className="text-xs border border-slate-200 rounded px-2.5 py-1 text-slate-700 w-28 focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>
          </div>
        </div>
        <button
          onClick={() => setShipped(true)}
          className={`px-5 py-2 text-sm font-bold rounded transition-colors cursor-pointer shrink-0 ${
            shipped
              ? "bg-slate-200 text-slate-500 cursor-default"
              : "bg-slate-900 text-white hover:bg-slate-700"
          }`}
        >
          {shipped ? "Project Shipped ✓" : "Mark as Shipped"}
        </button>
      </header>

      {/* PROJECT MANAGEMENT DETAILS */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Description</span>
            <span className="text-xs text-slate-700 mt-0.5">Building a smart scheduling tool that adapts to learning pace.</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tech Stack</span>
            <div className="flex gap-1.5 mt-0.5">
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">React</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Python</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">Supabase</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">
            View PRD
          </button>
          <button className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">
            Figma Design
          </button>
          <button className="text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors">
            GitHub Repo
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT DRAWER — Team + Chat */}
        <aside className="w-[240px] shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
          {/* Team Roster */}
          <div className="px-4 py-4 border-b border-slate-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Team</p>
            <div className="flex flex-col gap-2.5">
              {TEAM.map((m) => (
                <div
                  key={m.initials}
                  className="flex items-center gap-2.5 cursor-pointer group"
                  onClick={() => onNavigate?.("profile")}
                >
                  <AvatarPlaceholder size={28} initials={m.initials} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:underline">{m.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Chat</p>
              <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
              {messages.map((m, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 shrink-0">
                      {m.from}
                    </div>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug pl-5.5">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="px-3 py-3 border-t border-slate-100">
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Message..."
                  className="flex-1 text-xs border border-slate-200 rounded px-2.5 py-2 focus:outline-none focus:border-slate-400 transition-colors text-slate-700 placeholder-slate-300"
                />
                <button
                  onClick={sendMessage}
                  className="px-2.5 py-2 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  ↑
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* KANBAN BOARD */}
        <main className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-5 h-full min-w-[640px]">
            {(["todo", "doing", "done"] as const).map((col) => {
              const labels = { todo: "To Do", doing: "Doing", done: "Done" };
              const counts = { todo: board.todo.length, doing: board.doing.length, done: board.done.length };
              return (
                <div key={col} className="flex-1 flex flex-col min-w-[200px]">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">{labels[col]}</h3>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">
                      {counts[col]}
                    </span>
                  </div>
                  {/* Column body */}
                  <div className="flex-1 bg-slate-100/60 border border-slate-200 rounded-lg p-3 flex flex-col gap-2.5 overflow-y-auto">
                    {board[col].map((card) => (
                      <KanbanCard key={card.id} {...card} />
                    ))}
                    {/* Add card placeholder */}
                    <button className="w-full py-2.5 border border-dashed border-slate-300 rounded text-xs text-slate-400 hover:text-slate-600 hover:border-slate-400 transition-colors cursor-pointer">
                      + Add card
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
