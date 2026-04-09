import { supabase } from "../lib/supabaseClient";

// EMAIL SIGNUP
export const signUp = async (email, password) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

// EMAIL LOGIN
export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

// LOGOUT
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// 🔥 GOOGLE LOGIN
export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://ai-doc-2-xk83.onrender.com/dashboard",
    },
  });
};

// 🔥 GITHUB LOGIN
export const signInWithGithub = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "https://ai-doc-2-xk83.onrender.com/dashboard",
    },
  });
};

// 🔥 FORGOT PASSWORD
export const resetPassword = async (email) => {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://ai-doc-2-xk83.onrender.com/reset-password",
  });
};

// 🔥 UPDATE PASSWORD (AFTER EMAIL LINK)
export const updatePassword = async (newPassword) => {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
};