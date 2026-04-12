import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";

function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Email state
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  // Password state
  const [currentPassword, setCurrentPassword] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Delete state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // 🔥 UPDATE EMAIL
  const updateEmail = async () => {
    if (!email) return setEmailError("email");
    if (!emailPassword) return setEmailError("emailPassword");
    setEmailError("");

    // 🔥 re-authenticate user
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: emailPassword,
    });

    if (loginError) {
      setEmailError("emailPassword");
      return alert("Current password is incorrect");
    }

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
    if (!currentPassword) return setPasswordError("currentPassword");
    if (!newPassword) return setPasswordError("newPassword");
    setPasswordError("");

    // 🔥 re-authenticate user
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (loginError) {
      setPasswordError("currentPassword");
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
    if (deleteConfirmText !== "DELETE") {
      return alert("You must type DELETE to confirm.");
    }

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

      <div className="max-w-lg mx-auto px-4 mt-8 relative z-10">

        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-black/60 px-4 py-2 rounded hover:bg-black"
        >
          ← Back
        </button>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 space-y-8">

          <h2 className="text-2xl font-semibold">⚙️ Settings</h2>

          {/* 📧 CURRENT EMAIL */}
          <div>
            <h3 className="text-sm text-gray-400 mb-1">Current Email</h3>
            <p className="text-white font-medium mb-4">
              {user?.email}
            </p>

            <h3 className="text-sm text-gray-400 mb-2">Update Email <span className="text-red-500">*</span></h3>
            
            <input
              placeholder="New Email"
              className={`w-full p-3 text-black rounded mb-3 outline-none border-2 transition-colors ${
                emailError === "email" ? "border-red-500" : "border-transparent focus:border-primary"
              }`}
              onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
            />

            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password (required to update)"
                className={`w-full p-3 text-black rounded outline-none border-2 transition-colors ${
                  emailError === "emailPassword" ? "border-red-500" : "border-transparent focus:border-primary"
                }`}
                onChange={(e) => { setEmailPassword(e.target.value); setEmailError(""); }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              >
                👁
              </span>
            </div>

            <button
              onClick={updateEmail}
              className="bg-primary text-black px-4 py-2 rounded hover:brightness-110"
            >
              Update Email
            </button>
          </div>

          {/* 🔐 PASSWORD */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm text-gray-400 mb-2">Change Password <span className="text-red-500">*</span></h3>

            {/* CURRENT PASSWORD */}
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Current Password"
                className={`w-full p-3 text-black rounded outline-none border-2 transition-colors ${
                  passwordError === "currentPassword" ? "border-red-500" : "border-transparent focus:border-primary"
                }`}
                onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(""); }}
              />
            </div>

            {/* NEW PASSWORD */}
            <div className="relative mb-3">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                className={`w-full p-3 text-black rounded outline-none border-2 transition-colors ${
                  passwordError === "newPassword" ? "border-red-500" : "border-transparent focus:border-primary"
                }`}
                onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
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
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-sm text-red-400 mb-2">Danger Zone</h3>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
              >
                Delete Account
              </button>
            ) : (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 space-y-3 mt-2">
                <p className="text-red-400 text-sm">
                  This action cannot be undone. Please type <strong className="text-white">DELETE</strong> to confirm.
                </p>
                <input
                  type="text"
                  placeholder="Type DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full p-2 text-black rounded outline-none border-2 border-transparent focus:border-red-500"
                />
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={deleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                    className={`px-4 py-2 rounded text-white transition-opacity ${
                      deleteConfirmText === "DELETE" ? "bg-red-600 hover:bg-red-700" : "bg-red-900 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    className="bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Settings;