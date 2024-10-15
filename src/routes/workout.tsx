import {
  Flex,
  Button,
  TextField,
  Heading,
  Box,
  Checkbox,
} from "@radix-ui/themes";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../contexts/auth";
import { useEffect, useState } from "react";
import { getCurrentDay, getWorkout, saveWorkout } from "../services/supabase";

export const Route = createFileRoute("/workout")({
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
  component: Workout,
});

function Workout() {
  const auth = useAuth();
  const [workout, setWorkout] = useState<any[]>([]);
  const [day, setDay] = useState<number>(0);
  const navigate = useNavigate();

  const handleComplete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    // Define the type for the accumulator
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
    if (auth.user) {
      const { id } = auth.user;
      const workout = async () => {
        if (id) {
          const currentDay = await getCurrentDay(id);
          const workoutData = await getWorkout(id, currentDay);
          setDay(currentDay);
          setWorkout(workoutData);
        }
      };
      workout();
    }
  }, []);

  return (
    <Flex direction="column" gap="3">
      <form onSubmit={handleComplete}>
        {workout.map((exercise) => (
          <Box key={exercise.exercise} mb="5">
            <Heading size="3" mb="2">
              {exercise.name
                .toLowerCase()
                .replace(/\b\w/g, (c: string) => c.toUpperCase())}
            </Heading>
            <Flex mb="2">
              <Box width="30%">Set</Box>
              <Box width="30%">Weight</Box>
              <Box width="30%">Reps</Box>
            </Flex>
            {Array.from({ length: exercise.sets }, (_, index) => (
              <Flex key={index}>
                <Box width="30%">{index + 1}</Box>
                <Box width="30%">
                  <TextField.Root
                    name={`${exercise.exercise}-weight-${index}`}
                    defaultValue={exercise.weight}
                  ></TextField.Root>
                </Box>
                <Box width="30%">
                  <TextField.Root
                    name={`${exercise.exercise}-reps-${index}`}
                    defaultValue={exercise.reps}
                  ></TextField.Root>
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
