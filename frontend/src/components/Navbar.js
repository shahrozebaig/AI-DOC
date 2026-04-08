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

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // 🔥 Get initials (fallback avatar)
  const getInitials = () => {
    if (!user?.email) return "U";
    const name = user.email.split("@")[0];
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-4">

      {/* LEFT */}
      <Link to="/" className="text-lg font-semibold">
        DocuMind
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* BACK BUTTON */}
        {isAuthPage && (
          <button
            onClick={() => navigate("/")}
            className="text-gray-300 hover:text-white"
          >
            ← Back
          </button>
        )}

        {/* LOGGED IN */}
        {user && !isAuthPage && (
          <>
            {/* SETTINGS */}
            <button
              onClick={() => navigate("/settings")}
              className="text-gray-300 hover:text-white"
            >
              Settings
            </button>

            {/* AVATAR */}
            <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-semibold">
              {getInitials()}
            </div>

            {/* LOGOUT */}
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
              className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700"
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