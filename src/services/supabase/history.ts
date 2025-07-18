import { supabase } from "./client";

export const getWorkoutLog = async (userId: string) => {
  const { data, error } = await supabase
    .from("workout_log")
    .select(
      "exercise, sets, reps, weight, ...exercises!workout_log_exercise_fkey(name), created_at"
    )
    .eq("user", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching workout log:", error);
    return [];
  }

  return data;
}; 