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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) alert(error.message);
    else navigate("/dashboard");
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
        <div
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderRadius: "20px",
            border: "0.5px solid rgba(0,0,0,0.1)",
            padding: "2rem",
            width: "340px",
            boxShadow: "0 2px 24px rgba(0,0,0,0.07)",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#1a1a1a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 500,
                margin: "0 0 4px",
                color: "#1a1a1a",
              }}
            >
              Welcome back
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Social Buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "1.25rem" }}>
            <button
              onClick={signInWithGoogle}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "9px",
                border: "0.5px solid #d1d5db",
                borderRadius: "10px",
                background: "white",
                cursor: "pointer",
                fontSize: "13px",
                color: "#1a1a1a",
                fontWeight: 500,
              }}
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="google"
                style={{ width: "16px", height: "16px" }}
              />
              Google
            </button>

            <button
              onClick={signInWithGithub}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "9px",
                border: "0.5px solid #d1d5db",
                borderRadius: "10px",
                background: "white",
                cursor: "pointer",
                fontSize: "13px",
                color: "#1a1a1a",
                fontWeight: 500,
              }}
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="github"
                style={{ width: "16px", height: "16px" }}
              />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1.25rem",
            }}
          >
            <div
              style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }}
            />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              or continue with email
            </span>
            <div
              style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "5px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px",
                fontSize: "14px",
                border: "0.5px solid #d1d5db",
                borderRadius: "10px",
                background: "#f9fafb",
                color: "#1a1a1a",
                outline: "none",
              }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "6px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                Password
              </label>
              <span
                onClick={handleForgotPassword}
                style={{
                  fontSize: "12px",
                  color: "#4f46e5",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Forgot password?
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 38px 9px 12px",
                  fontSize: "14px",
                  border: "0.5px solid #d1d5db",
                  borderRadius: "10px",
                  background: "#f9fafb",
                  color: "#1a1a1a",
                  outline: "none",
                }}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  lineHeight: 0,
                }}
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </span>
            </div>
          </div>

          {/* Remember Me */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              margin: "14px 0 18px",
              cursor: "pointer",
            }}
            onClick={() => setRemember(!remember)}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "4px",
                border: remember ? "none" : "0.5px solid #d1d5db",
                background: remember ? "#1a1a1a" : "#f9fafb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.15s ease",
              }}
            >
              {remember && (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              Remember me for 30 days
            </span>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            style={{
              width: "100%",
              padding: "10px",
              background: "#1a1a1a",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "0.01em",
              transition: "opacity 0.15s ease",
            }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >
            Sign in
          </button>

          {/* Sign Up Link */}
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7280",
              margin: "1.25rem 0 0",
            }}
          >
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Login;