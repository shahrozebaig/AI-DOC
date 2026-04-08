import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); 

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return alert("Enter both fields");
    }

    if (password !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");

      await signOut();
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero text-white">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-80 shadow-lg">

        <h2 className="text-xl mb-4 font-semibold">
          Reset Password
        </h2>

        {/* PASSWORD */}
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-2 text-black rounded"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            👁
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="w-full p-2 text-black rounded"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          >
            👁
          </span>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-primary text-black p-2 rounded"
        >
          Update Password
        </button>

      </div>
    </div>
  );
}
export default ResetPassword;