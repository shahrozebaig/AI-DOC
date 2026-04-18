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
          style={{
            transition: "width 0.3s ease",
            width: collapsed ? "64px" : "260px",
            flexShrink: 0,
          }}
          className="hidden md:flex flex-col justify-between"
        >
          {/* TOP */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

            {/* COLLAPSE BUTTON */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 10px",
                borderRadius: "10px",
                border: "0.5px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)",
                color: "#9ca3af",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 500,
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              <span style={{ fontSize: "14px", transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}>⬅️</span>
              {!collapsed && <span>Collapse</span>}
            </button>

            {/* LOGO */}
            {!collapsed && (
              <div
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <img 
                    src="/Logo.jpeg" 
                    alt="DocuMind Logo" 
                    className="h-10 w-auto rounded-lg object-contain border border-white/5 shadow-md"
                  />
                </div>
              </div>
            )}

            {/* COLLAPSED LOGO ICON */}
            {collapsed && (
              <img 
                src="/Logo.jpeg" 
                alt="DocuMind Logo" 
                className="w-full h-auto px-2 rounded-lg object-contain hover:scale-110 transition-transform"
              />
            )}

            {/* UPLOAD */}
            {!collapsed && (
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  padding: "16px",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "16px" }}>📂</span>
                  <h3 style={{ fontSize: "12px", fontWeight: 600, color: "#d1d5db", margin: 0, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                    Upload File
                  </h3>
                </div>
                <FileUpload />
              </div>
            )}

          </div>

          {/* FOOTER */}
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "10px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#a78bfa" }} />
              <span style={{ fontSize: "11px", color: "#6b7280" }}>Powered by AI</span>
            </div>
          )}
        </div>

        {/* MAIN CHAT */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div
            style={{
              background: "rgba(18, 18, 23, 0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "24px",
              padding: "0",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              height: "85vh",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "0.5px solid rgba(255,255,255,0.08)",
                padding: "16px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "20px"
                  }}
                >
                  🤖
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: 600, margin: 0, color: "white" }}>AI Assistant</h2>
                  <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Chat with your documents</p>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  borderRadius: "20px",
                  background: "rgba(74,222,128,0.1)",
                  border: "0.5px solid rgba(74,222,128,0.2)",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#4ade80",
                    animation: "pulse 2s infinite",
                  }}
                />
                <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 500 }}>Online</span>
              </div>
            </div>

            {/* CHAT */}
            <div style={{ flex: 1, overflow: "hidden", padding: "16px 24px 24px", display: "flex", flexDirection: "column", zIndex: 10 }}>
              <ChatBox />
            </div>

            {/* BOTTOM GLOW */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "80px",
                background: "linear-gradient(to top, rgba(0,0,0,0.3), transparent)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

export default Dashboard;