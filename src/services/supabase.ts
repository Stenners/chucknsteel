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

export const getWorkout = async (userId: string) => {
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

  const currentDay = currentWorkoutData?.day || 1; // Default to day 1 if not found

  const { data, error } = await supabase
    .from("gzclp-exercise-prog")
    .select(
      `tier, sets, reps, weight, ...exercises!gzclp-exercise-prog_exercise_fkey(name)`
    )
    .eq("user", userId)
    .eq("day", currentDay)
    .order("tier");
  if (error) {
    console.error("Error executing query:", error);
    return error;
  }
  return data;
};

export const saveWorkout = async (userId: string, workoutData: WorkoutExercise[]) => {
  try {
   
    

    // Prepare the data for upsert
    const upsertData = workoutData.map(exercise => ({
      user: userId,
      day: currentDay,
      exercise: exercise.id,
      weight: exercise.weight,
      reps: exercise.reps,
      sets: exercise.sets,
      tier: exercise.tier
    }));

    // Perform the upsert operation
    const { data, error } = await supabase
      .from("gzclp-exercise-prog")
      .upsert(upsertData, { onConflict: 'user,day,exercise' });

    if (error) {
      console.error("Error saving workout:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Unexpected error saving workout:", error);
    return { success: false, error };
  }
};

interface WorkoutExercise {
  id: number;
  name: string;
  tier: number;
  sets: number;
  reps: number;
  weight: number;
}


