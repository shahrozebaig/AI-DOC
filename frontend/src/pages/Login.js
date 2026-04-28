import { useState, useEffect, useContext } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import { signIn, signInWithGoogle, signInWithGithub, resetPassword } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../context/ToastContext";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState("");
  const [requireMfa, setRequireMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaError, setMfaError] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { showToast } = useToast();

  useEffect(() => {
    const checkRedirect = async () => {
      if (user) {
        if (user.user_metadata?.is_mfa_enabled === false) { navigate("/dashboard"); return; }
        const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (mfaData && mfaData.nextLevel === "aal2" && mfaData.nextLevel !== mfaData.currentLevel) {
          const { data: factorsData } = await supabase.auth.mfa.listFactors();
          let verifiedFactor = null;
          if (factorsData && Array.isArray(factorsData.all)) verifiedFactor = factorsData.all.find(f => f.status === "verified" && f.factor_type === "totp");
          else if (factorsData && Array.isArray(factorsData.totp)) verifiedFactor = factorsData.totp.find(f => f.status === "verified");
          else if (Array.isArray(factorsData)) verifiedFactor = factorsData.find(f => f.status === "verified" && f.factor_type === "totp");
          if (verifiedFactor) { setMfaFactorId(verifiedFactor.id); setRequireMfa(true); }
          else navigate("/dashboard");
        } else navigate("/dashboard");
      }
    };
    checkRedirect();
  }, [user, navigate]);

  const handleLogin = async () => {
    if (!email) return setErrorField("email");
    if (!password) return setErrorField("password");
    setErrorField("");
    const { error } = await signIn(email, password);
    if (error) {
      let msg = error.message;
      if (msg.toLowerCase().includes("confirmed") || msg.toLowerCase().includes("verify"))
        msg = "Email not verified. Please check your inbox.";
      else if (msg === "Invalid login credentials")
        msg = "Invalid credentials. Please try again.";
      if (error.message.toLowerCase().includes("email") || error.message.toLowerCase().includes("user")) setErrorField("email");
      else if (error.message.toLowerCase().includes("password")) setErrorField("password");
      else setErrorField("both");
      showToast(msg);
    } else {
      showToast("Login successful", "success");
    }
  };

  const handleVerifyMfa = async () => {
    if (!mfaCode) return setMfaError("Required");
    setMfaError("");
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challengeError) throw challengeError;
      const { error: verifyError } = await supabase.auth.mfa.verify({ factorId: mfaFactorId, challengeId: challengeData.id, code: mfaCode });
      if (verifyError) throw verifyError;
      showToast("Login successful", "success");
      navigate("/dashboard");
    } catch { setMfaError("Invalid code. Try again."); }
  };

  const handleForgotPassword = async () => {
    if (!email) return setErrorField("email");
    setErrorField(""); setResetLoading(true);
    const { error } = await resetPassword(email);
    setResetLoading(false);
    if (error) showToast(error.message);
    else setResetEmailSent(true);
  };

  // shared styles
  const inp = (err) => `w-full bg-[#18181b] border ${err ? "border-red-500/60" : "border-white/[0.09] focus:border-white/25"} rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all`;
  const socialBtn = "flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] rounded-xl text-sm font-medium text-zinc-300 transition-all active:scale-95";

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <AuthBackground />
      <AuthLayout>
        <div className="flex w-full max-w-3xl bg-[#0f0f11] border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden mx-4">

          {/* LEFT image panel */}
          <div className="hidden md:flex w-2/5 relative overflow-hidden bg-[#09090b] items-center justify-center">
            <img src="/Login.jpeg" alt="Login Visual" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/40 pointer-events-none" />
          </div>

          {/* RIGHT form */}
          <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col justify-center">

            {/* MFA view */}
            {requireMfa ? (
              <div className="space-y-6">
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center mb-2">
                  <ShieldCheck size={22} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Two-Factor Auth</h2>
                  <p className="text-sm text-zinc-500">Enter the 6-digit code from your authenticator app.</p>
                </div>
                <div>
                  <input
                    type="text" placeholder="000000" maxLength={6}
                    className={`${inp(mfaError)} text-center tracking-[0.5em] font-mono text-lg`}
                    value={mfaCode}
                    onChange={e => { setMfaCode(e.target.value.replace(/[^0-9]/g, "")); setMfaError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleVerifyMfa()}
                  />
                  {mfaError && <p className="text-red-400 text-xs mt-1.5 ml-1">{mfaError}</p>}
                </div>
                <button onClick={handleVerifyMfa} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
                  Verify Code
                </button>
                <button onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}
                  className="w-full text-zinc-500 hover:text-zinc-300 text-sm transition-all py-1">
                  Back to Sign In
                </button>
              </div>

            ) : isForgotPassword ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Reset Password</h2>
                  <p className="text-sm text-zinc-500">
                    {resetEmailSent ? "Check your inbox for the reset link." : "Enter your email and we'll send a reset link."}
                  </p>
                </div>
                {!resetEmailSent ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email Address</label>
                      <input type="email" placeholder="you@example.com"
                        className={inp(errorField === "email")} value={email}
                        onChange={e => { setEmail(e.target.value); setErrorField(""); }}
                        onKeyDown={e => e.key === "Enter" && handleForgotPassword()}
                      />
                    </div>
                    <button onClick={handleForgotPassword} disabled={resetLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20 disabled:opacity-50">
                      {resetLoading ? "Sending..." : "Send Reset Link"}
                    </button>
                  </>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-emerald-400 text-sm">
                    Reset link sent to <span className="font-semibold">{email}</span>. Check your spam folder too.
                  </div>
                )}
                <button onClick={() => { setIsForgotPassword(false); setResetEmailSent(false); }}
                  className="w-full text-zinc-500 hover:text-zinc-300 text-sm transition-all py-1">
                  Back to Sign In
                </button>
              </div>

            ) : (
              <div className="space-y-5">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">Sign in</h2>
                  <p className="text-sm text-zinc-500">Welcome back. Enter your details below.</p>
                </div>

                {/* Social */}
                <div className="flex gap-3">
                  <button onClick={signInWithGoogle} className={socialBtn}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="Google" className="w-4 h-4" />
                    Google
                  </button>
                  <button onClick={signInWithGithub} className={socialBtn}>
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" className="w-4 h-4 invert" />
                    GitHub
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[11px] text-zinc-600 uppercase tracking-wider font-semibold">or</span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" placeholder="you@example.com"
                    className={inp(errorField === "email" || errorField === "both")}
                    onChange={e => { setEmail(e.target.value); setErrorField(""); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</label>
                    <span onClick={() => setIsForgotPassword(true)} className="text-xs text-emerald-400 hover:text-emerald-300 cursor-pointer font-medium transition-colors">
                      Forgot password?
                    </span>
                  </div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                      className={inp(errorField === "password" || errorField === "both") + " pr-11"}
                      onChange={e => { setPassword(e.target.value); setErrorField(""); }}
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowPassword(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-2.5 cursor-pointer" onClick={() => setRemember(r => !r)}>
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${remember ? "bg-emerald-600 border-emerald-600" : "border-white/20 bg-white/[0.04]"}`}>
                    {remember && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span className="text-sm text-zinc-400 select-none">Remember me for 30 days</span>
                </label>

                <button onClick={handleLogin}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
                  Sign In
                </button>

                <p className="text-center text-sm text-zinc-600">
                  No account?{" "}
                  <span onClick={() => navigate("/signup")} className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors">
                    Sign up
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Login;