import { supabase } from "./client";

export const checkAuth = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error checking auth:", error);
    return null;
  }
}; 