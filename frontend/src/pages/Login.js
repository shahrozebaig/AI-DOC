import { useState, useEffect, useContext } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import {
  signIn,
  signInWithGoogle,
  signInWithGithub,
} from "../services/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  const handleLogin = async () => {
    const { error } = await signIn(email, password);
    if (error) {
      alert(error.message);
    } else {
      navigate("/dashboard");
    }
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
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-3 border rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* REMEMBER ME */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <label className="flex items-center gap-2 text-gray-700">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>
            <span className="text-blue-600 cursor-pointer">
              Forgot?
            </span>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-black text-white p-2 rounded mb-3"
          >
            Login
          </button>
          {/* DIVIDER */}
          <div className="text-center text-gray-500 mb-3">or</div>
          {/* GOOGLE */}
          <button
            onClick={signInWithGoogle}
            className="w-full border p-2 rounded mb-2 hover:bg-gray-100"
          >
            Continue with Google
          </button>
          {/* GITHUB */}
          <button
            onClick={signInWithGithub}
            className="w-full border p-2 rounded hover:bg-gray-100"
          >
            Continue with GitHub
          </button>
        </div>
      </AuthLayout>
    </div>
  );
}
export default Login;