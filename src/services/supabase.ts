// The functionality has been split into separate modules for better organization
export { supabase } from "./supabase/client";
export { checkAuth } from "./supabase/auth";
export { getCurrentDay, getWorkout, saveWorkout } from "./supabase/workout";
export { getWorkoutLog } from "./supabase/history";
export { changeWeight } from "./supabase/weights";
