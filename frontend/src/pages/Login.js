import { useState, useEffect, useContext } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import {
  signIn,
  signInWithGoogle,
  signInWithGithub,
  resetPassword,
} from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { supabase } from "../lib/supabaseClient";

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

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const checkRedirect = async () => {
      if (user) {
        // If the user disabled 2FA (paused it), bypass the prompt.
        if (user.user_metadata?.is_mfa_enabled === false) {
          navigate("/dashboard");
          return;
        }

        const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (mfaData && mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
          // Fetch factors to get the ID
          const { data: factorsData } = await supabase.auth.mfa.listFactors();
          
          let verifiedFactor = null;
          if (factorsData && Array.isArray(factorsData.all)) {
            verifiedFactor = factorsData.all.find(f => f.status === 'verified' && f.factor_type === 'totp');
          } else if (factorsData && Array.isArray(factorsData.totp)) {
            verifiedFactor = factorsData.totp.find(f => f.status === 'verified');
          } else if (Array.isArray(factorsData)) {
            verifiedFactor = factorsData.find(f => f.status === 'verified' && f.factor_type === 'totp');
          }

          if (verifiedFactor) {
            setMfaFactorId(verifiedFactor.id);
            setRequireMfa(true);
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/dashboard");
        }
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
      if (error.message.toLowerCase().includes("email") || error.message.toLowerCase().includes("user")) setErrorField("email");
      else if (error.message.toLowerCase().includes("password")) setErrorField("password");
      else setErrorField("both");
      alert(error.message);
    }
  };

  const handleVerifyMfa = async () => {
    if (!mfaCode) return setMfaError("Required");
    setMfaError("");

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId: mfaFactorId });
      if (challengeError) throw challengeError;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId: mfaFactorId,
        challengeId: challengeData.id,
        code: mfaCode
      });

      if (verifyError) throw verifyError;

      // Successfully verified AAL2
      navigate("/dashboard");
    } catch (err) {
      setMfaError("Invalid code");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return alert("Enter your email first");
    const { error } = await resetPassword(email);
    if (error) alert(error.message);
    else alert("Password reset link sent to your email!");
  };

  return (
    <div className="relative min-h-screen">
      <AuthBackground />

      <AuthLayout>
        <div className="flex w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl overflow-hidden mx-4 min-h-[550px] border border-white/20">

          {/* LEFT: Branding */}
          <div className="hidden md:flex w-2/5 flex-col justify-center p-10 bg-gradient-to-br from-black to-gray-900 relative">
            <div className="relative z-10 flex flex-col space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">Welcome <br />back.</h1>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  Log in to continue exploring your documents with AI-powered semantic search and summarization.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
            {requireMfa ? (
              <div className="flex flex-col h-full justify-center space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
                  <p className="text-sm text-gray-500">Your account is protected with 2FA. Please enter the generated code from your authenticator app to continue.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Authentication Code</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className={`w-full p-3.5 bg-gray-50 border tracking-widest text-center font-mono text-lg rounded-xl outline-none transition-colors ${mfaError ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"}`}
                    onChange={(e) => { setMfaCode(e.target.value.replace(/[^0-9]/g, '')); setMfaError(''); }}
                    value={mfaCode}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyMfa()}
                  />
                  {mfaError && <p className="text-red-500 text-xs mt-2 ml-1">{mfaError}</p>}
                </div>

                <button
                  onClick={handleVerifyMfa}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors active:scale-[0.98] mt-4"
                >
                  Verify code
                </button>
                
                <button
                   onClick={async () => { await supabase.auth.signOut(); window.location.href = "/login"; }}
                   className="text-sm text-gray-500 font-medium hover:text-black transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in to your account</h2>
                  <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
                </div>

                {/* Social Buttons */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={signInWithGoogle}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
                  >
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" alt="google" className="w-4 h-4" />
                    Google
                  </button>

                  <button
                    onClick={signInWithGithub}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold text-gray-700"
                  >
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="github" className="w-4 h-4" />
                    GitHub
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-[1px] bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">or continue with email</span>
                  <div className="flex-1 h-[1px] bg-gray-200" />
                </div>

                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-colors ${errorField === "email" || errorField === "both" ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
                        }`}
                      onChange={(e) => { setEmail(e.target.value); setErrorField(''); }}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 px-1">
                      <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
                      <span onClick={handleForgotPassword} className="text-xs text-primary font-semibold hover:underline cursor-pointer">Forgot password?</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full p-3 pr-10 bg-gray-50 border rounded-xl outline-none transition-colors ${errorField === "password" || errorField === "both" ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
                          }`}
                        onChange={(e) => { setPassword(e.target.value); setErrorField(''); }}
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <label className="flex items-center gap-2 cursor-pointer pt-1" onClick={() => setRemember(!remember)}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? "bg-black border-black" : "border-gray-300"}`}>
                      {remember && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    <span className="text-sm text-gray-600 select-none">Remember me for 30 days</span>
                  </label>

                  {/* Login Button */}
                  <button
                    onClick={handleLogin}
                    className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors active:scale-[0.98] mt-2"
                  >
                    Sign In
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/signup")} className="text-primary font-semibold hover:underline cursor-pointer">Sign up</span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Login;