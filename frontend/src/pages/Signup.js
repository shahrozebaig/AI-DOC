import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import {
  signUp,
  signInWithGoogle,
  signInWithGithub,
  signOut,
} from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState("");

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSignup = async () => {
    if (!email) return setErrorField("email");
    if (!password) return setErrorField("password");
    if (!confirmPassword) return setErrorField("confirmPassword");

    if (password !== confirmPassword) {
      setErrorField("confirmPassword");
      return showToast("Passwords do not match");
    }
    setErrorField("");

    const { error } = await signUp(email, password);

    if (error) {
      if (error.message.toLowerCase().includes("email")) {
        setErrorField("email");
      } else if (error.message.toLowerCase().includes("password")) {
        setErrorField("password");
      } else {
        setErrorField("both");
      }
      showToast(error.message);
    } else {
      await signOut();
      showToast("Account created! Please login.", "success");
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuthBackground />

      <AuthLayout>
        <div className="flex w-full max-w-4xl bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl overflow-hidden mx-4 min-h-[550px] border border-white/20">
          
          {/* LEFT: Branding */}
          <div className="hidden md:flex w-2/5 flex-col justify-between p-10 bg-gradient-to-br from-black to-gray-900 relative">
            <div className="relative z-10 flex flex-col space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">Start your <br/>journey.</h1>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  Sign up today and experience the future of intelligent document analysis.
                </p>
              </div>
            </div>

            <div className="relative z-10 p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md mt-10">
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                  Semantic Document Search
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                  AI Context Generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">✓</div>
                  Secure Cloud Workspace
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center">
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create an account</h2>
              <p className="text-sm text-gray-500">Sign up to get started today.</p>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4 mb-5">
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

            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-[1px] bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">or register with email</span>
              <div className="flex-1 h-[1px] bg-gray-200" />
            </div>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full p-3 bg-gray-50 border rounded-xl outline-none transition-colors ${
                    errorField === "email" || errorField === "both" ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
                  }`}
                  onChange={(e) => { setEmail(e.target.value); setErrorField(''); }}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full p-3 pr-10 bg-gray-50 border rounded-xl outline-none transition-colors ${
                      errorField === "password" || errorField === "both" ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
                    }`}
                    onChange={(e) => { setPassword(e.target.value); setErrorField(''); }}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Confirm password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`w-full p-3 pr-10 bg-gray-50 border rounded-xl outline-none transition-colors ${
                      errorField === "confirmPassword" ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-primary"
                    }`}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrorField(''); }}
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={handleSignup}
                className="w-full bg-black text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors active:scale-[0.98] mt-2"
              >
                Create account
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")} className="text-primary font-semibold hover:underline cursor-pointer">Sign in</span>
              </p>
            </div>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Signup;