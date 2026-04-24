import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChevronRight } from "lucide-react";

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/";
  const isDashboard = location.pathname === "/dashboard";

  const getInitials = () => {
    if (!user?.email) return "U";
    const name = user.email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isSettings = location.pathname === "/settings";
  const hideLogo = isDashboard || isSettings;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-10 py-[10px] bg-black/40 backdrop-blur-xl border-b border-white/[0.03]">
      {/* LEFT: LOGO */}
      <div className="flex-1">
        {!hideLogo && (
          <Link to="/" className="group flex items-center w-fit">
            <img 
                src="/Logo.jpeg" 
                alt="DocuMind AI" 
                className="h-11 w-auto rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        )}
      </div>

      {/* CENTER (LANDING ONLY) */}
      {isLandingPage && !user && (
        <div className="hidden md:flex gap-8 items-center bg-white/5 px-6 py-2 rounded-full border border-white/[0.05]">
          <button
            onClick={() => scrollToSection("features")}
            className="text-[11px] uppercase font-bold tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Features
          </button>
          <div className="w-[1px] h-3 bg-white/10" />
          <button
            onClick={() => scrollToSection("how")}
            className="text-[11px] uppercase font-bold tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            How it works
          </button>
        </div>
      )}

      {/* RIGHT: ACTIONS */}
      <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
        {user && !isDashboard && (
          <div className="flex items-center gap-8">
            {!isDashboard && (
                <button
                onClick={() => navigate("/dashboard")}
                className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                Go to Dashboard <ChevronRight size={14} />
                </button>
            )}
            
            <button 
              onClick={() => navigate("/settings")}
              className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 px-1 py-1 pr-4 rounded-full border border-white/5 transition-all active:scale-95"
            >
              <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold text-[10px] tracking-tighter">
                {getInitials()}
              </div>
              <span className="text-xs font-bold text-gray-300 group-hover:text-white">Profile</span>
            </button>
          </div>
        )}

        {!user && isLandingPage && (
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/login" className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors whitespace-nowrap">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-white text-black px-4 md:px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/5 whitespace-nowrap"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;