import { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  MessageSquare,
  HelpCircle,
  X,
  Eraser,
  LogOut
} from "lucide-react";
import { signOut } from "../services/auth";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(() => {
    return localStorage.getItem("currentSessionId") || null;
  });
  const [showHelp, setShowHelp] = useState(false);

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



        {/* Action Header - NOW UPLOAD (Centered) */}
        <div className={`flex flex-col ${collapsed ? "items-center px-2" : "p-6"} gap-6 overflow-hidden`}>
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
                Data survives session restarts.
              </p>
            )}
          </div>

          {/* CHAT SESSIONS LIST */}
          <div className="flex-1 flex flex-col min-h-0 w-full">
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
                  <div className="flex items-center gap-3">
                    <MessageSquare size={14} className={currentSessionId === session.id ? "text-emerald-500" : "text-gray-600"} />
                    {!collapsed && (
                      <span className="text-xs font-medium truncate flex-1">
                        {session.title || "Untitled Chat"}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="p-3 border-t border-white/5 space-y-1">
          <div className={`flex flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
            <button
              onClick={() => setShowHelp(true)}
              className="w-full flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <HelpCircle size={18} />
              {!collapsed && <span className="text-xs font-medium">Help & Info</span>}
            </button>
            <button
              onClick={() => navigate("/settings?tab=data")}
              className="w-full flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
            >
              <Eraser size={18} />
              {!collapsed && <span className="text-xs font-medium">Clear AI Data</span>}
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <SettingsIcon size={18} />
              {!collapsed && <span className="text-xs font-medium">Settings</span>}
            </button>
            <button
              onClick={async () => { await signOut(); window.location.href = "/login"; }}
              className="w-full flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-xs font-medium">Sign Out</span>}
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
            <button 
              onClick={() => navigate("/settings")}
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-1 py-1 pr-4 rounded-full border border-white/5 transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px] tracking-tighter">
                {user?.email?.slice(0, 2).toUpperCase() || "U"}
              </div>
              <span className="text-xs font-bold text-gray-300 group-hover:text-white hidden sm:block">Profile</span>
            </button>
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

        {/* HELP MODAL */}
        <AnimatePresence>
          {showHelp && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-[#111111] border border-white/10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl p-6 md:p-8 shadow-2xl relative hide-scrollbar"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />

                <button
                  onClick={() => setShowHelp(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                    <HelpCircle size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">System Optimization</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Performance Guide</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      If you encounter <span className="text-emerald-400 font-semibold">"Intelligence processing failed,"</span> it is likely because parsing heavy documents exceeds the <span className="text-white font-semibold">Render Free Tier</span> limit (512MB RAM).
                    </p>
                    <p className="text-xs text-emerald-500/70 mt-2 font-medium">
                      Tip: Refresh and retry your upload if this happens.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">Technical Architecture</h3>

                    <div className="grid gap-3">
                      {[
                        {
                          title: "Cloud Reasoning (Groq API)",
                          desc: "Offloaded 100% of AI thinking to Groq's Llama 3.1 for instant responses without RAM usage.",
                          icon: "🧠"
                        },
                        {
                          title: "Efficient Indexing (FastEmbed)",
                          desc: "Swapped heavy PyTorch for ONNX, reducing engine size from 400MB+ to just ~90MB.",
                          icon: "⚡"
                        },
                        {
                          title: "Permanent Memory (Supabase)",
                          desc: "Persistent pgvector database ensures your data survives server restarts and sleep cycles.",
                          icon: "💾"
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                          <span className="text-lg">{item.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 leading-tight">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[11px] text-gray-400 leading-relaxed italic">
                      💡 <span className="text-gray-300 font-semibold">Best Practice:</span> For the best experience on free hosting, try uploading multiple smaller files instead of one massive document.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>


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