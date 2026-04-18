import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const isLandingPage = location.pathname === "/";

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4">

      {/* LEFT */}
      <Link to="/" className="flex items-center">
        <img 
          src="/Logo.jpeg" 
          alt="DocuMind AI Logo" 
          className="h-10 w-auto rounded-lg object-contain border border-white/5 shadow-md hover:scale-105 transition-transform"
        />
      </Link>

      {/* CENTER (LANDING ONLY) */}
      {isLandingPage && !user && (
        <div className="hidden md:flex gap-6 text-gray-300">
          <button
            onClick={() => scrollToSection("features")}
            className="hover:text-white"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection("how")}
            className="hover:text-white"
          >
            How It Works
          </button>
        </div>
      )}

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* 🔥 FIXED BACK BUTTON */}
        {isAuthPage && (
          <button
            onClick={() => navigate("/")}
            className="bg-black/70 text-white px-4 py-2 rounded hover:bg-black transition"
          >
            ← Back
          </button>
        )}

        {/* DASHBOARD */}
        {user && !isAuthPage && (
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/settings")}
              className="text-gray-300 font-medium hover:text-white transition-colors"
            >
              Settings
            </button>

            <button 
              onClick={() => navigate("/dashboard")}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-green-400 text-black flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(74,222,128,0.4)] hover:scale-105 transition-transform"
            >
              {getInitials()}
            </button>
          </div>
        )}

        {/* NOT LOGGED IN */}
        {!user && !isAuthPage && (
          <>
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>

            <Link
              to="/signup"
              className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700 text-white"
            >
              Sign Up
            </Link>
          </>
        )}

      </div>
    </div>
  );
}

export default Navbar;