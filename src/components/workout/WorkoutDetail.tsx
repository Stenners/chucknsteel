import {
  Flex,
  Button,
  TextField,
  Heading,
  Box,
  Checkbox,
} from "@radix-ui/themes";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/auth";
import { getWorkout, saveWorkout } from "../../services/supabase";
import { ExerciseActions } from "./ExerciseActions";

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

interface WorkoutDetailProps {
  day: number;
}

export function WorkoutDetail({ day }: WorkoutDetailProps) {
  const auth = useAuth();
  const [workout, setWorkout] = useState<WorkoutData[]>([]);
  const navigate = useNavigate();

  const handleWeightUpdate = (exerciseId: number, newWeight: number) => {
    setWorkout(prevWorkout => 
      prevWorkout.map(exercise => 
        exercise.exercise === exerciseId 
          ? { ...exercise, weight: newWeight }
          : exercise
      )
    );
  };

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    interface ExerciseRecord {
      exercise: number;
      weight: number[];
      reps: number[];
      sets: number;
      completed?: boolean;
    }

    const reformattedData = Object.entries(data).reduce(
      (acc: { [key: string]: ExerciseRecord }, [key, value]) => {
        const [id, field] = key.split("-");
        if (!acc[id]) {
          acc[id] = {
            exercise: parseInt(id),
            weight: [],
            reps: [],
            sets:
              workout.find((item) => item.exercise === parseInt(id))?.sets || 0,
            completed: false,
          };
        }
        if (field === "weight" || field === "reps") {
          acc[id][field].push(parseFloat(value as string));
        }
        if (field === "completed") {
          acc[id][field] = value === "on";
        }
        return acc;
      },
      {}
    );

    const filteredWorkout = Object.values(reformattedData).filter(
      (workout) => workout.completed
    );
    filteredWorkout.forEach((workout) => {
      delete workout.completed;
    });

    if (auth.user) {
      const id = auth.user.id;
      const saved = await saveWorkout(id, filteredWorkout, day);
      if (saved) {
        navigate({ to: "/" });
      }
    } else {
      console.error("User ID not set");
    }
  };

  useEffect(() => {
    const fetchWorkout = async () => {
      if (auth.user) {
        const { id } = auth.user;
        const workoutData = await getWorkout(id, day);
        setWorkout(workoutData as unknown as WorkoutData[]);
      }
    };

    fetchWorkout();
  }, [auth.user, day]);

  return (
    <Flex direction="column" gap="3">
      <Flex justify="between" align="center">
        <Heading size="4">Day {day} Workout</Heading>
        <Button variant="soft" onClick={() => navigate({ to: "/workout" })}>
          ← Back to All Workouts
        </Button>
      </Flex>
      
      <form onSubmit={handleComplete}>
        {workout.map((exercise) => (
          <Box key={exercise.exercise} mb="5">
            <Flex justify="between">
              <Heading size="3" mb="2">
                {exercise.name
                  .toLowerCase()
                  .replace(/\b\w/g, (c: string) => c.toUpperCase())}
              </Heading>
              <ExerciseActions 
                exercise={exercise} 
                day={day} 
                onWeightUpdate={handleWeightUpdate}
              />
            </Flex>
            <Flex mb="2">
              <Box width="30%">Set</Box>
              <Box width="30%">Weight</Box>
              <Box width="30%">Reps</Box>
            </Flex>
            {Array.from({ length: exercise.sets }, (_, index) => (
              <Flex key={`${exercise.exercise}-${index}`}>
                <Box width="30%">{index + 1}</Box>
                <Box width="30%">
                  <TextField.Root
                    name={`${exercise.exercise}-weight-${index}`}
                    value={exercise.weight}
                    onChange={(e) => {
                      const newWeight = parseFloat(e.target.value);
                      if (!isNaN(newWeight)) {
                        handleWeightUpdate(exercise.exercise, newWeight);
                      }
                    }}
                  />
                </Box>
                <Box width="30%">
                  <TextField.Root
                    name={`${exercise.exercise}-reps-${index}`}
                    defaultValue={exercise.reps}
                  />
                </Box>
                <Box width="10%">
                  <Flex
                    justify="center"
                    align="center"
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Checkbox
                      size="3"
                      name={`${exercise.exercise}-completed-${index}`}
                    />
                  </Flex>
                </Box>
              </Flex>
            ))}
          </Box>
        ))}
        <Flex mb="5" justify="end">
          <Button type="submit">Complete</Button>
        </Flex>
      </form>
    </Flex>
  );
} 