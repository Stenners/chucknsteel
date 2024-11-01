import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import { getWorkoutLog } from "../services/supabase";

// Add at the top of file, before the Route definition
type Workout = {
  name: string;
  reps: number[];
  weight: number[];
  created_at: string;
};

export const Route = createFileRoute("/history")({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: History,
});

function History() {
  const [workoutLog, setWorkoutLog] = useState<Workout[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchWorkoutLog = async () => {
      if (auth.user) {
        const { id } = auth.user;
        const log = await getWorkoutLog(id);
        setWorkoutLog(log);
      }
    };
    fetchWorkoutLog();
  }, []);

  // Group workouts by date with proper typing
  const groupedWorkouts = workoutLog.reduce((acc, workout: Workout) => {
    const date = new Date(workout.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, Workout[]>);

  return (
    <div>
      <h1>Workout History</h1>
      {Object.keys(groupedWorkouts).length > 0 ? (
        Object.entries(groupedWorkouts).map(([date, workouts]) => (
          <div key={date}>
            <h2>{date}</h2>
            {workouts.map((workout: Workout) => (
              <div key={workout.name}>
                {workout.name}: {workout.weight[0]} - {workout.reps.toString()}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No workout history available.</p>
      )}
    </div>
  );
}
