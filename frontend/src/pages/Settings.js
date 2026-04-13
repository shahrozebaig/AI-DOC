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
    <div className="min-h-screen bg-hero text-white pt-24 pb-12 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none" />

      <Navbar />

      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 mt-8 relative z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
              title="Go back"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Settings</h2>
          </div>
          
          <button
            onClick={async () => { await signOut(); window.location.href = "/login"; }}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 uppercase tracking-wider text-xs font-bold px-4 py-2.5 rounded-xl border border-red-500/30 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            Log Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          {/* 📧 EMAIL SECTION */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transition-all hover:bg-white/[0.07] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold">Email Preferences</h3>
            </div>

            <div className="mb-6 bg-black/40 p-4 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current Email</p>
                <p className="font-medium text-gray-200">{user?.email}</p>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] uppercase tracking-wider font-bold rounded-full border border-green-500/20">Verified</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5 ml-1">New Email <span className="text-red-500">*</span></label>
                <input
                  placeholder="Enter new email address"
                  className={`w-full p-3 bg-black/50 text-white placeholder-gray-500 rounded-xl outline-none border-2 transition-all ${
                    emailError === "email" ? "border-red-500" : "border-white/10 focus:border-primary focus:bg-black/70"
                  }`}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                />
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1.5 ml-1">Current Password <span className="text-red-500">*</span></label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Required to update email"
                  className={`w-full p-3 bg-black/50 text-white placeholder-gray-500 rounded-xl outline-none border-2 transition-all pr-12 ${
                    emailError === "emailPassword" ? "border-red-500" : "border-white/10 focus:border-primary focus:bg-black/70"
                  }`}
                  onChange={(e) => { setEmailPassword(e.target.value); setEmailError(""); }}
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 bottom-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>

              <button
                onClick={updateEmail}
                className="w-full bg-primary text-black font-semibold py-3 rounded-xl hover:brightness-110 transition-all active:scale-[0.98]"
              >
                Update Email Address
              </button>
            </div>
          </div>

          {/* 🔐 PASSWORD SECTION */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl transition-all hover:bg-white/[0.07] flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
              </div>
              <h3 className="text-lg font-semibold">Security Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1.5 ml-1">Current Password <span className="text-red-500">*</span></label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className={`w-full p-3 bg-black/50 text-white placeholder-gray-500 rounded-xl outline-none border-2 transition-all pr-12 ${
                    passwordError === "currentPassword" ? "border-red-500" : "border-white/10 focus:border-blue-500 focus:bg-black/70"
                  }`}
                  onChange={(e) => { setCurrentPassword(e.target.value); setPasswordError(""); }}
                />
              </div>

              <div className="relative">
                <label className="block text-sm text-gray-400 mb-1.5 ml-1">New Password <span className="text-red-500">*</span></label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className={`w-full p-3 bg-black/50 text-white placeholder-gray-500 rounded-xl outline-none border-2 transition-all pr-12 ${
                    passwordError === "newPassword" ? "border-red-500" : "border-white/10 focus:border-blue-500 focus:bg-black/70"
                  }`}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                />
              </div>

              <button
                onClick={updatePassword}
                className="w-full bg-blue-600/90 text-white font-semibold py-3 rounded-xl hover:bg-blue-500 transition-all active:scale-[0.98]"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* 🔥 DANGER ZONE */}
          <div className="lg:col-span-2 bg-red-500/5 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-red-500/20 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
            </div>
            
            <p className="text-sm text-red-400/80 mb-6 ml-1">Once you delete your account, there is no going back. Please be certain.</p>

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600/10 text-red-500 border border-red-500/50 px-6 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all w-full font-semibold"
              >
                Delete Account
              </button>
            ) : (
              <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-5 space-y-4">
                <p className="text-red-300 text-sm">
                  This action cannot be undone. Please type <strong className="text-white bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30">DELETE</strong> to confirm.
                </p>
                <input
                  type="text"
                  placeholder="Type DELETE"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full p-3 bg-black/60 text-white rounded-xl outline-none border-2 border-transparent focus:border-red-500 transition-colors"
                />
                <div className="flex gap-3">
                  <button
                    onClick={deleteAccount}
                    disabled={deleteConfirmText !== "DELETE"}
                    className={`flex-1 py-3 rounded-xl text-white font-medium transition-all ${
                      deleteConfirmText === "DELETE" ? "bg-red-600 hover:bg-red-500 active:scale-[0.98]" : "bg-red-900/50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmText("");
                    }}
                    className="flex-1 bg-white/5 text-gray-300 py-3 rounded-xl hover:bg-white/10 hover:text-white transition-colors font-medium border border-white/10 active:scale-[0.98]"
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