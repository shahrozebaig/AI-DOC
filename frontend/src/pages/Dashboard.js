import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import FileUpload from "../components/FileUpload";
import { AuthContext } from "../context/AuthContext";
import { getChatSessions, deleteChatSession } from "../services/chat";
import { useToast } from "../context/ToastContext";
import {
  Settings,
  MessageSquare,
  Trash2,
  Menu,
  Plus,
  X,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(() => window.innerWidth < 768);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem("currentSessionId") || null;
  });

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem("currentSessionId", currentSessionId);
    } else {
      localStorage.removeItem("currentSessionId");
    }
  }, [currentSessionId]);

  const loadSessions = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getChatSessions(user.id);
      setSessions(data);
      // If the stored session no longer exists (e.g. after Clear All), reset it
      setCurrentSessionId(prev => {
        if (prev && !data.some(s => s.id === prev)) {
          localStorage.removeItem("currentSessionId");
          return null;
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  }, [user]);

  const handleDeleteSession = async (sessionId) => {
    try {
      await deleteChatSession(sessionId);
      if (currentSessionId === sessionId) setCurrentSessionId(null);
      setPendingDelete(null);
      loadSessions();
      showToast("Chat deleted", "success");
    } catch (err) {
      showToast("Failed to delete chat", "error");
    }
  };

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const currentTitle = sessions.find(s => s.id === currentSessionId)?.title;

  return (
    <div className="flex h-[100dvh] bg-[#09090b] text-zinc-200 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── MOBILE OVERLAY ── */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-30 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* ══════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════ */}
      <aside
        className={`
          absolute md:relative flex flex-col
          bg-[#0f0f11] border-r border-white/[0.06]
          transition-all duration-300 ease-in-out h-full z-40
          ${collapsed
            ? "-translate-x-full md:translate-x-0 w-72 md:w-[64px]"
            : "translate-x-0 w-[280px]"
          }
        `}
      >
        {/* ── SIDEBAR TOP: toggle only ── */}
        <div className={`flex items-center h-14 border-b border-white/[0.06] px-3 shrink-0 ${collapsed ? "md:justify-center" : "justify-end"}`}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all"
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* ── NEW CHAT BUTTON ── */}
        <div className={`px-3 py-3 shrink-0 ${collapsed ? "flex justify-center md:flex" : ""}`}>
          <button
            onClick={() => setCurrentSessionId(null)}
            className={`
              flex items-center gap-2.5 rounded-lg transition-all text-sm font-medium
              bg-emerald-600 hover:bg-emerald-500 text-white
              active:scale-[0.97] shadow-lg shadow-emerald-600/20
              ${collapsed ? "p-2 justify-center" : "w-full px-3 py-2.5"}
            `}
            title="New Chat"
          >
            <Plus size={15} />
            {!collapsed && <span>New Chat</span>}
          </button>
        </div>

        {/* ── FILE UPLOAD ── */}
        <div className={`px-3 pb-3 shrink-0 ${collapsed ? "px-2" : ""}`}>
          <div className={`
            border border-dashed border-white/10 rounded-xl transition-all
            hover:border-emerald-500/30 hover:bg-emerald-500/[0.03]
            ${collapsed ? "p-2" : "p-3"}
          `}>
            <FileUpload isCollapsed={collapsed} />
          </div>
        </div>

        {/* ── DIVIDER ── */}
        {!collapsed && (
          <div className="px-4 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Conversations</span>
            </div>
          </div>
        )}

        {/* ── SESSIONS LIST ── */}
        <div className="flex-1 overflow-y-auto px-2 pb-2 hide-scrollbar min-h-0">
          {sessions.length === 0 && !collapsed && (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-zinc-600">No conversations yet.</p>
              <p className="text-[11px] text-zinc-700 mt-1">Start a new chat above.</p>
            </div>
          )}
          <div className="space-y-0.5">
            {sessions.map((session) => {
              const isActive = currentSessionId === session.id;
              const isPendingDelete = pendingDelete === session.id;
              return (
                <div key={session.id} className="relative">
                  {/* Inline delete confirm */}
                  {isPendingDelete && !collapsed ? (
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                      <span className="text-xs text-red-400 font-medium">Delete this chat?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setPendingDelete(null)}
                          className="text-[11px] px-2 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteSession(session.id)}
                          className="text-[11px] px-2 py-1 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCurrentSessionId(session.id)}
                      className={`
                        w-full text-left rounded-lg transition-all group/item relative
                        ${isActive
                          ? "bg-white/[0.07] text-white"
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"
                        }
                        ${collapsed ? "p-2 flex justify-center" : "px-3 py-2.5 flex items-center justify-between gap-2"}
                      `}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <MessageSquare
                          size={13}
                          className={isActive ? "text-emerald-400 shrink-0" : "text-zinc-600 shrink-0"}
                        />
                        {!collapsed && (
                          <span className="text-xs truncate font-medium">
                            {session.title || "Untitled Chat"}
                          </span>
                        )}
                      </div>
                      {!collapsed && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setPendingDelete(session.id); }}
                          className="opacity-0 group-hover/item:opacity-100 p-1 rounded-md hover:bg-red-500/10 text-zinc-600 hover:text-red-400 transition-all shrink-0"
                          title="Delete"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </button>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* ── BOTTOM: SETTINGS ── */}
        <div className={`shrink-0 border-t border-white/[0.06] p-2 ${collapsed ? "flex justify-center" : ""}`}>
          <button
            onClick={() => navigate("/settings")}
            className={`
              flex items-center gap-2.5 rounded-lg transition-all text-zinc-500 hover:text-zinc-200 hover:bg-white/5
              ${collapsed ? "p-2 justify-center" : "w-full px-3 py-2.5"}
            `}
          >
            <Settings size={15} className="shrink-0" />
            {!collapsed && <span className="text-xs font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-[#09090b] relative">

        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/[0.03] rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        </div>

        {/* ── HEADER ── */}
        <header className="relative z-10 flex items-center justify-between h-14 px-4 md:px-6 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all"
            >
              {collapsed ? <Menu size={18} /> : <X size={18} />}
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <MessageSquare size={13} className="text-emerald-400" />
              </div>
              <h1 className="text-sm font-semibold text-white truncate max-w-[200px] md:max-w-sm">
                {currentTitle || "AI Assistant"}
              </h1>
            </div>
          </div>


        </header>

        {/* ── CHAT AREA ── */}
        <section className="flex-1 relative overflow-hidden z-10">
          <ChatBox
            sessionId={currentSessionId}
            onSessionCreated={(newId) => {
              loadSessions();
              if (newId) setCurrentSessionId(newId);
            }}
          />
        </section>

        <style>{`
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>
      </main>
    </div>
  );
}

export default Dashboard;