import { supabase } from "../lib/supabaseClient";

export const signUp = async (email, password) => {
  return await supabase.auth.signUp({ email, password });
};

export const signIn = async (email, password) => {
  return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// 🔥 OAuth (we'll enable later in Supabase)
export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "google",
  });
};

export const signInWithGithub = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: "github",
  });
};