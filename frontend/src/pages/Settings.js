import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";

function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // 🔐 confirm
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 UPDATE EMAIL
  const updateEmail = async () => {
    if (!email) return alert("Enter new email");

    const { error } = await supabase.auth.updateUser({ email });

    if (error) alert(error.message);
    else {
      alert("Email updated! Please login again.");
      await signOut();
      window.location.href = "/login";
    }
  };

  // 🔥 UPDATE PASSWORD (WITH CONFIRM)
  const updatePassword = async () => {
    if (!currentPassword || !newPassword)
      return alert("Enter current & new password");

    // 🔥 re-authenticate user
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (loginError) {
      return alert("Current password is incorrect");
    }

    // 🔥 update password
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) alert(error.message);
    else {
      alert("Password updated! Please login again.");
      await signOut();
      window.location.href = "/login";
    }
  };

  // 🔥 DELETE ACCOUNT
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("http://localhost:8000/user/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();
      alert(data.message);

      await signOut();
      window.location.href = "/";
    } catch {
      alert("Error deleting account");
    }
  };

  return (
    <div className="min-h-screen bg-hero text-white pt-20 relative">

      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

      <Navbar />

      <div className="max-w-2xl mx-auto px-4 relative z-10">

        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-black/60 px-4 py-2 rounded hover:bg-black"
        >
          ← Back
        </button>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 space-y-6">

          <h2 className="text-2xl font-semibold">⚙️ Settings</h2>

          {/* 📧 CURRENT EMAIL */}
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Current Email</h3>
            <p className="text-white font-medium mb-3">
              {user?.email}
            </p>

            <input
              placeholder="New Email"
              className="w-full p-3 text-black rounded mb-2"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={updateEmail}
              className="bg-primary text-black px-4 py-2 rounded hover:brightness-110"
            >
              Update Email
            </button>
          </div>

          {/* 🔐 PASSWORD */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">Change Password</h3>

            {/* CURRENT PASSWORD */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                className="w-full p-3 text-black rounded"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="relative mb-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full p-3 text-black rounded"
                onChange={(e) => setNewPassword(e.target.value)}
              />

              {/* 👁 TOGGLE */}
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                👁
              </span>
            </div>

            <button
              onClick={updatePassword}
              className="bg-primary text-black px-4 py-2 rounded hover:brightness-110"
            >
              Update Password
            </button>
          </div>

          {/* 🔥 DELETE */}
          <div className="border-t border-white/10 pt-4">
            <h3 className="text-sm text-red-400 mb-2">Danger Zone</h3>

            <button
              onClick={deleteAccount}
              className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Settings;