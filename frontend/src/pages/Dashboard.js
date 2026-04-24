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
  MessageSquare,
  HelpCircle,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId] = useState(null);
  const [showHelp, setShowHelp] = useState(false);

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

      {/* MOBILE OVERLAY */}
      {!collapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-30 backdrop-blur-sm mt-16"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`absolute md:relative flex flex-col bg-[#0c0c0c] border-r border-white/5 transition-transform md:transition-all duration-300 ease-in-out mt-16 h-[calc(100vh-4rem)] z-40 ${
          collapsed ? "-translate-x-full md:translate-x-0 w-72 md:w-20" : "translate-x-0 w-80 md:w-72"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`absolute top-6 bg-[#111111] border border-white/10 rounded-full p-1.5 md:p-1 text-gray-400 hover:text-white transition-all z-50 shadow-xl ${
            collapsed ? "-right-12 md:-right-3" : "-right-3 md:-right-3"
          }`}
        >
          {collapsed ? <ChevronRight size={16} className="md:w-3.5 md:h-3.5" /> : <ChevronLeft size={16} className="md:w-3.5 md:h-3.5" />}
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
              onClick={() => setShowHelp(true)}
              className="w-full flex items-center gap-3 py-3 px-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <HelpCircle size={18} />
              {!collapsed && <span className="text-xs font-medium">Help & Info</span>}
            </button>
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
      <main className="flex-1 flex flex-col h-full pt-16 relative w-full min-w-0 overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2" />

        {/* HEADER */}
        <header className="flex items-center justify-between pl-16 pr-8 py-6 md:px-8 border-b border-white/5 bg-[#080808]/50 backdrop-blur-md z-20">
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
        <section className="flex-1 relative flex flex-col h-full w-full min-w-0 overflow-hidden">
          <div className="flex-1 overflow-hidden z-10 h-full w-full">
            <ChatBox sessionId={currentSessionId} onSessionCreated={loadSessions} />
          </div>
        </section>

      {/* HELP MODAL */}
      <AnimatePresence>
        {showHelp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-white/10 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              
              <button 
                onClick={() => setShowHelp(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <HelpCircle size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">System Optimization</h2>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Performance Guide</p>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm text-gray-400 leading-relaxed">
                  If you encounter <span className="text-white font-semibold">"Intelligence processing failed,"</span> it is because parsing or indexing heavy/larger documents can sometimes exceed the <span className="text-white font-semibold">Render Free Tier</span> limit (512MB RAM). Please refresh and retry your upload.
                </p>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">Technical Evolution:</h3>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-200 font-medium">Model Swap (HuggingFace → FastEmbed):</span> We swapped heavy Hugging Face PyTorch models for <span className="text-white font-mono text-xs">FastEmbed/ONNX</span>. This reduced the model size from 400MB+ to just ~90MB to fit in Render's 512MB limit.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-200 font-medium">LLM Reasoning (Local → Groq):</span> Instead of running Llama 3 on the server (which needs 4GB+ RAM), we use the <span className="text-white font-mono text-xs">Groq Llama 3.1 API</span>. This offloads 100% of the heavy math to the cloud for instant responses.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-200 font-medium">Engine Optimization:</span> We moved from standard Python processing to <span className="text-white font-mono text-xs">FastEmbed/ONNX</span>. This ensures that indexing your documents uses the minimum possible RAM while staying fast.
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-200 font-medium">Session Persistence:</span> AI memory is temporary for maximum speed. If you see "Server restarted," just re-upload your files. This occurs during system updates or after 15 minutes of inactivity.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    💡 Pro Tip: If you encounter an error during upload, please <span className="text-gray-300 font-bold underline">refresh the page</span> and try again. For the best experience on free hosting, try uploading multiple smaller files instead of one massive document.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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