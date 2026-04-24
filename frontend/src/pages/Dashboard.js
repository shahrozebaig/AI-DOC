import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/ChatBox";
import FileUpload from "../components/FileUpload";
import { AuthContext } from "../context/AuthContext";
import { getChatSessions, deleteChatSession } from "../services/chat";
import { useToast } from "../context/ToastContext";
import {
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Trash2
} from "lucide-react";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
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
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  }, [user]);

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await deleteChatSession(sessionId);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }
      loadSessions();
      showToast("Chat deleted successfully", "success");
    } catch (err) {
      showToast("Failed to delete chat", "error");
    }
  };

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="flex h-screen bg-[#080808] text-gray-200 overflow-hidden font-sans">


      {/* MOBILE OVERLAY */}
      {!collapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm mt-16"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`absolute md:relative flex flex-col bg-[#0c0c0c] border-r border-white/5 transition-transform md:transition-all duration-300 ease-in-out h-full z-40 ${collapsed ? "-translate-x-full md:translate-x-0 w-72 md:w-20" : "translate-x-0 w-80 md:w-72"
          }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-6 bg-[#111111] border border-white/10 rounded-full p-1.5 md:p-1 text-gray-400 hover:text-white transition-all z-50 shadow-xl ${collapsed ? "-right-12 md:-right-3" : "-right-3 md:-right-3"
            }`}
        >
          {collapsed ? <ChevronRight size={16} className="md:w-3.5 md:h-3.5" /> : <ChevronLeft size={16} className="md:w-3.5 md:h-3.5" />}
        </button>





        {/* Action Area - File Upload (No header) */}
        <div className={`p-6 pb-0 ${collapsed ? "px-2" : ""}`}>
           <div className={`bg-white/5 border border-white/10 transition-all group cursor-pointer shadow-lg ${collapsed ? "rounded-xl p-3" : "rounded-2xl p-4 hover:border-emerald-500/30"
              }`}>
              <FileUpload isCollapsed={collapsed} />
            </div>
            {!collapsed && (
              <p className="text-[9px] text-gray-600 text-center mt-3 tracking-widest uppercase font-bold opacity-50">
                Data survives restarts
              </p>
            )}
        </div>

        {/* Action Header - Recent Chats */}
        <div className={`flex flex-col flex-1 ${collapsed ? "items-center px-2" : "p-6 pt-8"} gap-6 overflow-hidden`}>
          {/* CHAT SESSIONS LIST */}
          <div className="flex-1 flex flex-col min-h-0 w-full mt-4">
            {!collapsed && (
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Recent Chats</h3>
                <button 
                  onClick={() => setCurrentSessionId(null)}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-emerald-500 transition-colors"
                  title="New Chat"
                >
                  <MessageSquare size={14} />
                </button>
              </div>
            )}
            
            <div className="flex-1 overflow-y-auto space-y-1 hide-scrollbar pr-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setCurrentSessionId(session.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all group relative border ${
                    currentSessionId === session.id 
                      ? "bg-emerald-500/10 border-emerald-500/20 text-white" 
                      : "border-transparent hover:bg-white/5 text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 w-full group/item">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <MessageSquare size={14} className={currentSessionId === session.id ? "text-emerald-500" : "text-gray-600"} />
                        {!collapsed && (
                        <span className="text-xs font-medium truncate">
                            {session.title || "Untitled Chat"}
                        </span>
                        )}
                    </div>
                    {!collapsed && (
                        <button
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="opacity-0 group-hover/item:opacity-100 p-1 hover:bg-red-500/10 text-gray-600 hover:text-red-500 rounded-md transition-all shrink-0"
                            title="Delete Chat"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION - FIXED SETTINGS */}
        <div className={`p-4 mt-auto border-t border-white/5`}>
          <button
            onClick={() => navigate("/settings")}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5 text-gray-400 hover:text-white group`}
          >
            <SettingsIcon size={18} className="group-hover:rotate-45 transition-transform duration-500" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full relative w-full min-w-0 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        {/* HEADER */}
        <header className="flex items-center justify-between pl-16 pr-8 py-4 md:px-8 border-b border-white/5 bg-[#080808]/50 backdrop-blur-md z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-[14px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
              <MessageSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
                {sessions.find(s => s.id === currentSessionId)?.title || "AI Assistant"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full shadow-lg">
              <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center border border-white/10 text-[10px] font-bold">
                {user?.email?.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-gray-300">Profile</span>
            </div>
          </div>
        </header>

        {/* CHAT INTERFACE */}
        <section className="flex-1 relative flex flex-col h-full w-full min-w-0 overflow-hidden">
          <div className="flex-1 overflow-hidden z-10 h-full w-full">
            <ChatBox sessionId={currentSessionId} onSessionCreated={(newId) => {
              loadSessions();
              if (newId) setCurrentSessionId(newId);
            }} />
          </div>
        </section>


        <style>{`
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>
    </div>
  );
}

export default Dashboard;