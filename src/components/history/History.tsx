import { useState, useEffect } from "react";
import { Heading } from "@radix-ui/themes";
import { useAuth } from "../../contexts/auth";
import { getWorkoutLog } from "../../services/supabase";
import "./history.css";

type Workout = {
  name: string;
  reps: number[];
  weight: number[];
  created_at: string;
};

export function History() {
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
    <div className="history-container">
      <Heading size="6" mb="4">Workout History</Heading>
      {Object.keys(groupedWorkouts).length > 0 ? (
        Object.entries(groupedWorkouts).map(([date, workouts]) => (
          <div key={date} className="workout-day">
            <Heading size="4" className="workout-date">{date}</Heading>
            {workouts.map((workout: Workout) => (
              <div key={workout.name} className="workout-item">
                {workout.name}: {workout.weight[0]}kg - {workout.reps.toString()}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p className="empty-state">No workout history available.</p>
      )}
    </div>
  );
} 