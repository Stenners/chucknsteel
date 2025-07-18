import { supabase } from "./client";

export async function changeWeight(
  userId: string,
  exerciseId: number,
  day: number,
  newWeight?: number
): Promise<number | null> {
  try {
    const { data: exerciseData, error: fetchError } = await supabase
      .from("gzclp_exercise_prog")
      .select("weight, increment")
      .eq("user", userId)
      .eq("exercise", exerciseId)
      .eq("day", day)
      .single();

    if (fetchError) {
      console.error("Error fetching exercise data:", fetchError);
      return null;
    }

    const weightToSet = newWeight !== undefined 
      ? newWeight 
      : (exerciseData?.weight || 0) + (exerciseData?.increment || 5);

    const { data: updatedWeight, error: updateError } = await supabase
      .from("gzclp_exercise_prog")
      .update({ weight: weightToSet })
      .eq("user", userId)
      .eq("exercise", exerciseId)
      .eq("day", day)
      .select("weight")
      .single();

    if (updateError) {
      console.error("Error updating weight:", updateError);
      return null;
    }

    return updatedWeight?.weight || null;
  } catch (error) {
    console.error("Error in changeWeight:", error);
    return null;
  }
} 