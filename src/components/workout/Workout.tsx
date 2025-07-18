import { useEffect, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { useAuth } from "../../contexts/auth";
import { getCurrentDay } from "../../services/supabase";
import { WorkoutList } from "./WorkoutList";
import { WorkoutDetail } from "./WorkoutDetail";

export function Workout() {
  const auth = useAuth();
  const [currentDay, setCurrentDay] = useState<number>(0);
  const search = useSearch({ from: "/workout" }) as { day?: number };

  useEffect(() => {
    const fetchCurrentDay = async () => {
      if (auth.user) {
        const { id } = auth.user;
        const day = await getCurrentDay(id);
        setCurrentDay(day);
      }
    };

    fetchCurrentDay();
  }, [auth.user]);

  // If a specific day is selected, show the workout detail
  if (search.day) {
    return <WorkoutDetail day={search.day} />;
  }

  // Otherwise show the workout list
  return <WorkoutList currentDay={currentDay} />;
} 