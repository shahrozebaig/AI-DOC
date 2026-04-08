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

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword)
      return alert("Enter all fields");

    if (password !== confirmPassword)
      return alert("Passwords do not match");

    const { error } = await signUp(email, password);

    if (error) alert(error.message);
    else {
      await signOut();
      alert("Account created! Please login.");
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

          {/* PASSWORD */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border rounded"
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              👁
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              👁
            </span>
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-black text-white p-2 rounded mb-3"
          >
            Sign Up
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