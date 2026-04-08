import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth"; // ✅ ADD THIS

function ResetPassword() {
  const [password, setPassword] = useState("");

  const handleReset = async () => {
    if (!password) return alert("Enter new password");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully!");

      // 🔥 LOGOUT FIRST
      await signOut();

      // 🔥 THEN REDIRECT TO LOGIN
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero text-white">
      <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl w-80 shadow-lg">

        <h2 className="text-xl mb-4 font-semibold">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 mb-3 text-black rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

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