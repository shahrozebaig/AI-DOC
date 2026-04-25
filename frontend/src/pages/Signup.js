import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import { signUp, signInWithGoogle, signInWithGithub, signOut } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { Eye, EyeOff } from "lucide-react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorField, setErrorField] = useState("");
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignup = async () => {
    if (!email) return setErrorField("email");
    if (!password) return setErrorField("password");
    if (!confirmPassword) return setErrorField("confirmPassword");
    if (password !== confirmPassword) { setErrorField("confirmPassword"); return showToast("Passwords do not match"); }
    setErrorField("");
    const { error } = await signUp(email, password);
    if (error) {
      if (error.message.toLowerCase().includes("email")) setErrorField("email");
      else if (error.message.toLowerCase().includes("password")) setErrorField("password");
      else setErrorField("both");
      showToast(error.message);
    } else {
      await signOut();
      showToast("Account created! Please sign in.", "success");
      navigate("/login");
    }
  };

  const inp = (err) => `w-full bg-[#18181b] border ${err ? "border-red-500/60" : "border-white/[0.09] focus:border-white/25"} rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all`;
  const socialBtn = "flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.09] rounded-xl text-sm font-medium text-zinc-300 transition-all active:scale-95";

  return (
    <div className="relative min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <AuthBackground />
      <AuthLayout>
        <div className="flex w-full max-w-3xl bg-[#0f0f11] border border-white/[0.07] rounded-2xl shadow-2xl shadow-black/60 overflow-hidden mx-4">

          {/* LEFT image panel */}
          <div className="hidden md:flex w-2/5 relative overflow-hidden bg-[#09090b] items-center justify-center">
            <img src="/Signup.jpeg" alt="Signup Visual" className="w-full h-full object-contain" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f0f11]/40 pointer-events-none" />
          </div>

          {/* RIGHT form */}
          <div className="w-full md:w-3/5 p-8 sm:p-10 flex flex-col justify-center">
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Create account</h2>
                <p className="text-sm text-zinc-500">Sign up to get started today.</p>
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
                  onKeyDown={e => e.key === "Enter" && handleSignup()}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                    className={inp(errorField === "password" || errorField === "both") + " pr-11"}
                    onChange={e => { setPassword(e.target.value); setErrorField(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSignup()}
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
                  <input type={showConfirm ? "text" : "password"} placeholder="••••••••"
                    className={inp(errorField === "confirmPassword") + " pr-11"}
                    onChange={e => { setConfirmPassword(e.target.value); setErrorField(""); }}
                    onKeyDown={e => e.key === "Enter" && handleSignup()}
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button onClick={handleSignup}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 shadow-lg shadow-emerald-600/20">
                Create Account
              </button>

              <p className="text-center text-sm text-zinc-600">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")} className="text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer transition-colors">
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Signup;