import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import FileUpload from "../components/FileUpload";
import { AuthContext } from "../context/AuthContext";
import { getChatSessions } from "../services/chat";
import {
  Upload,
  User,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";
function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId] = useState(null);

  const loadSessions = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getChatSessions(user.id);
      setSessions(data);
    } catch (err) {
      console.error("Failed to load sessions", err);
    }
  }, [user]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="flex h-screen bg-[#080808] text-gray-200 overflow-hidden font-sans">
      <Navbar />

      {/* SIDEBAR */}
      <aside
        className={`relative flex flex-col bg-[#0c0c0c] border-r border-white/5 transition-all duration-300 ease-in-out mt-16 z-30 ${collapsed ? "w-20" : "w-72"
          }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-6 bg-[#111111] border border-white/10 rounded-full p-1 text-gray-500 hover:text-white transition-colors z-40"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>



        {/* Action Header - NOW UPLOAD (Centered) */}
        <div className={`flex-1 flex flex-col justify-center ${collapsed ? "items-center px-2" : "p-6"}`}>
          <div className="space-y-4 w-full">
            {!collapsed && (
              <div className="flex flex-col items-center gap-2 mb-2 animate-in fade-in duration-500">
                <Upload size={18} className="text-emerald-500" />
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Document Hub</h3>
              </div>
            )}

            <div className={`bg-white/5 border border-white/10 transition-all group cursor-pointer shadow-lg ${collapsed ? "rounded-xl p-3" : "rounded-2xl p-4 hover:border-emerald-500/30"
              }`}>
              <FileUpload isCollapsed={collapsed} />
            </div>

            {!collapsed && (
              <p className="text-[10px] text-gray-600 text-center px-4 leading-relaxed tracking-wider italic animate-in fade-in duration-500">
                All analyzed data remains locally indexed for this session.
              </p>
            )}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <div className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <SettingsIcon size={18} />
              {!collapsed && <span className="text-xs font-medium">Settings</span>}
            </button>
            <div className={`flex items-center gap-3 py-3 px-3 bg-white/5 border border-white/5 rounded-xl ${collapsed ? "p-3" : ""}`}>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shrink-0">
                <User size={16} />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">User Account</p>
                  <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full pt-16 relative">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        {/* HEADER */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-[#080808]/50 backdrop-blur-md z-20">
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
            {/* Space for right header actions */}
          </div>
        </header>

        {/* CHAT INTERFACE */}
        <section className="flex-1 relative overflow-hidden flex flex-col h-full px-4 md:px-12 py-6">
          <div className="flex-1 overflow-hidden z-10">
            <ChatBox sessionId={currentSessionId} onSessionCreated={loadSessions} />
          </div>
        </section>

        <style>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.1);
            }
        `}</style>
      </main>
    </div>
  );
}

export default Dashboard;