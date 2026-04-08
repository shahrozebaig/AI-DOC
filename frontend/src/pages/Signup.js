import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import {
  signUp,
  signInWithGoogle,
  signInWithGithub,
} from "../services/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for verification!");
      navigate("/login");
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuthBackground />

      <AuthLayout>
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl w-80 shadow-lg">

          <h2 className="text-xl mb-4 text-black font-semibold">
            Create Account
          </h2>

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

          <button
            onClick={handleSignup}
            className="w-full bg-black text-white p-2 rounded mb-3"
          >
            Sign Up
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

export default Signup;