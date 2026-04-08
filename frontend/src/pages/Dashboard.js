import { useState } from "react";
import Navbar from "../components/Navbar";
import ChatBox from "../components/ChatBox";
import FileUpload from "../components/FileUpload";

function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-hero text-white pt-20 relative">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

      <Navbar />

      <div className="flex max-w-7xl mx-auto px-4 gap-4 relative z-10">

        {/* SIDEBAR */}
        <div
          className={`transition-all duration-300 ${
            collapsed ? "w-[70px]" : "w-[260px]"
          } hidden md:flex flex-col justify-between`}
        >

          {/* TOP */}
          <div className="flex flex-col gap-4">

            {/* COLLAPSE BUTTON */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-gray-400 hover:text-white"
            >
              {collapsed ? "➡" : "⬅ Collapse"}
            </button>

            {/* LOGO */}
            {!collapsed && (
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
                <h2 className="text-lg font-semibold">🤖 DocuMind</h2>
                <p className="text-xs text-gray-400">
                  AI Workspace
                </p>
              </div>
            )}

            {/* 🔥 UPLOAD */}
            {!collapsed && (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg hover:shadow-purple-500/10 transition">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                  📂 Upload File
                </h3>
                <FileUpload />
              </div>
            )}

          </div>

          {/* FOOT */}
          {!collapsed && (
            <div className="text-xs text-gray-500 text-center">
              ⚡ Powered by AI
            </div>
          )}
        </div>

        {/* MAIN CHAT */}
        <div className="flex-1 flex flex-col">

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-white/10 flex flex-col h-[80vh] relative overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">

              <div>
                <h2 className="text-lg font-semibold">
                  💬 AI Assistant
                </h2>
                <p className="text-xs text-gray-400">
                  Chat with your documents
                </p>
              </div>

              <div className="text-xs text-green-400 animate-pulse">
                ● Online
              </div>
            </div>

            {/* CHAT */}
            <div className="flex-1 overflow-hidden">
              <ChatBox />
            </div>

            {/* GLOW EFFECT */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;