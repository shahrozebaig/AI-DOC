import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "../services/auth";

function Navbar() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  const isLandingPage = location.pathname === "/";

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

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
      <Link to="/" className="text-lg font-semibold text-white">
        DocuMind
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
          <>
            <button
              onClick={() => navigate("/settings")}
              className="text-gray-300 hover:text-white"
            >
              Settings
            </button>

            <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-semibold">
              {getInitials()}
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded text-white"
            >
              Logout
            </button>
          </>
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