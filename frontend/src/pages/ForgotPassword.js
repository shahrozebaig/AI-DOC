import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useToast } from "../context/ToastContext";
import AuthLayout from "../components/AuthLayout";
import { Mail, ArrowLeft, KeyRound, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      showToast("Recovery link sent to your email!", "success");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      showToast(err.message || "Failed to send recovery email", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[400px] z-10">
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-all mb-8 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to login
        </button>

        {/* LOGO & TITLE */}
        <div className="text-center mb-10">
          <div className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-xl text-blue-400">
            <KeyRound size={28} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tighter">Recover Access</h1>
          <p className="text-gray-500 text-sm mt-3 px-8 leading-relaxed">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        {/* CARD */}
        <div className="bg-[#0c0c0c] border border-white/[0.05] rounded-[28px] p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] backdrop-blur-3xl relative overflow-hidden group">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 ml-1">Email Address</label>
              <div className="relative group/field">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/field:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder-gray-600 focus:bg-white/10 focus:border-blue-500/30 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white hover:bg-gray-200 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none group shadow-xl shadow-white/5"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Recovery Link"}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-[11px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Secure multi-factor recovery system enabled
        </p>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;