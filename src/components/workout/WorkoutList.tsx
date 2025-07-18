import {
  Flex,
  Button,
  Heading,
  Box,
  Card,
  Text,
} from "@radix-ui/themes";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { getWorkout } from "../../services/supabase";

// Define an interface for the workout data
interface WorkoutData {
  id: number;
  name: string;
  completed: boolean;
  exercise: number;
  sets: number;
  weight: number;
  reps: number;
}

interface WorkoutListProps {
  currentDay: number;
}

export function WorkoutList({ currentDay }: WorkoutListProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [allWorkouts, setAllWorkouts] = useState<{ [key: number]: WorkoutData[] }>({});

  useEffect(() => {
    const fetchAllWorkouts = async () => {
      if (auth.user) {
        const workouts: { [key: number]: WorkoutData[] } = {};
        for (let day = 1; day <= 4; day++) {
          const workoutData = await getWorkout(auth.user.id, day);
          workouts[day] = workoutData as unknown as WorkoutData[];
        }
        setAllWorkouts(workouts);
      }
    };

    fetchAllWorkouts();
  }, [auth.user]);

  const handleWorkoutSelect = (day: number) => {
    navigate({ to: "/workout", search: { day } });
  };

  return (
    <Flex direction="column" gap="4">
      <Heading size="4">All Workouts</Heading>
      {[1, 2, 3, 4].map((day) => (
        <Card 
          key={day} 
          style={{ 
            border: day === currentDay ? '2px solid #007bff' : '1px solid #ddd',
            backgroundColor: day === currentDay ? '#f8f9fa' : 'white'
          }}
        >
          <Flex justify="between" align="center" p="3">
            <Box>
              <Heading size="3">Day {day}</Heading>
              <Text size="2" color="gray">
                {allWorkouts[day]?.length || 0} exercises
              </Text>
            </Box>
            <Button 
              variant={day === currentDay ? "solid" : "soft"}
              onClick={() => handleWorkoutSelect(day)}
            >
              {day === currentDay ? "Current" : "View"}
            </Button>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
} 