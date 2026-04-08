import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import AuthBackground from "../components/AuthBackground";
import {
  signUp,
  signInWithGoogle,
  signInWithGithub,
  signOut, // ✅ ADD THIS
} from "../services/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password) {
      return alert("Enter email and password");
    }

    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
    } else {
      // ✅ LOGOUT USER AFTER SIGNUP
      await signOut();

      alert("Account created! Please login.");
      navigate("/login"); // stay on login page
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

          <div className="text-center text-gray-500 mb-3">or</div>

          <button
            onClick={signInWithGoogle}
            className="w-full border p-2 rounded mb-2 hover:bg-gray-100"
          >
            Continue with Google
          </button>

          <button
            onClick={signInWithGithub}
            className="w-full border p-2 rounded hover:bg-gray-100"
          >
            Continue with GitHub
          </button>

          {/* SWITCH TO LOGIN */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </div>

        </div>
      </AuthLayout>
    </div>
  );
}

export default Signup;