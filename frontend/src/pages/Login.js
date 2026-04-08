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
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl w-80 shadow-lg">
          <h2 className="text-xl mb-4 text-black font-semibold">Login</h2>

          <input
            placeholder="Email"
            className="w-full p-2 mb-3 border rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 mb-3 border rounded"
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              👁
            </span>
          </div>

          <div className="flex items-center justify-between mb-4 text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <span
              onClick={handleForgotPassword}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Forgot?
            </span>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white p-2 rounded mb-3"
          >
            Login
          </button>

          <div className="text-center text-gray-500 mb-3">or</div>

          {/* ICON BUTTONS */}
          <div className="flex justify-center gap-4 mb-3">
            <button
              onClick={signInWithGoogle}
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="google"
                className="w-6 h-6"
              />
            </button>

            <button
              onClick={signInWithGithub}
              className="p-2 border rounded-full hover:bg-gray-100"
            >
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="github"
                className="w-6 h-6"
              />
            </button>
          </div>

          <div className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </div>
        </div>
      </AuthLayout>
    </div>
  );
}

export default Login;