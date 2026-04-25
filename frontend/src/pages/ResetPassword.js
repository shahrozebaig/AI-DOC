import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";
import { useToast } from "../context/ToastContext";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import { ShieldCheck, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPassword() {
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState("");

  useEffect(() => {
    const checkMfaStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: factors, error } = await supabase.auth.mfa.listFactors();
      if (error) return;
      const verifiedFactor = (factors.all || factors.totp || []).find(f => f.status === "verified");
      if (verifiedFactor) { setMfaEnabled(true); setMfaFactorId(verifiedFactor.id); }
    };
    checkMfaStatus();
  }, []);

  const handleReset = async () => {
    if (!password || !confirmPassword) return showToast("Please fill in all fields.");
    if (password !== confirmPassword) return showToast("Passwords do not match.");
    if (mfaEnabled && !mfaCode) return setMfaError("MFA code is required.");
    setLoading(true);
    try {
      if (mfaEnabled) {
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
        if (challengeError) throw challengeError;
        const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: challengeData.id, code: mfaCode });
        if (verifyError) throw verifyError;
      }
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast("Password updated successfully!", "success");
      setTimeout(async () => { await signOut(); window.location.href = "/login"; }, 2000);
    } catch (err) {
      if (err.message.includes("MFA")) setMfaError("Invalid or expired MFA code.");
      else showToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-[#18181b] border border-white/[0.09] rounded-xl px-4 py-3 pl-11 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-white/25 transition-all";

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <AuthBackground />
      <AuthLayout>
        <div className="w-full max-w-sm mx-4">

          {/* Single dark card — header + form together */}
          <div className="bg-[#0f0f11] border border-white/[0.07] rounded-2xl p-6 shadow-2xl shadow-black/50 space-y-5">

            {/* Header inside card */}
            <div className="text-center pb-4 border-b border-white/[0.06]">
              <div className="inline-flex w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center mb-3">
                <Lock size={20} className="text-emerald-400" />
              </div>
              <h1 className="text-lg font-semibold text-white mb-0.5">Reset Password</h1>
              <p className="text-xs text-zinc-500">Choose a strong new password for your account.</p>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">New Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                  <Lock size={14} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className={inp + " pr-11"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                  <Lock size={14} />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat password"
                  className={inp + " pr-11"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleReset()}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowConfirm(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* MFA (if enabled) */}
            <AnimatePresence>
              {mfaEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-4 border-t border-white/[0.06] space-y-3"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">2FA Required</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className={`w-full bg-emerald-500/5 border ${mfaError ? "border-red-500/60" : "border-emerald-500/20 focus:border-emerald-500/40"} rounded-xl px-4 py-3 tracking-[0.5em] font-mono text-center text-lg text-emerald-400 outline-none transition-all`}
                    onChange={e => { setMfaCode(e.target.value.replace(/[^0-9]/g, "")); setMfaError(""); }}
                    value={mfaCode}
                  />
                  {mfaError && <p className="text-red-400 text-xs text-center">{mfaError}</p>}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-emerald-600/20 mt-1"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : "Update Password"}
            </button>
          </div>

          <p className="text-center mt-5 text-xs text-zinc-600">
            Remembered your password?{" "}
            <a href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Sign in</a>
          </p>
        </div>
      </AuthLayout>
    </div>
  );
}

export default ResetPassword;