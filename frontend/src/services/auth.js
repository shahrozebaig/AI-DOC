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

// 🔥 GOOGLE LOGIN (UPDATED)
export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/dashboard",
    },
  });
};

// 🔥 GITHUB LOGIN (UPDATED)
export const signInWithGithub = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/dashboard",
    },
  });
};