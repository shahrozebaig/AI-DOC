import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
  ArrowLeft,
  Database,
  HelpCircle
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
  const [showClearChatsConfirm, setShowClearChatsConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [clearingType, setClearingType] = useState(null);
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

  const menuItems = useMemo(() => [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <ShieldCheck size={18} /> },
    { id: "data", label: "Clear AI Data", icon: <Database size={18} /> },
    { id: "help", label: "Help Center", icon: <HelpCircle size={18} /> },
    { id: "account", label: "Account", icon: <Trash2 size={18} /> },
  ], []);

  useEffect(() => {
    checkMFA();
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if (tab && menuItems.some(item => item.id === tab)) {
      setActiveTab(tab);
    }
  }, [checkMFA, menuItems]);
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

  const handleClearData = async (type) => {
    setClearingType(type);
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
      const endpoint = type === 'chats' ? '/data/clear-chats/' : '/data/clear-all/';
      
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        setShowClearChatsConfirm(false);
        setShowClearAllConfirm(false);
      } else {
        throw new Error(data.detail || "Action failed");
      }
    } catch (err) {
      showToast(err.message || "Something went wrong");
    } finally {
      setClearingType(null);
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

  const helpSections = [
    {
      title: "System Optimization",
      desc: "Performance guide for smooth operation",
      items: [
        { label: "Memory Limit", value: "512MB RAM (Render Free Tier)", status: "warning" },
        { label: "Engine Size", value: "90MB (Optimized ONNX)", status: "success" },
      ]
    },
    {
      title: "Best Practices",
      desc: "How to get the best results",
      items: [
        { label: "File Upload", value: "Prefer multiple small files over one large PDF", status: "info" },
        { label: "Processing", value: "Refresh if 'Intelligence processing failed' appears", status: "info" },
      ]
    }
  ];



  return (
    <div className="min-h-screen bg-[#080808] text-gray-200 font-sans">


      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">

        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="flex items-center gap-3 mb-10">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-xl transition-all border border-white/10 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
            </button>
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

          {/* DATA MANAGEMENT TAB */}
          {activeTab === "data" && (
            <div className="space-y-10">
              <header>
                <h2 className="text-2xl font-bold text-white mb-2">Clear AI Data</h2>
                <p className="text-sm text-gray-500">Manage your data storage and privacy settings.</p>
              </header>

              <div className="space-y-6">
                {/* Clear Chats Section */}
                <section className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Clear Chat History</h3>
                      <p className="text-sm text-gray-500">Wipe all your chat sessions and messages. Your documents will remain indexed.</p>
                    </div>
                    <button
                      disabled={clearingType !== null}
                      onClick={() => setShowClearChatsConfirm(true)}
                      className="shrink-0 bg-white/5 border border-white/10 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-all active:scale-95 disabled:opacity-50"
                    >
                      Clear History
                    </button>
                  </div>

                  {showClearChatsConfirm && (
                    <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl animate-in fade-in zoom-in duration-300">
                      <p className="text-sm text-red-400 mb-4 font-medium">Are you sure you want to delete ALL chat sessions? This cannot be undone.</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleClearData('chats')}
                          disabled={clearingType !== null}
                          className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-500 transition-all"
                        >
                          {clearingType === 'chats' ? "Clearing..." : "Yes, Clear Chats"}
                        </button>
                        <button
                          onClick={() => setShowClearChatsConfirm(false)}
                          className="flex-1 bg-white/5 text-gray-400 text-xs font-bold py-2 rounded-lg hover:bg-white/10 transition-all border border-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </section>

                {/* Clear All Section */}
                <section className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Clear All AI Data</h3>
                      <p className="text-sm text-gray-500">Wipe EVERYTHING: chat history and all document embeddings. You will need to re-upload files to chat again.</p>
                    </div>
                    <button
                      disabled={clearingType !== null}
                      onClick={() => setShowClearAllConfirm(true)}
                      className="shrink-0 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                    >
                      Wipe All Data
                    </button>
                  </div>

                  {showClearAllConfirm && (
                    <div className="p-6 bg-red-950/20 border border-red-500/20 rounded-2xl animate-in fade-in zoom-in duration-300">
                      <p className="text-sm text-red-400 mb-4 font-bold">CRITICAL: This will permanently delete all your chats and indexed documents. Proceed?</p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleClearData('all')}
                          disabled={clearingType !== null}
                          className="flex-1 bg-red-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-red-500 transition-all"
                        >
                          {clearingType === 'all' ? "Wiping..." : "Yes, Wipe Everything"}
                        </button>
                        <button
                          onClick={() => setShowClearAllConfirm(false)}
                          className="flex-1 bg-white/5 text-gray-400 text-xs font-bold py-2 rounded-lg hover:bg-white/10 transition-all border border-white/10"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
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
          {/* HELP TAB */}
          {activeTab === "help" && (
            <div className="space-y-10">
              <header>
                <h2 className="text-2xl font-bold text-white mb-2">Help Center</h2>
                <p className="text-sm text-gray-500">Guides and technical information for your AI Assistant.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {helpSections.map((section, idx) => (
                  <div key={idx} className="bg-[#111111] border border-white/5 rounded-3xl p-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{section.title}</h3>
                      <p className="text-sm text-gray-500">{section.desc}</p>
                    </div>
                    <div className="space-y-4">
                      {section.items.map((item, i) => (
                        <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                          <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-1">{item.label}</p>
                          <p className={`text-sm font-medium ${
                            item.status === "warning" ? "text-amber-400" : 
                            item.status === "success" ? "text-emerald-400" : "text-gray-300"
                          }`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 flex items-center gap-6">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Secure Architecture</h3>
                  <p className="text-sm text-gray-400">All thinking is offloaded to Groq Cloud API, while your document data stays locally indexed for your session security.</p>
                </div>
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