import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../lib/supabaseClient";
import { signOut } from "../services/auth";

function Settings() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    user?.user_metadata?.username || ""
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const updateUsername = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { username },
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Username updated!");
      window.location.reload();
    }
  };

  const updateEmail = async () => {
    if (!email) return alert("Enter email");

    const { error } = await supabase.auth.updateUser({ email });

    if (error) alert(error.message);
    else alert("Email updated! Check inbox.");
  };

  const updatePassword = async () => {
    if (!password) return alert("Enter password");

    const { error } = await supabase.auth.updateUser({ password });

    if (error) alert(error.message);
    else alert("Password updated!");
  };

  // 🔥 REAL DELETE ACCOUNT
  const deleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch("http://localhost:8000/user/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
        }),
      });

      const data = await res.json();

      alert(data.message);

      // logout + redirect
      await signOut();
      navigate("/");

    } catch (err) {
      alert("Error deleting account");
    }
  };

  return (
    <div className="min-h-screen bg-hero text-white pt-20">
      <Navbar />

      <div className="max-w-xl mx-auto p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg">

        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-gray-300 hover:text-white"
        >
          ← Back
        </button>

        <h2 className="text-2xl mb-6 font-semibold">Settings</h2>

        {/* USERNAME */}
        <div className="mb-5">
          <input
            value={username}
            className="w-full p-2 text-black rounded"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={updateUsername}
            className="mt-2 bg-primary text-black px-4 py-2 rounded"
          >
            Update Username
          </button>
        </div>

        {/* EMAIL */}
        <div className="mb-5">
          <input
            placeholder="New Email"
            className="w-full p-2 text-black rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={updateEmail}
            className="mt-2 bg-primary text-black px-4 py-2 rounded"
          >
            Update Email
          </button>
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-2 text-black rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={updatePassword}
            className="mt-2 bg-primary text-black px-4 py-2 rounded"
          >
            Update Password
          </button>
        </div>

        {/* DELETE */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <button
            onClick={deleteAccount}
            className="bg-red-600 px-4 py-2 rounded text-white"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;