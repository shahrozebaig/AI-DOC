import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";
  const isSettings = location.pathname === "/settings";
  const hideLogo = isDashboard || isSettings;

  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.split("@")[0].slice(0, 2).toUpperCase();
  };

  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-10 h-14 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Logo */}
      <div className="flex-1">
        {!hideLogo && (
          <Link to="/" className="flex items-center w-fit">
            <img src="/Logo.jpeg" alt="DocuMind AI" className="h-9 w-auto rounded-lg" />
          </Link>
        )}
      </div>

      {/* Center nav — landing only */}
      {isLanding && !user && (
        <div className="hidden md:flex gap-6 items-center">
          <button onClick={() => scroll("features")} className="text-xs font-semibold text-zinc-500 hover:text-zinc-200 transition-colors tracking-wide">Features</button>
          <span className="w-px h-3 bg-white/10" />
          <button onClick={() => scroll("how")} className="text-xs font-semibold text-zinc-500 hover:text-zinc-200 transition-colors tracking-wide">How it works</button>
        </div>
      )}

      {/* Right actions */}
      <div className="flex-1 flex items-center justify-end gap-4">
        {user && !isDashboard && (
          <>
            <button onClick={() => navigate("/dashboard")} className="text-xs font-semibold text-zinc-500 hover:text-zinc-200 transition-colors">Dashboard</button>
            <button onClick={() => navigate("/settings")}
              className="flex items-center gap-2 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] px-3 py-1.5 rounded-full transition-all">
              <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">{getInitials()}</div>
              <span className="text-xs font-medium text-zinc-400 hidden sm:block">Profile</span>
            </button>
          </>
        )}
        {!user && isLanding && (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-xs font-semibold text-zinc-500 hover:text-zinc-200 transition-colors">Sign in</Link>
            <Link to="/signup" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;