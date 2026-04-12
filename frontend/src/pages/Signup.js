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

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorField, setErrorField] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email) return setErrorField("email");
    if (!password) return setErrorField("password");
    if (!confirmPassword) return setErrorField("confirmPassword");

    if (password !== confirmPassword) {
      setErrorField("confirmPassword");
      return alert("Passwords do not match");
    }
    setErrorField("");

    const { error } = await signUp(email, password);

    if (error) {
      if (error.message.toLowerCase().includes("email")) setErrorField("email");
      else if (error.message.toLowerCase().includes("password")) setErrorField("password");
      else setErrorField("both");
      alert(error.message);
    } else {
      await signOut();
      alert("Account created! Please login.");
      navigate("/login");
    }
  };

  const EyeIcon = ({ crossed }) => (
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
      {crossed ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );

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
            width: "400px",
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
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
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
              Create an account
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
              Sign up to get started today
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
            <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>
              or continue with email
            </span>
            <div style={{ flex: 1, height: "0.5px", background: "#e5e7eb" }} />
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
              Email <span style={{ color: "rgb(239, 68, 68)" }}>*</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px",
                fontSize: "14px",
                border: errorField === "email" || errorField === "both" ? "1px solid rgb(239, 68, 68)" : "0.5px solid #d1d5db",
                borderRadius: "10px",
                background: "#f9fafb",
                color: "#1a1a1a",
                outline: "none",
              }}
              onChange={(e) => { setEmail(e.target.value); setErrorField(''); }}
            />
          </div>

          {/* Password */}
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
              Password <span style={{ color: "rgb(239, 68, 68)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 38px 9px 12px",
                  fontSize: "14px",
                  border: errorField === "password" || errorField === "both" ? "1px solid rgb(239, 68, 68)" : "0.5px solid #d1d5db",
                  borderRadius: "10px",
                  background: "#f9fafb",
                  color: "#1a1a1a",
                  outline: "none",
                }}
                onChange={(e) => { setPassword(e.target.value); setErrorField(''); }}
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
                <EyeIcon crossed={showPassword} />
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 500,
                color: "#374151",
                marginBottom: "5px",
              }}
            >
              Confirm password <span style={{ color: "rgb(239, 68, 68)" }}>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 38px 9px 12px",
                  fontSize: "14px",
                  border: errorField === "confirmPassword" ? "1px solid rgb(239, 68, 68)" : "0.5px solid #d1d5db",
                  borderRadius: "10px",
                  background: "#f9fafb",
                  color: "#1a1a1a",
                  outline: "none",
                }}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrorField(''); }}
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
                <EyeIcon crossed={showPassword} />
              </span>
            </div>
          </div>

          {/* Sign Up Button */}
          <button
            onClick={handleSignup}
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
            Create account
          </button>

          {/* Login Link */}
          <p
            style={{
              textAlign: "center",
              fontSize: "13px",
              color: "#6b7280",
              margin: "1.25rem 0 0",
            }}
          >
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#4f46e5",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              Sign in
            </span>
          </p>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Signup;