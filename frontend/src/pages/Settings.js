import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";
import { useToast } from "../context/ToastContext";
import {
  Lock, ShieldCheck, User, Trash2, LogOut,
  ArrowLeft, Database, HelpCircle, Eye, EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Standalone component — defined outside Settings so React never remounts it on re-render
function PwInput({ value, onChange, placeholder, id, extraCls = "" }) {
  const [show, setShow] = useState(false);
  const base = "w-full bg-[#18181b] border border-white/[0.09] rounded-xl px-4 py-3 pr-11 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/25 transition-all";
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={base + " " + extraCls}
        autoComplete="off"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

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

  // shared classes
  const card  = "bg-[#0f0f11] border border-white/[0.06] rounded-2xl p-6";
  const inp   = "w-full bg-[#18181b] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/25 transition-all";
  const lbl   = "block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5";
  const btnP  = "bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-600/20";
  const btnS  = "bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95";
  const btnD  = "bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-400 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95";

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 md:px-8 h-14 flex items-center gap-2">
          <button onClick={() => navigate("/dashboard")} className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 transition-all text-sm font-medium">
            <ArrowLeft size={15} /><span>Dashboard</span>
          </button>
          <span className="text-white/10 mx-1">/</span>
          <span className="text-sm font-medium text-zinc-300">Settings</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-8">

        {/* SIDEBAR */}
        <aside className="w-full md:w-48 shrink-0">
          <nav className="flex flex-row md:flex-col gap-0.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0">
            {menuItems.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === item.id ? "bg-white/[0.07] text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04]"}`}>
                <span className={activeTab === item.id ? "text-emerald-400" : "text-zinc-600"}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:block mt-6 pt-5 border-t border-white/[0.06]">
            <button onClick={async () => { await signOut(); window.location.href = "/login"; }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all w-full">
              <LogOut size={14} />Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0 space-y-5">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              <div><h1 className="text-lg font-semibold text-white">Profile</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Manage your account email.</p></div>
              <div className={card}>
                <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[0.06]">
                  <div>
                    <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Current Email</p>
                    <p className="text-sm text-white font-medium">{user?.email}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>
                </div>
                {!isOAuthUser ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label className={lbl}>New Email</label>
                        <input type="email" className={inp} placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} /></div>
                      <div><label className={lbl}>Current Password</label>
                        <PwInput id="ep" value={emailPassword} onChange={e => setEmailPassword(e.target.value)} placeholder="Confirm password" /></div>
                    </div>
                    <button onClick={updateEmail} className={btnP}>Update Email</button>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.06]">
                    Signed in via <span className="text-zinc-300 font-medium capitalize">{user?.app_metadata?.provider}</span>. Email managed by provider.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div><h1 className="text-lg font-semibold text-white">Security</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Password and two-factor authentication.</p></div>

              {!isOAuthUser && (
                <div className={card + " space-y-4"}>
                  <div className="flex items-center gap-2 mb-1"><Lock size={14} className="text-zinc-400" /><h2 className="text-sm font-semibold text-white">Change Password</h2></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className={lbl}>Current Password</label>
                      <PwInput id="cp" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="--------------------------------------------------------" /></div>
                    <div><label className={lbl}>New Password</label>
                      <PwInput id="np" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="--------------------------------------------------------" /></div>
                  </div>
                  <button onClick={updatePassword} className={btnP}>Update Password</button>
                </div>
              )}

              {/* 2FA */}
              <div className={card + " space-y-4"}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={14} className="text-blue-400" />
                    <div><h2 className="text-sm font-semibold text-white">Two-Factor Authentication</h2>
                      <p className="text-xs text-zinc-500 mt-0.5">Extra verification code on sign-in.</p></div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${mfaEnabled ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/[0.04] text-zinc-500 border-white/[0.08]"}`}>
                    {mfaEnabled ? "Active" : "Off"}
                  </span>
                </div>

                {!mfaEnabled ? (
                  mfaSetupStep === "idle" ? (
                    <button onClick={() => isOAuthUser ? startMfaSetup() : setMfaSetupStep("askPassword")}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                      Enable 2FA
                    </button>
                  ) : (
                    <div className="bg-black/30 border border-white/[0.06] rounded-xl p-4 space-y-3 max-w-sm">
                      {mfaSetupStep === "askPassword" && (<>
                        <p className="text-xs text-zinc-400">Confirm password to begin 2FA setup.</p>
                        <PwInput id="mfasp" value={mfaPassword} onChange={e => setMfaPassword(e.target.value)} placeholder="Current password" />
                        <div className="flex gap-2">
                          <button onClick={startMfaSetup} className={btnP}>Continue</button>
                          <button onClick={() => setMfaSetupStep("idle")} className={btnS}>Cancel</button>
                        </div>
                      </>)}
                      {mfaSetupStep === "showQR" && (<>
                        <div className="bg-white p-3 rounded-xl w-fit mx-auto"><img src={mfaQrCode} alt="QR" className="w-40 h-40" /></div>
                        <p className="text-xs text-zinc-400 text-center">Scan with your authenticator app, then verify.</p>
                        <div className="flex gap-2">
                          <input type="text" className={inp + " text-center tracking-[0.4em] font-mono"} placeholder="000000" maxLength={6} onChange={e => setMfaVerifyCode(e.target.value)} />
                          <button onClick={confirmMfaSetup} className={btnP}>Verify</button>
                        </div>
                      </>)}
                    </div>
                  )
                ) : (
                  mfaSetupStep === "askPasswordDisable" ? (
                    <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 space-y-3 max-w-sm">
                      <p className="text-xs text-red-400">Confirm password to disable 2FA.</p>
                      <PwInput id="mfadp" value={mfaPassword} onChange={e => setMfaPassword(e.target.value)} placeholder="Current password" />
                      <div className="flex gap-2">
                        <button onClick={disableMfa} className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all active:scale-95">Disable</button>
                        <button onClick={() => setMfaSetupStep("idle")} className={btnS}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => isOAuthUser ? disableMfa() : setMfaSetupStep("askPasswordDisable")} className={btnD}>Disable 2FA</button>
                  )
                )}
              </div>
            </div>
          )}

          {/* DATA */}
          {activeTab === "data" && (
            <div className="space-y-5">
              <div><h1 className="text-lg font-semibold text-white">Clear AI Data</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Remove chat history and document embeddings.</p></div>

              <div className={card + " space-y-4"}>
                <div className="flex items-start justify-between gap-4">
                  <div><h2 className="text-sm font-semibold text-white mb-0.5">Clear Chat History</h2>
                    <p className="text-xs text-zinc-500">Removes all sessions. Documents stay indexed.</p></div>
                  <button disabled={clearingType !== null} onClick={() => { setShowClearAllConfirm(false); setShowClearChatsConfirm(true); }} className={btnS + " shrink-0 disabled:opacity-40"}>Clear History</button>
                </div>
                {showClearChatsConfirm && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
                    <p className="text-xs text-red-400 font-medium">Delete all chat sessions? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleClearData('chats')} disabled={clearingType !== null} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg transition-all">
                        {clearingType === 'chats' ? "Clearing..." : "Yes, Clear"}
                      </button>
                      <button onClick={() => setShowClearChatsConfirm(false)} className="flex-1 bg-white/5 text-zinc-400 text-xs font-bold py-2 rounded-lg border border-white/[0.08] hover:bg-white/10 transition-all">Cancel</button>
                    </div>
                  </div>
                )}
              </div>

              <div className={card + " space-y-4"}>
                <div className="flex items-start justify-between gap-4">
                  <div><h2 className="text-sm font-semibold text-white mb-0.5">Wipe All AI Data</h2>
                    <p className="text-xs text-zinc-500">Deletes chats + embeddings. You'll need to re-upload files.</p></div>
                  <button disabled={clearingType !== null} onClick={() => { setShowClearChatsConfirm(false); setShowClearAllConfirm(true); }} className={btnD + " shrink-0 disabled:opacity-40"}>Wipe All</button>
                </div>
                {showClearAllConfirm && (
                  <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-4 space-y-3">
                    <p className="text-xs text-red-400 font-medium">Warning: Permanently deletes all chats and indexed documents.</p>
                    <div className="flex gap-2">
                      <button onClick={() => handleClearData('all')} disabled={clearingType !== null} className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-bold py-2 rounded-lg transition-all">
                        {clearingType === 'all' ? "Wiping..." : "Yes, Wipe Everything"}
                      </button>
                      <button onClick={() => setShowClearAllConfirm(false)} className="flex-1 bg-white/5 text-zinc-400 text-xs font-bold py-2 rounded-lg border border-white/[0.08] hover:bg-white/10 transition-all">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HELP */}
          {activeTab === "help" && (
            <div className="space-y-5">
              <div><h1 className="text-lg font-semibold text-white">Help Center</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Guides and technical info.</p></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {helpSections.map((s, i) => (
                  <div key={i} className={card + " space-y-3"}>
                    <div><h2 className="text-sm font-semibold text-white mb-0.5">{s.title}</h2>
                      <p className="text-xs text-zinc-500">{s.desc}</p></div>
                    <div className="space-y-2">
                      {s.items.map((item, j) => (
                        <div key={j} className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-2.5">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-zinc-600 mb-0.5">{item.label}</p>
                          <p className={`text-xs font-medium ${item.status === "warning" ? "text-amber-400" : item.status === "success" ? "text-emerald-400" : "text-zinc-300"}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/20">
                  <ShieldCheck size={17} className="text-emerald-400" />
                </div>
                <div><h3 className="text-sm font-semibold text-white mb-0.5">Secure Architecture</h3>
                  <p className="text-xs text-zinc-500">AI inference via Groq Cloud. Documents stay session-isolated.</p></div>
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-5">
              <div><h1 className="text-lg font-semibold text-white">Account</h1>
                <p className="text-sm text-zinc-500 mt-0.5">Permanent account actions.</p></div>
              <div className={card + " space-y-4"}>
                <div><h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-1">Danger Zone</h2>
                  <p className="text-xs text-zinc-500">Deleting your account is permanent and cannot be undone.</p></div>
                {!showDeleteConfirm ? (
                  <button onClick={() => setShowDeleteConfirm(true)} className={btnD}>Delete My Account</button>
                ) : (
                  <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-5 space-y-4">
                    <div><label className={lbl + " !text-red-500/60"}>Type <span className="text-white font-bold">DELETE</span> to confirm</label>
                      <input className={inp + " border-red-500/20 focus:border-red-500"} placeholder="DELETE" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} /></div>
                    {!isOAuthUser && (
                      <div><label className={lbl + " !text-red-500/60"}>Your Password</label>
                        <PwInput id="delp" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Account password" extraCls="border-red-500/20 focus:border-red-500" /></div>
                    )}
                    <div className="flex gap-2">
                      <button onClick={deleteAccount} className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl transition-all text-sm">Permanently Delete</button>
                      <button onClick={() => setShowDeleteConfirm(false)} className={btnS + " flex-1"}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:hidden pt-2">
                <button onClick={async () => { await signOut(); window.location.href = "/login"; }} className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-sm font-medium transition-all">
                  <LogOut size={14} />Sign Out
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MFA STEP-UP MODAL */}
      <AnimatePresence>
        {mfaSetupStep === "verifyStepUp" && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="bg-[#0f0f11] w-full max-w-sm rounded-2xl border border-white/[0.09] p-6 shadow-2xl space-y-5">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto border border-blue-500/20">
                  <ShieldCheck size={20} className="text-blue-400" />
                </div>
                <div><h3 className="text-base font-semibold text-white">Security Verification</h3>
                  <p className="text-xs text-zinc-500 mt-1">Enter the code from your authenticator app.</p></div>
              </div>
              <input type="text" className={inp + " text-center text-2xl tracking-[0.4em] font-mono"} placeholder="000000" maxLength={6} onChange={e => setMfaVerifyCode(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={confirmStepUp} className={btnP + " flex-1"}>Authorize</button>
                <button onClick={() => setMfaSetupStep("idle")} className={btnS + " flex-1"}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Settings;
