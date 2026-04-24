import { useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";
import { useToast } from "../context/ToastContext";
import {
  Lock,
  ShieldCheck,
  User,
  Trash2,
  ChevronRight,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isOAuthUser = user?.app_metadata?.provider !== 'email';
  const [activeTab, setActiveTab] = useState("profile");
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaSetupStep, setMfaSetupStep] = useState("idle");
  const [mfaPassword, setMfaPassword] = useState("");
  const [mfaQrCode, setMfaQrCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState("");
  const [mfaVerifyCode, setMfaVerifyCode] = useState("");
  const [mfaUnenrollFactorId, setMfaUnenrollFactorId] = useState("");
  const [stepUpAction, setStepUpAction] = useState(null);
  const checkMFA = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase.auth.mfa.listFactors();
      let verifiedFactor = null;
      if (data && Array.isArray(data.all)) {
        verifiedFactor = data.all.find(f => f.status === 'verified' && f.factor_type === 'totp');
      } else if (data && Array.isArray(data.totp)) {
        verifiedFactor = data.totp.find(f => f.status === 'verified');
      }
      if (verifiedFactor) {
        setMfaUnenrollFactorId(verifiedFactor.id);
        setMfaEnabled(user.user_metadata?.is_mfa_enabled !== false);
      } else {
        setMfaEnabled(false);
        setMfaUnenrollFactorId("");
      }

    } catch (err) {
      console.error("MFA check failed", err);
    }
  }, [user]);
  useEffect(() => {
    checkMFA();
  }, [checkMFA]);
  const updateEmail = async () => {
    if (!email || !emailPassword) return showToast("All fields are required");
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: emailPassword,
    });
    if (loginError) {
      return showToast("Current password is incorrect");
    }
    if (mfaEnabled && mfaUnenrollFactorId) {
      setStepUpAction("email");
      setMfaSetupStep("verifyStepUp");
      return;
    }
    const { error } = await supabase.auth.updateUser({ email });
    if (error) showToast(String(error.message));
    else {
      showToast("Email update initiated! Check your inbox.", "success");
      setTimeout(async () => {
        await signOut();
        window.location.href = "/login";
      }, 3000);
    }
  };
  const updatePassword = async () => {
    if (!currentPassword || !newPassword) return showToast("All fields are required");
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (loginError) {
      return showToast("Current password is incorrect");
    }
    if (mfaEnabled && mfaUnenrollFactorId) {
      setStepUpAction("password");
      setMfaSetupStep("verifyStepUp");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) showToast(String(error.message));
    else {
      showToast("Password updated successfully!", "success");
      setTimeout(async () => {
        await signOut();
        window.location.href = "/login";
      }, 2000);
    }
  };

  const startMfaSetup = async () => {
    if (!isOAuthUser) {
      if (!mfaPassword) return showToast("Password is required");
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: mfaPassword,
      });
      if (loginError) {
        return showToast("Current password is incorrect");
      }
    }

    if (mfaUnenrollFactorId) {
      const { error } = await supabase.auth.updateUser({ data: { is_mfa_enabled: true } });
      if (error) {
        return showToast(String(error.message));
      }
      setMfaEnabled(true);
      setMfaSetupStep("idle");
      showToast("2FA Re-enabled successfully", "success");
      return; // Stop here, no need to show QR code
    }

    // Clean up all existing factors to prevent "factor already exists" error
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      if (factors) {
        const allFactors = factors.all || factors.totp || [];
        for (const factor of allFactors) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }
    } catch (err) {
      console.error("Cleanup factors failed", err);
    }

    const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (error) return showToast(String(error.message));
    setMfaQrCode(data.totp.qr_code);
    setMfaFactorId(data.id);
    setMfaSetupStep("showQR");
  };
  const confirmMfaSetup = async () => {
    if (!mfaVerifyCode) return showToast("Verification code is required");

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challengeData.id,
        code: mfaVerifyCode
      });

      if (verifyError) throw verifyError;
      await supabase.auth.updateUser({ data: { is_mfa_enabled: true } });

      setMfaEnabled(true);
      setMfaUnenrollFactorId(mfaFactorId);
      setMfaSetupStep("idle");
      showToast("2FA Enabled", "success");
    } catch (err) {
      showToast("Invalid code");
    }
  };

  const disableMfa = async () => {
    if (!isOAuthUser) {
      if (!mfaPassword) return showToast("Password is required");
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: mfaPassword,
      });
      if (loginError) {
        return showToast("Current password is incorrect");
      }
    }

    const { error } = await supabase.auth.updateUser({
      data: { is_mfa_enabled: false }
    });

    if (error) {
      showToast(String(error.message));
    } else {
      showToast("Two-Factor Authentication disabled", "success");
      setMfaEnabled(false);
      setMfaSetupStep("idle");
      setMfaPassword("");
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return showToast("Type DELETE to confirm");

    if (!isOAuthUser) {
      if (!deletePassword) return showToast("Enter password");
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: deletePassword,
      });
      if (loginError) {
        return showToast("Incorrect password");
      }
    }

    if (mfaEnabled && mfaUnenrollFactorId) {
      setStepUpAction("account deletion");
      setMfaSetupStep("verifyStepUp");
      return;
    }

    try {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const res = await fetch(`${baseUrl}/user/delete-account/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || "Account deleted", "success");
        setTimeout(async () => {
          await signOut();
          window.location.href = "/";
        }, 2000);
      } else {
        // Handle structured error or string detail
        const errorMsg = typeof data.detail === 'string' ? data.detail : "Error deleting account";
        showToast(errorMsg);
      }
    } catch {
      showToast("Error deleting account");
    }
  };

  const confirmStepUp = async () => {
    if (!mfaVerifyCode) return showToast("Verification code is required");

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaUnenrollFactorId });
      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaUnenrollFactorId,
        challengeId: challengeData.id,
        code: mfaVerifyCode
      });

      if (verifyError) throw verifyError;

      if (stepUpAction === "email") {
        await supabase.auth.updateUser({ email });
        showToast("Check inbox for verification", "success");
      } else if (stepUpAction === "password") {
        await supabase.auth.updateUser({ password: newPassword });
        showToast("Password updated", "success");
      } else if (stepUpAction === "account deletion") {
        const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
        const res = await fetch(`${baseUrl}/user/delete-account/`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: user.id }),
        });
        const data = await res.json();
        if (res.ok) {
          showToast(data.message || "Account deleted", "success");
          setTimeout(async () => {
            await signOut();
            window.location.href = "/";
          }, 2000);
          return;
        } else {
          throw new Error(typeof data.detail === 'string' ? data.detail : "Step-up failed");
        }
      }

      setTimeout(async () => {
        await signOut();
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      showToast(err.message || "Invalid code");
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <ShieldCheck size={18} /> },
    { id: "account", label: "Account", icon: <Trash2 size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-gray-200 font-sans mt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors border border-white/10"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold text-white">Settings</h1>
          </div>

          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                  ? "bg-white/10 text-white border border-white/10 shadow-lg"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5 border border-transparent"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {activeTab === item.id && <ChevronRight size={14} className="opacity-50" />}
              </button>
            ))}
          </nav>

          <div className="mt-12 pt-8 border-t border-white/5">
            <button
              onClick={async () => { await signOut(); window.location.href = "/login"; }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500/80 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-10">
              <header>
                <h2 className="text-2xl font-bold text-white mb-2">Profile Settings</h2>
                <p className="text-sm text-gray-500">Manage your personal information and how others see you.</p>
              </header>

              <section className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">Email Address</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] uppercase font-bold tracking-wider rounded-full border border-emerald-500/20">Verified</span>
                </div>

                {!isOAuthUser ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Email</label>
                        <input
                          type="email"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-all"
                          placeholder="Enter new email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-all"
                          placeholder="Confirm password"
                          onChange={(e) => setEmailPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={updateEmail}
                      className="bg-white text-black text-sm font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                    >
                      Update Profile
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm text-gray-400">
                    You logged in using {user?.app_metadata?.provider}. Your email and profile information are managed securely by your provider.
                  </div>
                )}
              </section>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-10">
              <header>
                <h2 className="text-2xl font-bold text-white mb-2">Security</h2>
                <p className="text-sm text-gray-500">Enhanced protection for your documents and account.</p>
              </header>

              <div className="grid grid-cols-1 gap-6">
                {/* Password Section */}
                {!isOAuthUser && (
                  <section className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Lock size={20} className="text-white" />
                      <h3 className="text-lg font-bold text-white">Change Password</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-all"
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">New Password</label>
                        <input
                          type="password"
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-white/30 outline-none transition-all"
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      onClick={updatePassword}
                      className="bg-white/5 border border-white/10 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-all active:scale-95"
                    >
                      Update Password
                    </button>
                  </section>
                )}


                {/* 2FA Section */}
                <section className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="text-blue-500"><ShieldCheck size={26} /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">Two-Factor Authentication</h3>
                      <p className="text-xs text-gray-500">Protect your account with a secondary verification code.</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${mfaEnabled
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }`}>
                      {mfaEnabled ? "Active" : "Inactive"}
                    </div>
                  </div>

                  {!mfaEnabled ? (
                    mfaSetupStep === "idle" ? (
                      <button
                        onClick={() => isOAuthUser ? startMfaSetup() : setMfaSetupStep("askPassword")}
                        className="w-full sm:w-auto bg-blue-600 text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                      >
                        Enable 2FA Protection
                      </button>
                    ) : (
                      <div className="p-6 bg-black/40 rounded-2xl border border-white/10 mt-4 max-w-md">
                        {mfaSetupStep === "askPassword" && (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-400">Confirm your password to begin 2FA enrollment.</p>
                            <input
                              type="password"
                              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none"
                              placeholder="Current password"
                              onChange={(e) => setMfaPassword(e.target.value)}
                            />
                            <div className="flex gap-3 pt-2">
                              <button onClick={startMfaSetup} className="flex-1 bg-white text-black py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all">Continue</button>
                              <button onClick={() => setMfaSetupStep("idle")} className="flex-1 bg-white/5 text-gray-400 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-all border border-white/10">Cancel</button>
                            </div>
                          </div>
                        )}
                        {mfaSetupStep === "showQR" && (
                          <div className="space-y-6">
                            <div className="bg-white p-4 rounded-2xl w-fit mx-auto shadow-2xl">
                              <img src={mfaQrCode} alt="QR" className="w-44 h-44" />
                            </div>
                            <div className="space-y-4">
                              <p className="text-center text-sm text-gray-400">Scan this QR code in your authenticator app and enter the code below.</p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-center tracking-[0.5em] font-mono outline-none focus:border-emerald-500 placeholder-gray-700"
                                  placeholder="000000"
                                  maxLength={6}
                                  onChange={(e) => setMfaVerifyCode(e.target.value)}
                                />
                                <button onClick={confirmMfaSetup} className="px-6 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all">Verify</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  ) : (
                    mfaSetupStep === "askPasswordDisable" ? (
                      <div className="p-6 bg-black/40 rounded-2xl border border-red-500/20 mt-4 max-w-md space-y-4">
                        <p className="text-sm text-red-400">Confirm your password to disable 2FA protection.</p>
                        <input
                          type="password"
                          className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none"
                          placeholder="Current password"
                          onChange={(e) => setMfaPassword(e.target.value)}
                        />
                        <div className="flex gap-3">
                          <button onClick={disableMfa} className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-500 transition-all">Disable Now</button>
                          <button onClick={() => setMfaSetupStep("idle")} className="flex-1 bg-white/5 text-gray-400 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-all border border-white/10">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => isOAuthUser ? disableMfa() : setMfaSetupStep("askPasswordDisable")}
                        className="text-xs text-gray-500 hover:text-red-400 transition-colors uppercase font-bold tracking-widest border border-white/5 px-4 py-2 rounded-lg hover:bg-red-500/5"
                      >
                        Disable Protection
                      </button>
                    )
                  )}
                </section>
              </div>
            </div>
          )}

          {/* ACCOUNT TAB */}
          {activeTab === "account" && (
            <div className="space-y-10">
              <header>
                <h2 className="text-2xl font-bold text-white mb-2">Account</h2>
                <p className="text-sm text-gray-500">Manage your subscription and account permanence.</p>
              </header>

              <div className="space-y-8">
                <section className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2 italic text-red-500 uppercase tracking-widest">Danger Zone</h3>
                    <p className="text-sm text-gray-500 mb-6 font-medium">Once you delete your account, all your data will be permanently wiped from our servers. There is no undo.</p>

                    {!showDeleteConfirm ? (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                      >
                        Delete My Account
                      </button>
                    ) : (
                      <div className="space-y-6 p-8 bg-red-950/20 border border-red-500/20 rounded-2xl animate-in fade-in duration-500">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-bold text-red-400/60 uppercase tracking-widest mb-2 block">To confirm, type <span className="text-white">DELETE</span></label>
                            <input
                              className="w-full bg-black/60 border border-red-500/20 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition-all placeholder-red-900/40"
                              placeholder="Type DELETE"
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                            />
                          </div>
                          {!isOAuthUser && (
                            <div>
                              <label className="text-xs font-bold text-red-400/60 uppercase tracking-widest mb-2 block">Your Password</label>
                              <input
                                type="password"
                                className="w-full bg-black/60 border border-red-500/20 rounded-xl px-4 py-3 text-sm focus:border-red-500 outline-none transition-all"
                                placeholder="Account password"
                                onChange={(e) => setDeletePassword(e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex gap-4">
                          <button
                            onClick={deleteAccount}
                            className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500 transition-all active:scale-95"
                          >
                            Permanently Delete
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 bg-white/5 text-gray-400 font-bold py-3 rounded-xl hover:bg-white/10 transition-all border border-white/10"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MFA Step-up Modal */}
      <AnimatePresence>
        {mfaSetupStep === "verifyStepUp" && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#111111] w-full max-w-md rounded-[32px] border border-white/10 p-8 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)]"
            >
              <header className="mb-8 text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-500 border border-blue-500/20">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Security Verification</h3>
                <p className="text-sm text-gray-500 px-4">Enter the code from your authenticator app to authorize this action.</p>
              </header>

              <div className="space-y-6">
                <input
                  type="text"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-4 py-4 text-center text-3xl tracking-[0.4em] font-mono outline-none focus:border-blue-500 transition-all text-white"
                  placeholder="000000"
                  maxLength={6}
                  onChange={(e) => setMfaVerifyCode(e.target.value)}
                />
                <div className="flex gap-3">
                  <button onClick={confirmStepUp} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 shadow-xl shadow-white/5">Authorize</button>
                  <button onClick={() => setMfaSetupStep("idle")} className="flex-1 bg-white/5 text-gray-400 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all border border-white/10">Cancel</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      <style>{`
        .animate-in {
            animation-duration: 0.3s;
            animation-fill-mode: both;
        }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-right-4 { animation-name: slideInFromRight; }
        .zoom-in-95 { animation-name: zoomIn; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInFromRight { from { transform: translateX(20px); } to { transform: translateX(0); } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

    </div>
  );
}

export default Settings;