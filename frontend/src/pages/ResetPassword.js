import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";
import { useToast } from "../context/ToastContext";
import Navbar from "../components/Navbar";
import { ShieldCheck, Lock, Loader2, ChevronRight, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPassword() {
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      const verifiedFactor = (factors.all || factors.totp || []).find(f => f.status === 'verified');
      if (verifiedFactor) {
        setMfaEnabled(true);
        setMfaFactorId(verifiedFactor.id);
      }
    };
    checkMfaStatus();
  }, []);
  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return showToast("Please fill in all password fields.");
    }
    if (password !== confirmPassword) {
      return showToast("Passwords do not match.");
    }
    if (mfaEnabled && !mfaCode) {
      return setMfaError("MFA code is required.");
    }
    setLoading(true);
    try {
      if (mfaEnabled) {
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
        if (challengeError) throw challengeError;
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId: mfaFactorId,
          challengeId: challengeData.id,
          code: mfaCode
        });
        if (verifyError) throw verifyError;
      }
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      showToast("Security update successful! Identity verified.", "success");
      setTimeout(async () => {
        await signOut();
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      if (err.message.includes("MFA")) {
        setMfaError("Invalid or expired MFA code.");
      } else {
        showToast(err.message, "error");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-6 selection:bg-emerald-500/30">
      <Navbar />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-xl">
            <ShieldCheck className="text-emerald-500" size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Security Update</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium uppercase tracking-widest text-[10px]">Define your new access credentials</p>
        </div>
        <div className="bg-[#0c0c0c] border border-white/[0.05] rounded-[32px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl relative overflow-hidden group">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 ml-1">New Password</label>
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 ml-1">Confirm Identity</label>
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat password"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-white placeholder-gray-600 focus:bg-white/10 focus:border-emerald-500/30 outline-none transition-all"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <AnimatePresence>
              {mfaEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-6 border-t border-white/[0.05] space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">MFA Verification Active</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000 000"
                    className={`w-full bg-emerald-500/5 border p-4 tracking-[0.4em] font-mono text-center text-2xl text-emerald-500 rounded-2xl outline-none transition-all ${mfaError ? "border-red-500" : "border-emerald-500/20 focus:border-emerald-500"}`}
                    onChange={(e) => { setMfaCode(e.target.value.replace(/[^0-9]/g, '')); setMfaError(""); }}
                    value={mfaCode}
                  />
                  {mfaError && <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest text-center">{mfaError}</p>}
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={handleReset}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group shadow-xl shadow-white/5"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Secure Account <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
        <p className="text-center mt-8 text-[11px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Neural encryption active for this session
        </p>
      </motion.div>
    </div>
  );
}
export default ResetPassword;