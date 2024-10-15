import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const supabase: SupabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

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

export const getCurrentDay = async (userId: string) => {
  // Get the current workout day for the user
  const { data: currentWorkoutData, error: currentWorkoutError } =
    await supabase
      .from("current_workout")
      .select("day")
      .eq("user", userId)
      .single();

  if (currentWorkoutError) {
    console.error("Error fetching current workout day:", currentWorkoutError);
    return [];
  }

  const currentDay = currentWorkoutData?.day || 1;
  return currentDay;
};

export const getWorkout = async (userId: string, currentDay: number) => {
  const { data, error } = await supabase
    .from("gzclp_exercise_prog")
    .select(
      `exercise, tier, sets, reps, weight, ...exercises!gzclp-exercise-prog_exercise_fkey(name)`
    )
    .eq("user", userId)
    .eq("day", currentDay)
    .order("tier");

  if (error) {
    console.error("Error executing query:", error);
    return [];
  }
  return data;
};

export const saveWorkout = async (
  userId: string,
  workout: any[],
  day: number
) => {
  const workoutWithUser = workout.map((exercise) => ({
    ...exercise,
    user: userId,
    program: "GZCLP",
  }));

  const { error } = await supabase.from("workout_log").insert(workoutWithUser);

  if (error) {
    console.error("Error saving workout:", error);
    return error;
  }

  const nextDay = day === 4 ? 1 : day + 1;

  const { error: updateError } = await supabase
    .from("current_workout")
    .update({ day: nextDay })
    .eq("user", userId)

  if (updateError) {
    console.error("Error updating day:", updateError);
    return updateError;
  }

  return true;
};
