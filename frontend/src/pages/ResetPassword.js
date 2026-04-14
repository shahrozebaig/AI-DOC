import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // MFA State
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
      return alert("Please fill in all password fields.");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match.");
    }

    if (mfaEnabled && !mfaCode) {
      return setMfaError("MFA code is required.");
    }

    setLoading(true);

    try {
      // 1. If MFA enabled, verify code first (AAL2 Step-up)
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

      // 2. Perform password update
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      alert("Password updated successfully! Please login with your new credentials.");
      await signOut();
      window.location.href = "/login";
    } catch (err) {
      if (err.message.includes("MFA")) {
        setMfaError("Invalid or expired MFA code.");
      } else {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="bg-white/5 backdrop-blur-xl p-8 sm:p-10 rounded-[32px] w-full max-w-md shadow-2xl border border-white/10 relative z-10 m-4">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create New Password</h2>
          <p className="text-gray-400 text-sm mt-2">Secure your account by choosing a strong password.</p>
        </div>

        <div className="space-y-4">
          {/* PASSWORD */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full p-3.5 bg-black/40 border border-white/10 text-white rounded-xl outline-none focus:border-primary transition-all placeholder:text-gray-700"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-gray-500 hover:text-white transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full p-3.5 bg-black/40 border border-white/10 text-white rounded-xl outline-none focus:border-primary transition-all placeholder:text-gray-700"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* MFA SECTION (ONLY IF ENABLED) */}
          {mfaEnabled && (
            <div className="pt-4 border-t border-white/5 space-y-3">
              <label className="block text-xs font-semibold text-primary uppercase tracking-wider ml-1">Two-Factor Authentication</label>
              <p className="text-[11px] text-gray-500 mb-2 leading-relaxed">Your account is protected with MFA. Enter the code from your app to complete the reset.</p>
              <input
                type="text"
                maxLength={6}
                placeholder="000 000"
                className={`w-full p-4 bg-primary/5 border tracking-[0.3em] font-mono text-center text-xl text-primary rounded-xl outline-none transition-all ${mfaError ? "border-red-500" : "border-primary/30 focus:border-primary"}`}
                onChange={(e) => { setMfaCode(e.target.value.replace(/[^0-9]/g, '')); setMfaError(""); }}
                value={mfaCode}
              />
              {mfaError && <p className="text-red-500 text-[11px] text-center mt-1">{mfaError}</p>}
            </div>
          )}

          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-4 rounded-xl mt-6 transition-all active:scale-[0.98] disabled:opacity-50 shadow-[0_0_20px_rgba(74,222,128,0.2)]"
          >
            {loading ? "Processing..." : "Secure Account"}
          </button>

          <button
            onClick={() => window.location.href = "/login"}
            className="w-full text-gray-500 text-sm font-medium hover:text-white transition-colors mt-2"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;